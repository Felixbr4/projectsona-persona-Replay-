import { NextResponse } from "next/server";
import { ProductService } from "@/services/products/ProductService";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await ProductService.getProductBySlug(params.slug);
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao buscar produto" }, { status: 500 });
  }
}
