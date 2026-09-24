import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { externalOfferSchema } from "@/lib/validation/schemas";

export async function GET() {
  try {
    await requireAdmin();
    const offers = await prisma.externalOffer.findMany({
      include: {
        store: true,
        game: true,
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });
    const stores = await prisma.externalStore.findMany();
    const games = await prisma.game.findMany({ select: { id: true, name: true } });

    return NextResponse.json({ offers, stores, games });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Acesso negado" }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const validated = externalOfferSchema.parse(body);

    const offer = await prisma.externalOffer.create({
      data: {
        storeId: validated.storeId,
        gameId: validated.gameId,
        productId: validated.productId || null,
        price: validated.price,
        originalPrice: validated.originalPrice,
        url: validated.url,
        platform: validated.platform,
        active: validated.active,
      },
    });

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao criar oferta" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    await prisma.externalOffer.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Oferta removida com sucesso." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao remover oferta" }, { status: 400 });
  }
}
