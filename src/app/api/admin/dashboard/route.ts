import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalUsers,
      totalOrders,
      completedOrders,
      productsCount,
      outOfStockCount,
      totalKeysCount,
      availableKeysCount,
      soldKeysCount,
      recentOrders,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.findMany({ where: { status: "COMPLETED" }, select: { totalAmount: true } }),
      prisma.product.count({ where: { active: true } }),
      prisma.product.count({ where: { active: true, stockQuantity: 0 } }),
      prisma.digitalKey.count(),
      prisma.digitalKey.count({ where: { status: "AVAILABLE" } }),
      prisma.digitalKey.count({ where: { status: "SOLD" } }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: true } },
          payment: true,
        },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, emailVerified: true, createdAt: true },
      }),
    ]);

    const totalRevenue = completedOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalOrders,
        totalRevenue,
        activeProducts: productsCount,
        outOfStockProducts: outOfStockCount,
        keys: {
          total: totalKeysCount,
          available: availableKeysCount,
          sold: soldKeysCount,
        },
      },
      recentOrders,
      recentUsers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Acesso restrito a administradores." },
      { status: 403 }
    );
  }
}
