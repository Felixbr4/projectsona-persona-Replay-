import prisma from "@/lib/db/prisma";
import { hashPassword, verifyPassword, generateSecureToken, hashToken } from "@/lib/security/crypto";
import { emailService } from "@/lib/email/EmailService";

export class UserService {
  static async register(data: { name: string; email: string; password: string }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new Error("Este endereço de e-mail já está em uso.");
    }

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        passwordHash,
        role: "USER",
        status: "ACTIVE",
        emailVerified: null,
      },
    });

    // Gerar token de verificação (válido por 24 horas)
    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Enviar email de verificação
    await emailService.sendVerificationEmail(user.email, user.name, rawToken);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: false,
      devVerificationToken: rawToken, // Facilita testes em desenvolvimento
    };
  }

  static async verifyEmail(rawToken: string) {
    const tokenHash = hashToken(rawToken);
    const record = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!record) {
      throw new Error("Token de verificação inválido ou inexistente.");
    }

    if (record.usedAt) {
      throw new Error("Este link de verificação já foi utilizado anteriormente.");
    }

    if (new Date() > record.expiresAt) {
      throw new Error("O link de verificação expirou. Solicite um novo link.");
    }

    // Atualizar usuário e marcar token como usado
    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: new Date() },
      }),
      prisma.emailVerificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { success: true, email: record.user.email };
  }

  static async requestPasswordReset(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // Prevenção contra enumeração de usuários (sempre retorna sucesso)
    if (!user) {
      return { success: true };
    }

    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    await emailService.sendPasswordResetEmail(user.email, user.name, rawToken);

    return { success: true, devResetToken: rawToken };
  }

  static async resetPassword(rawToken: string, newPass: string) {
    const tokenHash = hashToken(rawToken);
    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!record || record.usedAt || new Date() > record.expiresAt) {
      throw new Error("Token de redefinição de senha inválido ou expirado.");
    }

    const newHash = await hashPassword(newPass);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash: newHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { success: true };
  }

  static async authenticate(email: string, passwordPlain: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      throw new Error("Credenciais inválidas. Verifique seu e-mail e senha.");
    }

    if (user.status === "BLOCKED") {
      throw new Error("Esta conta está temporariamente bloqueada. Entre em contato com o suporte.");
    }

    const isValid = await verifyPassword(passwordPlain, user.passwordHash);
    if (!isValid) {
      throw new Error("Credenciais inválidas. Verifique seu e-mail e senha.");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: Boolean(user.emailVerified),
    };
  }
}
