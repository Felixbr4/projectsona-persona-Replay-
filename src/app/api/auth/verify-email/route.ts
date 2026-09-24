import { NextResponse } from "next/server";
import { verifyEmailSchema } from "@/lib/validation/schemas";
import { UserService } from "@/services/users/UserService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = verifyEmailSchema.parse(body);

    const result = await UserService.verifyEmail(validated.token);

    return NextResponse.json({
      success: true,
      message: "E-mail verificado com sucesso! Sua conta está agora totalmente liberada.",
      email: result.email,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Falha na verificação do e-mail." },
      { status: 400 }
    );
  }
}
