<?php
/**
 * Persona Replay - Game Detail View with Lore, Characters and Products
 */

$pageTitle = $game['name'];
$activeNav = "games";
require_once __DIR__ . '/../includes/header.php';

$isP5 = ($game['theme'] === 'persona5');
?>

<!-- Game Hero Banner -->
<section style="position: relative; padding: 80px 0 60px 0; background: linear-gradient(to bottom, rgba(0,0,0,0.4), var(--theme-bg)), url('<?= htmlspecialchars($game['banner_image'] ?: asset($game['image'])) ?>') center/cover no-repeat; border-bottom: 2px solid var(--theme-border);">
    <div class="container" style="position: relative; z-index: 10;">
        <div style="max-width: 800px;">
            <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
                <span class="badge badge-primary">Metacritic <?= $game['metacritic_score'] ?></span>
                <span class="badge badge-primary"><?= htmlspecialchars($game['genre']) ?></span>
                <span class="badge badge-primary"><?= htmlspecialchars($game['developer']) ?></span>
            </div>

            <h1 class="font-display" style="font-size: 48px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px; line-height: 1.1;">
                <?= htmlspecialchars($game['name']) ?>
            </h1>

            <p style="font-size: 16px; color: #e2e8f0; line-height: 1.6; margin-bottom: 24px;">
                <?= htmlspecialchars($game['description']) ?>
            </p>

            <a href="#edicoes" class="btn btn-primary btn-lg">
                <i class="fa-solid fa-cart-shopping"></i> Ver Edições Disponíveis
            </a>
        </div>
    </div>
</section>

