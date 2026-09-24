import prisma from "@/lib/db/prisma";

export interface ProductFilterOptions {
  gameSlug?: string;
  platform?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "price-asc" | "price-desc" | "discount" | "name" | "recent";
  onlyAvailable?: boolean;
}

export class ProductService {
  static async getCatalog(filters: ProductFilterOptions = {}) {
    const whereClause: any = {
      active: true,
    };

    if (filters.gameSlug && filters.gameSlug !== "all") {
      whereClause.game = { slug: filters.gameSlug };
    }

    if (filters.platform && filters.platform !== "all") {
      whereClause.platform = filters.platform;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      whereClause.price = {};
      if (filters.minPrice !== undefined) whereClause.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) whereClause.price.lte = filters.maxPrice;
    }

    if (filters.search) {
      whereClause.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    let orderBy: any = { isFeatured: "desc" };
    switch (filters.sortBy) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "name":
        orderBy = { name: "asc" };
        break;
      case "recent":
        orderBy = { createdAt: "desc" };
        break;
      default:
        orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        game: {
          select: { id: true, name: true, slug: true, theme: true },
        },
        _count: {
          select: {
            digitalKeys: {
              where: { status: "AVAILABLE" },
            },
          },
        },
      },
      orderBy,
    });

    const mapped = products.map((prod) => {
      const availableKeys = prod._count.digitalKeys;
      const discountPercentage =
        prod.originalPrice && prod.originalPrice > prod.price
          ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
          : 0;

      return {
        ...prod,
        availableStock: availableKeys,
        discountPercentage,
        inStock: availableKeys > 0,
      };
    });

    if (filters.onlyAvailable) {
      return mapped.filter((p) => p.inStock);
    }

    return mapped;
  }

  static async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        game: {
          include: {
            externalOffers: {
              where: { active: true },
              include: { store: true },
              orderBy: { price: "asc" },
            },
          },
        },
        _count: {
          select: {
            digitalKeys: {
              where: { status: "AVAILABLE" },
            },
          },
        },
      },
    });

    if (!product) return null;

    const availableKeys = product._count.digitalKeys;
    const discountPercentage =
      product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return {
      ...product,
      availableStock: availableKeys,
      discountPercentage,
      inStock: availableKeys > 0,
    };
  }
}
