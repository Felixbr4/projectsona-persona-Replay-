export interface PaymentRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  method: "PIX" | "CREDIT_CARD" | "MOCK";
  cardDetails?: {
    number?: string;
    holder?: string;
    expiry?: string;
    cvv?: string;
  };
}

export interface PaymentResult {
  success: boolean;
  status: "APPROVED" | "PENDING" | "DECLINED";
  transactionRef: string;
  qrCode?: string;
  message?: string;
}

export interface IPaymentGateway {
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
  getPaymentStatus(transactionRef: string): Promise<PaymentResult>;
  refundPayment(transactionRef: string, amount: number): Promise<boolean>;
}

/**
 * Development Mock Payment Gateway
 * Realiza simulação de pagamento transacional para testes e demonstrações acadêmicas/profissionais
 */
export class DevelopmentPaymentGateway implements IPaymentGateway {
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    const timestamp = Date.now();
    const transactionRef = `DEV-TX-${request.method}-${timestamp}`;

    // Simulação com validação de formato
    if (request.method === "CREDIT_CARD") {
      // Se cartão terminar em 0000, simula recusa para testes de fluxo negativo
      if (request.cardDetails?.number?.endsWith("0000")) {
        return {
          success: false,
          status: "DECLINED",
          transactionRef,
          message: "Transação recusada pela operadora do cartão (Simulação de teste).",
        };
      }
    }

    return {
      success: true,
      status: "APPROVED",
      transactionRef,
      qrCode: request.method === "PIX" ? `00020126580014BR.GOV.BCB.PIX0136projecsona-pix-key-${request.orderNumber}5204000053039865405${request.amount.toFixed(2)}5802BR5910PROJECSONA6009SAOPAULO62070503***6304` : undefined,
      message: "Pagamento processado e aprovado com sucesso via Development Gateway!",
    };
  }

  async getPaymentStatus(transactionRef: string): Promise<PaymentResult> {
    return {
      success: true,
      status: "APPROVED",
      transactionRef,
    };
  }

  async refundPayment(transactionRef: string, _amount: number): Promise<boolean> {
    console.log(`💸 Reembolso de ${transactionRef} processado no Development Gateway.`);
    return true;
  }
}

export function getPaymentGateway(): IPaymentGateway {
  return new DevelopmentPaymentGateway();
}

export const paymentGateway = getPaymentGateway();
