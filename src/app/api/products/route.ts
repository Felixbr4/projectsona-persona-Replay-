import { NextResponse } from "next/server";
import { ProductService } from "@/services/products/ProductService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const gameSlug = searchParams.get("game") || undefined;
    const platform = searchParams.get("platform") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const search = searchParams.get("search") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || undefined;
    const onlyAvailable = searchParams.get("onlyAvailable") === "true";

    const products = await ProductService.getCatalog({
      gameSlug,
      platform,
      minPrice,
      maxPrice,
      search,
      sortBy,
      onlyAvailable,
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao consultar produtos" }, { status: 500 });
  }
}
