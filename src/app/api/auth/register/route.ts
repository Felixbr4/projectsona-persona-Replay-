import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation/schemas";
import { UserService } from "@/services/users/UserService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const user = await UserService.register({
      name: validated.name,
      email: validated.email,
      password: validated.password,
    });

    return NextResponse.json({
      success: true,
      message: "Conta criada com sucesso! Verifique seu e-mail para ativar sua conta.",
      user,
    });
  } catch (error: any) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { error: error.message || "Falha ao registrar usuário." },
      { status: 400 }
    );
  }
}
