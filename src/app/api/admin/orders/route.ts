import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { OrderService } from "@/services/orders/OrderService";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    await requireAdmin();
    const orders = await OrderService.getAdminOrders();
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Acesso negado" }, { status: 403 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID e novo status são obrigatórios." }, { status: 400 });
    }

    const updated = await OrderService.updateOrderStatus(id, status);
    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao atualizar pedido" }, { status: 400 });
  }
}
