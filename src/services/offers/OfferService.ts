import prisma from "@/lib/db/prisma";

export class OfferService {
  static async getAllExternalOffers(gameSlug?: string) {
    const whereClause: any = { active: true };
    if (gameSlug && gameSlug !== "all") {
      whereClause.game = { slug: gameSlug };
    }

    return await prisma.externalOffer.findMany({
      where: whereClause,
      include: {
        store: true,
        game: { select: { id: true, name: true, slug: true, theme: true } },
        product: { select: { id: true, name: true, price: true, platform: true } },
      },
      orderBy: { price: "asc" },
    });
  }

  static async getComparisonForGame(gameId: string) {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        products: {
          where: { active: true },
          include: {
            _count: {
              select: {
                digitalKeys: { where: { status: "AVAILABLE" } },
              },
            },
          },
          orderBy: { price: "asc" },
        },
        externalOffers: {
          where: { active: true },
          include: { store: true },
          orderBy: { price: "asc" },
        },
      },
    });

    if (!game) return null;

    // Normalização das ofertas internas e externas para comparação unificada
    const ownOffers = game.products.map((p) => ({
      source: "PROJECSONA" as const,
      storeName: "ProjecSona Store (Oficial)",
      storeLogo: null,
      isInternal: true,
      productName: p.name,
      platform: p.platform,
      price: p.price,
      originalPrice: p.originalPrice,
      inStock: p._count.digitalKeys > 0,
      stockCount: p._count.digitalKeys,
      url: `/produtos/${p.slug}`,
      lastUpdated: p.updatedAt,
    }));

    const externalOffersList = game.externalOffers.map((o) => ({
      source: "EXTERNAL" as const,
      storeName: o.store.name,
      storeLogo: o.store.logoUrl,
      isInternal: false,
      productName: `${game.name} (${o.platform})`,
      platform: o.platform,
      price: o.price,
      originalPrice: o.originalPrice,
      inStock: true,
      stockCount: null,
      url: o.url,
      lastUpdated: o.lastUpdatedAt,
    }));

    const combined = [...ownOffers, ...externalOffersList].sort((a, b) => a.price - b.price);
    const lowestPrice = combined.length > 0 ? combined[0].price : null;

    return {
      game,
      lowestPrice,
      offers: combined,
    };
  }

  static async getStores() {
    return await prisma.externalStore.findMany({
      include: {
        _count: { select: { offers: true } },
      },
      orderBy: { name: "asc" },
    });
  }
}
