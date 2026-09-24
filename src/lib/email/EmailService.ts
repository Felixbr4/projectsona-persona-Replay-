export interface IEmailService {
  sendVerificationEmail(to: string, name: string, token: string): Promise<boolean>;
  sendPasswordResetEmail(to: string, name: string, token: string): Promise<boolean>;
  sendOrderConfirmationEmail(to: string, orderNumber: string, total: number): Promise<boolean>;
}

class MockEmailService implements IEmailService {
  private appUrl: string;

  constructor() {
    this.appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  }

  async sendVerificationEmail(to: string, name: string, token: string): Promise<boolean> {
    const verifyUrl = `${this.appUrl}/verificar-email?token=${token}`;
    console.log(`\n📧 [EMAIL MOCK] Para: ${to} (${name})`);
    console.log(`🔗 Assunto: Confirme seu cadastro no ProjecSona`);
    console.log(`💌 Link de Verificação: ${verifyUrl}`);
    console.log(`⏰ Token expira em 24 horas.\n`);
    return true;
  }

  async sendPasswordResetEmail(to: string, name: string, token: string): Promise<boolean> {
    const resetUrl = `${this.appUrl}/redefinir-senha?token=${token}`;
    console.log(`\n📧 [EMAIL MOCK] Para: ${to} (${name})`);
    console.log(`🔑 Assunto: Recuperação de Acesso - ProjecSona`);
    console.log(`💌 Link para Redefinir Senha: ${resetUrl}`);
    console.log(`⏰ Token expira em 1 hora.\n`);
    return true;
  }

  async sendOrderConfirmationEmail(to: string, orderNumber: string, total: number): Promise<boolean> {
    console.log(`\n📧 [EMAIL MOCK] Para: ${to}`);
    console.log(`🎮 Assunto: Pedido Confirmado #${orderNumber}`);
    console.log(`💰 Total Pago: R$ ${total.toFixed(2)}`);
    console.log(`🔑 Suas chaves Steam estão disponíveis na sua conta: ${this.appUrl}/conta/pedidos\n`);
    return true;
  }
}

// Extensível para Resend ou SMTP conforme EMAIL_PROVIDER no .env
export function getEmailService(): IEmailService {
  return new MockEmailService();
}

export const emailService = getEmailService();
