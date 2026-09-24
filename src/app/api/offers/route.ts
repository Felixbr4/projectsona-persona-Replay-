import { NextResponse } from "next/server";
import { OfferService } from "@/services/offers/OfferService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId");
    const gameSlug = searchParams.get("gameSlug");

    if (gameId) {
      const comparison = await OfferService.getComparisonForGame(gameId);
      return NextResponse.json({ comparison });
    }

    const offers = await OfferService.getAllExternalOffers(gameSlug || undefined);
    return NextResponse.json({ offers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao buscar ofertas" }, { status: 500 });
  }
}
