import { NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/validation/schemas";
import { UserService } from "@/services/users/UserService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = resetPasswordSchema.parse(body);

    await UserService.resetPassword(validated.token, validated.password);

    return NextResponse.json({
      success: true,
      message: "Sua senha foi redefinida com sucesso! Você já pode realizar o login com as novas credenciais.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao redefinir a senha." },
      { status: 400 }
    );
  }
}
