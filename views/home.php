<?php
/**
 * Persona Replay - Home View
 */

$pageTitle = "Início";
$activeNav = "home";
require_once __DIR__ . '/../includes/header.php';
?>

<!-- Hero Section -->
<section class="hero-section">
    <div class="hero-glow"></div>
    <div class="container hero-content">
        <div style="margin-bottom: 16px;">
            <span class="badge badge-primary">
                <i class="fa-solid fa-bolt"></i> Chaves Oficiais Steam • Entrega Imediata
            </span>
        </div>

        <h1 class="hero-title">
            A Loja Definitiva <span>PERSONA REPLAY</span>
        </h1>

        <p class="hero-subtitle">
            Encontre as melhores edições de <strong>Persona 3 Reload</strong>, <strong>Persona 4 Revival</strong> e <strong>Persona 5 Royal</strong>. Compare preços em tempo real com lojas autorizadas e ative instantaneamente na sua Steam.
        </p>

        <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
            <a href="<?= url('catalogo') ?>" class="btn btn-primary btn-lg">
                <i class="fa-solid fa-bag-shopping"></i> Explorar Catálogo
            </a>
            <a href="<?= url('ofertas') ?>" class="btn btn-secondary btn-lg">
                <i class="fa-solid fa-chart-line"></i> Ver Comparador de Preços
            </a>
        </div>

        <!-- Interactive Game Selection Banners with Cinematic Transitions -->
        <div style="margin-top: 60px;">
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--theme-muted); letter-spacing: 1.5px; margin-bottom: 20px;">
                Selecione um jogo para vivenciar a transição temática e explorar o lore
            </div>
            
            <div class="game-selector-grid">
                <?php foreach ($games as $game): 
                    $gameTheme = $game['theme'] ?? 'persona5';
                ?>
                    <a href="<?= url('jogos/' . $game['slug']) ?>" 
                       class="game-banner-card" 
                       data-transition-theme="<?= htmlspecialchars($gameTheme) ?>"
                       data-url="<?= url('jogos/' . $game['slug']) ?>">
                        <img src="<?= asset($game['image']) ?>" alt="<?= htmlspecialchars($game['name']) ?>">
                        <div class="game-banner-overlay">
                            <span class="badge badge-primary" style="width: fit-content; margin-bottom: 6px;">
                                Metacritic: <?= $game['metacritic_score'] ?>
                            </span>
                            <h3 class="game-banner-title"><?= htmlspecialchars($game['name']) ?></h3>
                            <span style="font-size: 12px; color: var(--theme-muted);"><?= htmlspecialchars($game['genre']) ?></span>
                        </div>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>

<!-- Featured Products Catalog Section -->
<section class="container" style="margin-top: 40px; margin-bottom: 80px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
        <div>
            <span class="badge badge-primary" style="margin-bottom: 6px;">Pronta Entrega</span>
            <h2 class="font-display" style="font-size: 32px; font-weight: 900; text-transform: uppercase;">Edições em Destaque & Promoções</h2>
        </div>
        <a href="<?= url('catalogo') ?>" class="btn btn-secondary btn-sm">
            Ver todas as edições <i class="fa-solid fa-arrow-right"></i>
        </a>
    </div>

    <div class="products-grid">
        <?php foreach ($featuredProducts as $prod): 
            $discount = get_discount_percentage((float)$prod['price'], $prod['original_price'] ? (float)$prod['original_price'] : null);
        ?>
            <div class="product-card">
                <div class="product-card-image">
                    <img src="<?= asset($prod['image'] ?: 'images/covers/p5r.jpg') ?>" alt="<?= htmlspecialchars($prod['name']) ?>">
                    <div style="position: absolute; top: 12px; left: 12px; display: flex; gap: 6px;">
                        <span class="badge badge-primary"><?= htmlspecialchars($prod['platform']) ?></span>
                        <?php if ($discount > 0): ?>
                            <span class="badge badge-discount">-<?= $discount ?>%</span>
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
                                <button type="submit" class="btn btn-primary btn-sm" <?= ($prod['available_keys'] ?? 0) <= 0 ? 'disabled' : '' ?>>
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

<!-- Features Highlights -->
<section class="container" style="margin-bottom: 80px;">
    <div class="glass-panel" style="padding: 48px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 36px;">
            <div style="display: flex; gap: 16px;">
                <div style="width: 50px; height: 50px; border-radius: 12px; background: rgba(239, 68, 68, 0.2); display: flex; align-items: center; justify-content: center; color: var(--theme-primary); font-size: 22px; flex-shrink: 0;">
                    <i class="fa-solid fa-key"></i>
                </div>
                <div>
                    <h3 style="font-size: 16px; font-weight: 800; text-transform: uppercase; margin-bottom: 6px;">Chaves Digitais Criptografadas</h3>
                    <p style="font-size: 13px; color: var(--theme-muted); line-height: 1.5;">Códigos protegidos por criptografia de ponta a ponta (AES-256) e revelados com segurança no seu painel.</p>
                </div>
            </div>

            <div style="display: flex; gap: 16px;">
                <div style="width: 50px; height: 50px; border-radius: 12px; background: rgba(59, 130, 246, 0.2); display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 22px; flex-shrink: 0;">
                    <i class="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                    <h3 style="font-size: 16px; font-weight: 800; text-transform: uppercase; margin-bottom: 6px;">Garantia de Autenticidade</h3>
                    <p style="font-size: 13px; color: var(--theme-muted); line-height: 1.5;">Ativação direta na Steam sem bloqueios. Estoque com controle transacional rigoroso.</p>
                </div>
            </div>

            <div style="display: flex; gap: 16px;">
                <div style="width: 50px; height: 50px; border-radius: 12px; background: rgba(250, 204, 21, 0.2); display: flex; align-items: center; justify-content: center; color: #facc15; font-size: 22px; flex-shrink: 0;">
                    <i class="fa-solid fa-scale-balanced"></i>
                </div>
                <div>
                    <h3 style="font-size: 16px; font-weight: 800; text-transform: uppercase; margin-bottom: 6px;">Comparador em Tempo Real</h3>
                    <p style="font-size: 13px; color: var(--theme-muted); line-height: 1.5;">Compare os preços praticados por Nuuvem, Steam e Green Man Gaming antes de fechar sua compra.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
