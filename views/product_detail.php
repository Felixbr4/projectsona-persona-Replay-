<?php
/**
 * ProjecSona - Product Detail View
 */

$pageTitle = $product['name'];
$activeNav = "catalog";
require_once __DIR__ . '/../includes/header.php';

$discount = get_discount_percentage((float)$product['price'], $product['original_price'] ? (float)$product['original_price'] : null);
$hasStock = ($product['available_keys'] ?? 0) > 0;
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px;">
    <!-- Breadcrumb -->
    <div style="font-size: 13px; color: var(--theme-muted); margin-bottom: 24px; display: flex; align-items: center; gap: 8px;">
        <a href="<?= url('/') ?>">Início</a>
        <span>/</span>
        <a href="<?= url('catalogo') ?>">Catálogo</a>
        <span>/</span>
        <a href="<?= url('jogos/' . $product['game_slug']) ?>"><?= htmlspecialchars($product['game_name']) ?></a>
        <span>/</span>
        <span style="color: #fff;"><?= htmlspecialchars($product['edition']) ?></span>
    </div>

    <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 48px; align-items: flex-start;" class="product-detail-layout">
        <!-- Left Column: Product Image & Platform Info -->
        <div>
            <div class="card" style="padding: 0; overflow: hidden; border-radius: 20px; margin-bottom: 24px;">
                <img src="<?= htmlspecialchars($product['image'] ?: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop') ?>" alt="<?= htmlspecialchars($product['name']) ?>" style="width: 100%; aspect-ratio: 16 / 10; object-fit: cover;">
            </div>

            <!-- Key Delivery Guarantee Banner -->
            <div class="glass-panel" style="padding: 20px; display: flex; gap: 16px; align-items: center;">
                <div style="font-size: 28px; color: var(--theme-primary);">
                    <i class="fa-brands fa-steam"></i>
                </div>
                <div>
                    <h4 style="font-size: 14px; font-weight: 800; text-transform: uppercase;">Ativação Direta na Steam</h4>
                    <p style="font-size: 12px; color: var(--theme-muted);">Chave digital oficial global/Brasil. Resgate em menos de 10 segundos na sua conta Steam.</p>
                </div>
            </div>
        </div>

        <!-- Right Column: Product Meta, Price & Purchase -->
        <div>
            <div style="display: flex; gap: 8px; margin-bottom: 12px; align-items: center;">
                <span class="badge badge-primary"><?= htmlspecialchars($product['platform']) ?></span>
                <span class="badge badge-primary"><?= htmlspecialchars($product['edition']) ?></span>
                <?php if ($discount > 0): ?>
                    <span class="badge badge-discount">-<?= $discount ?>% OFF</span>
                <?php endif; ?>
            </div>

            <h1 class="font-display" style="font-size: 32px; font-weight: 900; line-height: 1.2; text-transform: uppercase; margin-bottom: 16px;">
                <?= htmlspecialchars($product['name']) ?>
            </h1>

            <div style="font-size: 14px; color: var(--theme-muted); margin-bottom: 24px; line-height: 1.6;">
                <?= nl2br(htmlspecialchars($product['description'])) ?>
            </div>

            <!-- Price Card -->
            <div class="card" style="background: var(--theme-surface); padding: 24px; margin-bottom: 32px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px;">
                    <div>
                        <span style="font-size: 12px; color: var(--theme-muted); text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 4px;">Preço Especial</span>
                        <?php if ($product['original_price'] && $product['original_price'] > $product['price']): ?>
                            <span class="price-original" style="font-size: 15px;"><?= format_money((float)$product['original_price']) ?></span>
                        <?php endif; ?>
                        <div class="price-current" style="font-size: 32px;"><?= format_money((float)$product['price']) ?></div>
                    </div>

                    <div style="text-align: right;">
                        <?php if ($hasStock): ?>
                            <span class="badge badge-stock" style="font-size: 12px; padding: 6px 12px;">
                                <i class="fa-solid fa-circle-check"></i> <?= $product['available_keys'] ?> chaves disponíveis
                            </span>
                        <?php else: ?>
                            <span class="badge badge-out" style="font-size: 12px; padding: 6px 12px;">
                                <i class="fa-solid fa-circle-xmark"></i> Esgotado Temporariamente
                            </span>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Purchase Forms -->
                <div style="display: flex; gap: 12px;">
                    <form action="<?= url('carrinho/adicionar') ?>" method="POST" style="flex: 1;">
                        <?= csrf_field() ?>
                        <input type="hidden" name="product_id" value="<?= htmlspecialchars($product['id']) ?>">
                        <input type="hidden" name="quantity" value="1">
                        <button type="submit" class="btn btn-primary btn-block btn-lg" <?= !$hasStock ? 'disabled' : '' ?>>
                            <i class="fa-solid fa-cart-shopping"></i> Adicionar ao Carrinho
                        </button>
                    </form>
                </div>
            </div>

            <!-- Game Lore Link -->
            <div class="card" style="padding: 20px; border-left: 4px solid var(--theme-primary);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="font-size: 14px; font-weight: 800; text-transform: uppercase; color: #fff;">Quer saber mais sobre o universo?</h4>
                        <p style="font-size: 12px; color: var(--theme-muted);">Conheça a história e os personagens de <?= htmlspecialchars($product['game_name']) ?>.</p>
                    </div>
                    <a href="<?= url('jogos/' . $product['game_slug']) ?>" class="btn btn-secondary btn-sm">
                        Ver Lore <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
