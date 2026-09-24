import prisma from "@/lib/db/prisma";
import { paymentGateway, PaymentRequest } from "@/lib/payments/PaymentGateway";
import { emailService } from "@/lib/email/EmailService";

export interface CheckoutItemRequest {
  productId: string;
  quantity: number;
}

export class OrderService {
  /**
   * Processa o checkout completo com transação atômica, validação de chaves e baixa de estoque
   */
  static async processCheckout(
    userId: string,
    items: CheckoutItemRequest[],
    paymentInfo: {
      method: "PIX" | "CREDIT_CARD" | "MOCK";
      cardNumber?: string;
      cardHolder?: string;
      cardExpiry?: string;
      cardCvv?: string;
      notes?: string;
    }
  ) {
    if (!items || items.length === 0) {
      throw new Error("O carrinho de compras está vazio.");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    // 1. Validar disponibilidade e estoque real de cada produto
    const productRecords: Array<{
      product: any;
      quantity: number;
      unitPrice: number;
      subtotal: number;
      availableKeys: any[];
    }> = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const prod = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          digitalKeys: {
            where: { status: "AVAILABLE" },
          },
        },
      });

      if (!prod || !prod.active) {
        throw new Error(`O produto "${prod?.name || item.productId}" não está mais disponível.`);
      }

      if (prod.digitalKeys.length < item.quantity) {
        throw new Error(
          `Estoque insuficiente para "${prod.name}". Disponível: ${prod.digitalKeys.length} unidade(s).`
        );
      }

      productRecords.push({
        product: prod,
        quantity: item.quantity,
        unitPrice: prod.price,
        subtotal: prod.price * item.quantity,
        availableKeys: prod.digitalKeys,
      });

      calculatedTotal += prod.price * item.quantity;
    }

    const orderNumber = `ORD-SONA-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // 2. Executar a transação de criação do pedido e reserva de chaves
    const result = await prisma.$transaction(async (tx) => {
      // Criar o Pedido
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          totalAmount: calculatedTotal,
          status: "PENDING_PAYMENT",
          notes: paymentInfo.notes,
        },
      });

      // Criar os Itens do Pedido
      const createdItems = [];
      for (const line of productRecords) {
        for (let i = 0; i < line.quantity; i++) {
          const item = await tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: line.product.id,
              quantity: 1,
              unitPrice: line.unitPrice,
              subtotal: line.unitPrice,
            },
          });
          createdItems.push({ ...item, product: line.product });
        }
      }

      // Criar o Registro de Pagamento
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          method: paymentInfo.method,
          status: "PENDING",
          amount: calculatedTotal,
        },
      });

      // Processar o pagamento no Gateway
      const payReq: PaymentRequest = {
        orderId: order.id,
        orderNumber,
        amount: calculatedTotal,
        method: paymentInfo.method,
        cardDetails: {
          number: paymentInfo.cardNumber,
          holder: paymentInfo.cardHolder,
          expiry: paymentInfo.cardExpiry,
          cvv: paymentInfo.cardCvv,
        },
      };

      const payResult = await paymentGateway.processPayment(payReq);

      if (payResult.success && payResult.status === "APPROVED") {
        // Atualizar Pagamento para Aprovado
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "APPROVED",
            paidAt: new Date(),
            transactionRef: payResult.transactionRef,
          },
        });

        // Alocar as chaves digitais disponíveis
        for (const item of createdItems) {
          const keyToSell = await tx.digitalKey.findFirst({
            where: {
              productId: item.productId,
              status: "AVAILABLE",
            },
          });

          if (!keyToSell) {
            throw new Error(`Falha crítica: Chave não encontrada para ${item.product.name}`);
          }

          await tx.digitalKey.update({
            where: { id: keyToSell.id },
            data: {
              status: "SOLD",
              soldAt: new Date(),
              orderItemId: item.id,
            },
          });

          // Atualizar contagem de estoque do produto
          const remainingAvailable = await tx.digitalKey.count({
            where: { productId: item.productId, status: "AVAILABLE" },
          });

          await tx.product.update({
            where: { id: item.productId },
            data: { stockQuantity: remainingAvailable },
          });
        }

        // Atualizar Status do Pedido para COMPLETED
        const completedOrder = await tx.order.update({
          where: { id: order.id },
          data: { status: "COMPLETED" },
          include: {
            items: {
              include: {
                product: { include: { game: true } },
                digitalKey: true,
              },
            },
            payment: true,
          },
        });

        return {
          order: completedOrder,
          paymentResult: payResult,
        };
      } else {
        // Se pagamento foi recusado
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "DECLINED",
            transactionRef: payResult.transactionRef,
          },
        });

        await tx.order.update({
          where: { id: order.id },
          data: { status: "CANCELLED" },
        });

        throw new Error(payResult.message || "Pagamento recusado.");
      }
    });

    // Enviar e-mail de confirmação assincronamente
    emailService.sendOrderConfirmationEmail(user.email, result.order.orderNumber, result.order.totalAmount);

    return result;
  }

  static async getUserOrders(userId: string) {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, platform: true, image: true, game: true },
            },
            digitalKey: {
              select: { id: true, status: true, viewedAt: true },
            },
          },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getOrderById(orderId: string, userId: string, isAdmin = false) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: { include: { game: true } },
            digitalKey: {
              select: { id: true, status: true, viewedAt: true },
            },
          },
        },
        payment: true,
      },
    });

    if (!order) return null;

    if (!isAdmin && order.userId !== userId) {
      throw new Error("Acesso negado.");
    }

    return order;
  }

  static async getAdminOrders() {
    return await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: { product: true },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateOrderStatus(orderId: string, status: string) {
    return await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
