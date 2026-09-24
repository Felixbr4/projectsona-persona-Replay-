import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation/schemas";
import { UserService } from "@/services/users/UserService";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const user = await UserService.authenticate(validated.email, validated.password);

    const token = createSessionToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: `Bem-vindo de volta, ${user.name}!`,
      user,
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: error.message || "E-mail ou senha incorretos." },
      { status: 401 }
    );
  }
}
