import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { OrderService } from "@/services/orders/OrderService";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    const order = await OrderService.getOrderById(
      params.id,
      session.id,
      session.role === "ADMIN"
    );

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao consultar pedido" }, { status: 403 });
  }
}
