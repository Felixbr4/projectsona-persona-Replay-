<?php
/**
 * ProjecSona - Price Comparison Hub
 */

$pageTitle = "Comparador de Preços";
$activeNav = "offers";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px;">
    <!-- Section Header -->
    <div style="margin-bottom: 32px;">
        <span class="badge badge-primary" style="margin-bottom: 8px;">Radar de Ofertas</span>
        <h1 class="font-display" style="font-size: 36px; font-weight: 900; text-transform: uppercase;">Comparador de Preços da Franquia Persona</h1>
        <p style="color: var(--theme-muted); font-size: 15px;">Monitoramos as principais lojas digitais oficiais para você sempre comprar pelo menor preço.</p>
    </div>

    <!-- Filter Bar -->
    <div class="card" style="padding: 20px; margin-bottom: 32px;">
        <form method="GET" action="<?= url('ofertas') ?>" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) 120px; gap: 16px; align-items: flex-end;">
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Filtrar por Jogo</label>
                <select name="game_id" class="form-control">
                    <option value="">Todos os Jogos</option>
                    <?php foreach ($games as $g): ?>
                        <option value="<?= htmlspecialchars($g['id']) ?>" <?= ($filters['game_id'] ?? '') === $g['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($g['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Plataforma</label>
                <select name="platform" class="form-control">
                    <option value="">Todas as Plataformas</option>
                    <option value="Steam" <?= ($filters['platform'] ?? '') === 'Steam' ? 'selected' : '' ?>>Steam</option>
                    <option value="Epic" <?= ($filters['platform'] ?? '') === 'Epic' ? 'selected' : '' ?>>Epic Games</option>
                </select>
            </div>

            <div>
                <button type="submit" class="btn btn-primary btn-block">
                    <i class="fa-solid fa-filter"></i> Filtrar
                </button>
            </div>
        </form>
    </div>

    <!-- Offers Table -->
    <div class="card" style="padding: 0; overflow: hidden;">
        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Jogo</th>
                        <th>Loja Parceira</th>
                        <th>Status</th>
                        <th>Preço Oficial</th>
                        <th>Melhor Oferta</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($offers)): ?>
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 40px; color: var(--theme-muted);">
                                Nenhuma oferta encontrada para os filtros selecionados.
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($offers as $off): 
                            $offDiscount = get_discount_percentage((float)$off['price'], $off['original_price'] ? (float)$off['original_price'] : null);
                        ?>
                            <tr>
                                <td>
                                    <strong style="color: #fff; font-size: 15px;"><?= htmlspecialchars($off['game_name']) ?></strong>
                                    <div style="font-size: 11px; color: var(--theme-muted);"><?= htmlspecialchars($off['platform']) ?> Activation</div>
                                </td>
                                <td>
                                    <span style="font-weight: 700; color: #fff;"><?= htmlspecialchars($off['store_name']) ?></span>
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
                                    <span style="font-size: 18px; font-weight: 900; font-family: var(--font-mono); color: #fff;">
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
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
