import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { productSchema } from "@/lib/validation/schemas";

export async function GET() {
  try {
    await requireAdmin();

    const products = await prisma.product.findMany({
      include: {
        game: true,
        _count: {
          select: {
            digitalKeys: { where: { status: "AVAILABLE" } },
            orderItems: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Acesso negado" }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const validated = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        gameId: validated.gameId,
        name: validated.name,
        slug: validated.slug,
        edition: validated.edition,
        description: validated.description,
        price: validated.price,
        originalPrice: validated.originalPrice,
        platform: validated.platform,
        active: validated.active,
        isFeatured: validated.isFeatured,
        image: validated.image || null,
        stockQuantity: 0,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao criar produto" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "ID do produto é obrigatório." }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao atualizar produto" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    // Exclusão Lógica para preservar histórico de pedidos
    const updated = await prisma.product.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({
      success: true,
      message: "Produto desativado com sucesso (exclusão lógica para integridade histórica).",
      product: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao excluir produto" }, { status: 400 });
  }
}
