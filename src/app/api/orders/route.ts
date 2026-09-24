import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { OrderService } from "@/services/orders/OrderService";
import { checkoutSchema } from "@/lib/validation/schemas";
import { z } from "zod";

const createOrderBodySchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1),
    })
  ).min(1, "Carrinho vazio."),
  payment: checkoutSchema,
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Faça login para visualizar seus pedidos." }, { status: 401 });
    }

    const orders = await OrderService.getUserOrders(session.id);
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao consultar pedidos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Você precisa estar conectado para finalizar a compra." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = createOrderBodySchema.parse(body);

    const result = await OrderService.processCheckout(
      session.id,
      validated.items,
      {
        method: validated.payment.paymentMethod,
        cardNumber: validated.payment.cardNumber,
        cardHolder: validated.payment.cardHolder,
        cardExpiry: validated.payment.cardExpiry,
        cardCvv: validated.payment.cardCvv,
        notes: validated.payment.customerNotes,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Pedido aprovado e finalizado com sucesso!",
      order: result.order,
      paymentResult: result.paymentResult,
    });
  } catch (error: any) {
    console.error("Checkout order error:", error);
    return NextResponse.json(
      { error: error.message || "Falha ao processar checkout." },
      { status: 400 }
    );
  }
}
