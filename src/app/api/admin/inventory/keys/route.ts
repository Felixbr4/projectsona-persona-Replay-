import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { InventoryService } from "@/services/inventory/InventoryService";
import { digitalKeyBatchSchema } from "@/lib/validation/schemas";

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (productId) {
      const keys = await InventoryService.getMaskedProductKeys(productId);
      return NextResponse.json({ keys });
    }

    const overview = await InventoryService.getInventoryOverview();
    return NextResponse.json({ overview });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Acesso negado" }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const validated = digitalKeyBatchSchema.parse(body);

    const result = await InventoryService.addKeys(validated.productId, validated.keys);

    return NextResponse.json({
      success: true,
      message: `${result.addedCount} chave(s) Steam criptografada(s) e adicionada(s) com sucesso!`,
      totalAvailable: result.totalAvailable,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao adicionar chaves" }, { status: 400 });
  }
}
