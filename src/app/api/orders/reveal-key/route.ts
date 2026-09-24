import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { InventoryService } from "@/services/inventory/InventoryService";
import { z } from "zod";

const revealSchema = z.object({
  orderItemId: z.string().min(1, "Item do pedido obrigatório"),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    const body = await req.json();
    const { orderItemId } = revealSchema.parse(body);

    const keyData = await InventoryService.revealKeyForUser(session.id, orderItemId);

    return NextResponse.json({
      success: true,
      keyData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Não foi possível recuperar a chave." },
      { status: 403 }
    );
  }
}
