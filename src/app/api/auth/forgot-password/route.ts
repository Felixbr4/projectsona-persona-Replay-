import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validation/schemas";
import { UserService } from "@/services/users/UserService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = forgotPasswordSchema.parse(body);

    const result = await UserService.requestPasswordReset(validated.email);

    return NextResponse.json({
      success: true,
      message: "Se o e-mail informado estiver cadastrado, as instruções para redefinição foram enviadas.",
      devToken: (result as any).devResetToken, // Visível apenas para testes locais
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao processar solicitação." },
      { status: 400 }
    );
  }
}