<div class="container" style="padding-top: 60px; padding-bottom: 80px;">
    <!-- Story Synopsis Section -->
    <section style="margin-bottom: 60px;">
        <div class="card" style="padding: 36px; border-left: 6px solid var(--theme-primary);">
            <h2 class="font-display" style="font-size: 24px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px;">
                Sinopse da História
            </h2>
            <p style="font-size: 15px; color: var(--theme-muted); line-height: 1.8;">
                <?= nl2br(htmlspecialchars($game['story'])) ?>
            </p>
        </div>
    </section>

    <!-- Characters Roster Section with Dual Hover for Persona 5 -->
    <?php if (!empty($characters)): ?>
        <section style="margin-bottom: 60px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; flex-wrap: wrap; gap: 12px;">
                <div>
                    <span class="badge badge-primary" style="margin-bottom: 6px;">Protagonistas & Aliados</span>
                    <h2 class="font-display" style="font-size: 30px; font-weight: 900; text-transform: uppercase;">Personagens Principais</h2>
                </div>
                <?php if ($isP5): ?>
                    <span class="badge badge-discount" style="padding: 6px 12px; font-size: 11px;">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> Passe o mouse nos cards para ver a forma Phantom Thief
                    </span>
                <?php endif; ?>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px;">
                <?php foreach ($characters as $char): 
                    $hasTransformed = !empty($char['image_transformed']);
                ?>
                    <?php if ($hasTransformed): ?>
                        <link rel="preload" as="image" href="<?= asset($char['image_transformed']) ?>">
                    <?php endif; ?>
                    <div class="card card-hover <?= $hasTransformed ? 'p5-dual-card' : '' ?>" 
                         <?= $hasTransformed ? 'tabindex="0" role="button" aria-pressed="false" aria-label="' . htmlspecialchars($char['name']) . ' (Pressione Enter, Espaço ou toque para alternar forma Phantom Thief)"' : '' ?> 
                         style="padding: 0; overflow: hidden; border-radius: 16px;">
                        <div class="<?= $hasTransformed ? 'p5-img-container' : '' ?>" style="<?= !$hasTransformed ? 'position: relative; aspect-ratio: 1 / 1; overflow: hidden;' : '' ?>">
                            <?php if ($hasTransformed): ?>
                                <img src="<?= asset($char['image']) ?>" alt="<?= htmlspecialchars($char['name']) ?>" class="p5-img-normal">
                                <img src="<?= asset($char['image_transformed']) ?>" alt="<?= htmlspecialchars($char['name']) ?> Transformed" class="p5-img-transformed">
                                <div class="p5-hover-badge"><i class="fa-solid fa-mask"></i> Forma Ladrão</div>
                            <?php else: ?>
                                <img src="<?= asset($char['image']) ?>" alt="<?= htmlspecialchars($char['name']) ?>" style="width: 100%; height: 100%; object-fit: cover;">
                            <?php endif; ?>

                            <div style="position: absolute; bottom: 0; inset-inline: 0; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); padding: 16px; z-index: 3;">
                                <span class="badge badge-primary" style="font-size: 10px;"><?= htmlspecialchars($char['role_tag']) ?></span>
                            </div>
                        </div>

                        <div style="padding: 20px;">
                            <h3 style="font-size: 18px; font-weight: 900; margin-bottom: 4px;"><?= htmlspecialchars($char['name']) ?></h3>
                            <?php if ($char['persona_name']): ?>
                                <div style="font-size: 12px; font-weight: 700; color: var(--theme-primary); margin-bottom: 8px;">
                                    Persona: <?= htmlspecialchars($char['persona_name']) ?> (<?= htmlspecialchars($char['arcana']) ?>)
                                </div>
                            <?php endif; ?>
                            <p style="font-size: 12px; color: var(--theme-muted); line-height: 1.5;">
                                <?= htmlspecialchars($char['description']) ?>
                            </p>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </section>
    <?php endif; ?>

    <!-- Available Store Products for this Game -->
    <section id="edicoes" style="margin-bottom: 60px;">
        <div style="margin-bottom: 28px;">
            <span class="badge badge-primary" style="margin-bottom: 6px;">Compre com Chaves Steam Oficiais</span>
            <h2 class="font-display" style="font-size: 30px; font-weight: 900; text-transform: uppercase;">Edições de <?= htmlspecialchars($game['name']) ?></h2>
        </div>

        <div class="products-grid">
            <?php foreach ($products as $prod): 
                $discount = get_discount_percentage((float)$prod['price'], $prod['original_price'] ? (float)$prod['original_price'] : null);
            ?>
                <div class="product-card">
                    <div class="product-card-image">
                        <img src="<?= asset($prod['image'] ?: $game['image']) ?>" alt="<?= htmlspecialchars($prod['name']) ?>">
                        <div style="position: absolute; top: 12px; left: 12px; display: flex; gap: 6px;">
                            <span class="badge badge-primary"><?= htmlspecialchars($prod['edition']) ?></span>
                            <?php if ($discount > 0): ?>
                                <span class="badge badge-discount">-<?= $discount ?>%</span>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div class="product-card-body">
                        <h3 class="product-card-title"><?= htmlspecialchars($prod['name']) ?></h3>
                        <p style="font-size: 13px; color: var(--theme-muted); margin-bottom: 16px; line-height: 1.4;">
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
                                    <button type="submit" class="btn btn-primary btn-sm" title="Comprar">
                                        <i class="fa-solid fa-cart-plus"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- Price Comparison for this Game -->
    <?php if (!empty($offers)): ?>
        <section>
            <div style="margin-bottom: 28px;">
                <span class="badge badge-primary" style="margin-bottom: 6px;">Transparência</span>
                <h2 class="font-display" style="font-size: 30px; font-weight: 900; text-transform: uppercase;">Comparador de Preços em Lojas Externas</h2>
            </div>

            <div class="card" style="padding: 0; overflow: hidden;">
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Loja / Plataforma</th>
                                <th>Confiabilidade</th>
                                <th>Preço Original</th>
                                <th>Preço Atual</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($offers as $off): 
                                $offDiscount = get_discount_percentage((float)$off['price'], $off['original_price'] ? (float)$off['original_price'] : null);
                            ?>
                                <tr>
                                    <td>
                                        <strong style="color: #fff;"><?= htmlspecialchars($off['store_name']) ?></strong>
                                        <div style="font-size: 11px; color: var(--theme-muted);"><?= htmlspecialchars($off['platform']) ?> Key</div>
                                    </td>
                                    <td>
                                        <span class="badge badge-stock"><?= htmlspecialchars($off['reliability_status']) ?></span>
                                    </td>
                                    <td>
                                        <?php if ($off['original_price'] && $off['original_price'] > $off['price']): ?>
                                            <span style="text-decoration: line-through; color: var(--theme-muted);">
                                                <?= format_money((float)$off['original_price']) ?>
                                            </span>
                                        <?php else: ?>
                                            <span style="color: var(--theme-muted);">-</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <span style="font-size: 16px; font-weight: 800; font-family: var(--font-mono); color: #fff;">
                                            <?= format_money((float)$off['price']) ?>
                                        </span>
                                        <?php if ($offDiscount > 0): ?>
                                            <span class="badge badge-discount" style="margin-left: 6px;">-<?= $offDiscount ?>%</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <a href="<?= htmlspecialchars($off['url']) ?>" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                                            Ir à Loja <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
