import prisma from "@/lib/db/prisma";

export class GameService {
  static async getAllGames() {
    return await prisma.game.findMany({
      where: { active: true },
      include: {
        _count: {
          select: { products: true, characters: true, externalOffers: true },
        },
      },
      orderBy: { releaseDate: "desc" },
    });
  }

  static async getGameBySlug(slug: string) {
    const game = await prisma.game.findUnique({
      where: { slug },
      include: {
        characters: {
          orderBy: { createdAt: "asc" },
        },
        products: {
          where: { active: true },
          include: {
            _count: {
              select: {
                digitalKeys: {
                  where: { status: "AVAILABLE" },
                },
              },
            },
          },
          orderBy: { price: "asc" },
        },
        externalOffers: {
          where: { active: true },
          include: {
            store: true,
          },
          orderBy: { price: "asc" },
        },
      },
    });

    if (!game) return null;

    // Calcular o menor preço encontrado (entre a loja própria e ofertas externas)
    const storePrices = game.products.map((p) => p.price);
    const externalPrices = game.externalOffers.map((o) => o.price);
    const allPrices = [...storePrices, ...externalPrices];
    const lowestPrice = allPrices.length > 0 ? Math.min(...allPrices) : null;

    return {
      ...game,
      lowestPrice,
    };
  }

  static async getGameCharacters(gameId: string) {
    return await prisma.character.findMany({
      where: { gameId },
      orderBy: { createdAt: "asc" },
    });
  }
}
