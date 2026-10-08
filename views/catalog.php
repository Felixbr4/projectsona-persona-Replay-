<?php
/**
 * ProjecSona - Catalog View
 */

$pageTitle = "Catálogo de Jogos";
$activeNav = "catalog";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px;">
    <!-- Catalog Header -->
    <div style="margin-bottom: 32px;">
        <span class="badge badge-primary" style="margin-bottom: 8px;">Loja Oficial ProjecSona</span>
        <h1 class="font-display" style="font-size: 36px; font-weight: 900; text-transform: uppercase;">Catálogo Completo de Edições</h1>
        <p style="color: var(--theme-muted); font-size: 15px;">Explore todas as versões digitais, DLCs e edições Deluxe para ativação imediata na Steam.</p>
    </div>

    <!-- Filter & Search Bar -->
    <div class="card" style="padding: 20px; margin-bottom: 36px;">
        <form method="GET" action="<?= url('catalogo') ?>" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) 120px; gap: 16px; align-items: flex-end;">
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Buscar Edição</label>
                <input type="text" name="search" class="form-control" placeholder="Ex: Reload, Royal, Deluxe..." value="<?= htmlspecialchars($filters['search'] ?? '') ?>">
            </div>

            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Filtrar por Jogo</label>
                <select name="game_slug" class="form-control">
                    <option value="">Todos os Jogos Persona</option>
                    <?php foreach ($games as $g): ?>
                        <option value="<?= htmlspecialchars($g['slug']) ?>" <?= ($filters['game_slug'] ?? '') === $g['slug'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($g['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Ordenar Por</label>
                <select name="sort_by" class="form-control">
                    <option value="featured" <?= ($filters['sort_by'] ?? '') === 'featured' ? 'selected' : '' ?>>Mais Populares</option>
                    <option value="discount" <?= ($filters['sort_by'] ?? '') === 'discount' ? 'selected' : '' ?>>Maiores Descontos</option>
                    <option value="price_asc" <?= ($filters['sort_by'] ?? '') === 'price_asc' ? 'selected' : '' ?>>Menor Preço</option>
                    <option value="price_desc" <?= ($filters['sort_by'] ?? '') === 'price_desc' ? 'selected' : '' ?>>Maior Preço</option>
                </select>
            </div>

            <div>
                <button type="submit" class="btn btn-primary btn-block">
                    <i class="fa-solid fa-filter"></i> Filtrar
                </button>
            </div>
        </form>
    </div>

    <!-- Products Grid -->
    <?php if (empty($products)): ?>
        <div class="card" style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 48px; color: var(--theme-muted); margin-bottom: 16px;">
                <i class="fa-solid fa-ghost"></i>
            </div>
            <h3 class="font-display" style="font-size: 20px; font-weight: 800; margin-bottom: 8px;">Nenhum produto encontrado</h3>
            <p style="color: var(--theme-muted); font-size: 14px; margin-bottom: 24px;">Tente alterar os termos de busca ou remover os filtros aplicados.</p>
            <a href="<?= url('catalogo') ?>" class="btn btn-secondary btn-sm">Limpar Filtros</a>
        </div>
    <?php else: ?>
        <div class="products-grid">
            <?php foreach ($products as $prod): 
                $discount = get_discount_percentage((float)$prod['price'], $prod['original_price'] ? (float)$prod['original_price'] : null);
                $hasStock = ($prod['available_keys'] ?? 0) > 0;
            ?>
                <div class="product-card">
                    <div class="product-card-image">
                        <img src="<?= htmlspecialchars($prod['image'] ?: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop') ?>" alt="<?= htmlspecialchars($prod['name']) ?>">
                        <div style="position: absolute; top: 12px; left: 12px; display: flex; gap: 6px;">
                            <span class="badge badge-primary"><?= htmlspecialchars($prod['platform']) ?></span>
                            <?php if ($discount > 0): ?>
                                <span class="badge badge-discount">-<?= $discount ?>%</span>
                            <?php endif; ?>
                        </div>
                        <div style="position: absolute; bottom: 12px; right: 12px;">
                            <?php if ($hasStock): ?>
                                <span class="badge badge-stock"><i class="fa-solid fa-check"></i> Em Estoque</span>
                            <?php else: ?>
                                <span class="badge badge-out"><i class="fa-solid fa-xmark"></i> Esgotado</span>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div class="product-card-body">
                        <span style="font-size: 11px; font-weight: 800; color: var(--theme-primary); text-transform: uppercase; margin-bottom: 4px;">
                            <?= htmlspecialchars($prod['game_name']) ?>
                        </span>
                        <h3 class="product-card-title"><?= htmlspecialchars($prod['name']) ?></h3>
                        <p style="font-size: 13px; color: var(--theme-muted); margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                            <?= htmlspecialchars($prod['description']) ?>
                        </p>

                        <div class="product-card-footer">
                            <div class="price-box">
                                <?php if ($prod['original_price'] && $prod['original_price'] > $prod['price']): ?>
                                    <span class="price-original"><?= format_money((float)$prod['original_price']) ?></span>
                                <?php endif; ?>
                                <span class="price-current"><?= format_money((float)$prod['price']) ?></span>
                            </div>

                            <div style="display: flex; gap: 8px;">
                                <a href="<?= url('produto/' . $prod['slug']) ?>" class="btn btn-secondary btn-sm" title="Ver Detalhes">
                                    <i class="fa-solid fa-eye"></i>
                                </a>
                                <form action="<?= url('carrinho/adicionar') ?>" method="POST" style="display: inline;">
                                    <?= csrf_field() ?>
                                    <input type="hidden" name="product_id" value="<?= htmlspecialchars($prod['id']) ?>">
                                    <button type="submit" class="btn btn-primary btn-sm" <?= !$hasStock ? 'disabled' : '' ?> title="Adicionar ao Carrinho">
                                        <i class="fa-solid fa-cart-plus"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
