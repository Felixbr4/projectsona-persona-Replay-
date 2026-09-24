import prisma from "@/lib/db/prisma";
import { encryptDigitalKey, decryptDigitalKey, maskDigitalKey, hashToken } from "@/lib/security/crypto";

export class InventoryService {
  /**
   * Adiciona um lote de chaves Steam criptografadas a um produto
   */
  static async addKeys(productId: string, plainKeys: string[]) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    const createdKeys: any[] = [];
    for (const key of plainKeys) {
      const trimmed = key.trim();
      if (!trimmed) continue;

      const encrypted = encryptDigitalKey(trimmed);
      const codeHash = hashToken(trimmed);

      // Evita duplicata da mesma chave
      const exists = await prisma.digitalKey.findUnique({
        where: { codeHash },
      });

      if (exists) continue;

      const record = await prisma.digitalKey.create({
        data: {
          productId,
          codeEncrypted: encrypted,
          codeHash,
          status: "AVAILABLE",
        },
      });
      createdKeys.push(record);
    }

    // Atualiza stockQuantity com o total de chaves disponíveis
    const availableCount = await prisma.digitalKey.count({
      where: { productId, status: "AVAILABLE" },
    });

    await prisma.product.update({
      where: { id: productId },
      data: { stockQuantity: availableCount },
    });

    return { addedCount: createdKeys.length, totalAvailable: availableCount };
  }

  /**
   * Consulta o inventário geral para o painel administrativo
   */
  static async getInventoryOverview() {
    const products = await prisma.product.findMany({
      include: {
        game: { select: { name: true, theme: true } },
        _count: {
          select: {
            digitalKeys: true,
          },
        },
        digitalKeys: {
          select: { status: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return products.map((prod) => {
      const totalKeys = prod.digitalKeys.length;
      const availableKeys = prod.digitalKeys.filter((k) => k.status === "AVAILABLE").length;
      const soldKeys = prod.digitalKeys.filter((k) => k.status === "SOLD").length;
      const reservedKeys = prod.digitalKeys.filter((k) => k.status === "RESERVED").length;

      return {
        id: prod.id,
        name: prod.name,
        gameName: prod.game.name,
        theme: prod.game.theme,
        platform: prod.platform,
        price: prod.price,
        active: prod.active,
        totalKeys,
        availableKeys,
        soldKeys,
        reservedKeys,
        isLowStock: availableKeys <= 2 && availableKeys > 0,
        isOutOfStock: availableKeys === 0,
      };
    });
  }

  /**
   * Retorna chaves de um produto com código mascarado para visualização segura pelo admin
   */
  static async getMaskedProductKeys(productId: string) {
    const keys = await prisma.digitalKey.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });

    return keys.map((k) => {
      const decrypted = decryptDigitalKey(k.codeEncrypted);
      return {
        id: k.id,
        status: k.status,
        maskedCode: maskDigitalKey(decrypted),
        soldAt: k.soldAt,
        createdAt: k.createdAt,
      };
    });
  }

  /**
   * Descriptografa e revela a chave Steam comprada por um usuário autenticado
   */
  static async revealKeyForUser(userId: string, orderItemId: string) {
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        order: true,
        product: true,
        digitalKey: true,
      },
    });

    if (!orderItem) {
      throw new Error("Item do pedido não encontrado.");
    }

    // Regra de Segurança: Usuário só pode acessar se o pedido pertencer a ele
    if (orderItem.order.userId !== userId) {
      throw new Error("Acesso negado: Este pedido pertence a outro usuário.");
    }

    // Regra de Segurança: Pedido precisa estar pago ou concluído
    if (orderItem.order.status !== "PAID" && orderItem.order.status !== "COMPLETED") {
      throw new Error("A chave Steam estará disponível assim que o pagamento for aprovado.");
    }

    if (!orderItem.digitalKey) {
      throw new Error("Nenhuma chave digital foi associada a este item.");
    }

    // Descriptografa a chave em memória no momento da requisição
    const decryptedKey = decryptDigitalKey(orderItem.digitalKey.codeEncrypted);

    // Registra log de auditoria da visualização
    await prisma.digitalKey.update({
      where: { id: orderItem.digitalKey.id },
      data: { viewedAt: new Date() },
    });

    return {
      productName: orderItem.product.name,
      platform: orderItem.product.platform,
      steamKey: decryptedKey,
      viewedAt: new Date(),
    };
  }
}
