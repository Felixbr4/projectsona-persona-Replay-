<?php
/**
 * ProjecSona - Admin Products List View
 */

$pageTitle = "Gerenciar Produtos";
require_once __DIR__ . '/../../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
        <div>
            <span class="badge badge-primary" style="margin-bottom: 6px;">Catálogo da Loja</span>
            <h1 class="font-display" style="font-size: 32px; font-weight: 900; text-transform: uppercase;">Produtos Cadastrados</h1>
        </div>
        <div style="display: flex; gap: 10px;">
            <a href="<?= url('admin') ?>" class="btn btn-secondary btn-sm"><i class="fa-solid fa-arrow-left"></i> Voltar ao Painel</a>
            <a href="<?= url('admin/produtos/novo') ?>" class="btn btn-primary btn-sm"><i class="fa-solid fa-plus"></i> Novo Produto</a>
        </div>
    </div>

    <div class="card" style="padding: 0; overflow: hidden;">
        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Produto / Edição</th>
                        <th>Jogo</th>
                        <th>Preço</th>
                        <th>Plataforma</th>
                        <th>Chaves em Estoque</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($products as $prod): ?>
                        <tr>
                            <td>
                                <strong style="color: #fff; font-size: 14px;"><?= htmlspecialchars($prod['name']) ?></strong>
                                <div style="font-size: 11px; color: var(--theme-muted);"><?= htmlspecialchars($prod['edition']) ?></div>
                            </td>
                            <td><?= htmlspecialchars($prod['game_name']) ?></td>
                            <td>
                                <span style="font-family: var(--font-mono); font-weight: 800; color: #fff;">
                                    <?= format_money((float)$prod['price']) ?>
                                </span>
                            </td>
                            <td><span class="badge badge-primary"><?= htmlspecialchars($prod['platform']) ?></span></td>
                            <td>
                                <?php if (($prod['available_keys'] ?? 0) > 0): ?>
                                    <span class="badge badge-stock"><?= $prod['available_keys'] ?> disponíveis</span>
                                <?php else: ?>
                                    <span class="badge badge-out">0 (Esgotado)</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?= $prod['active'] ? '<span class="badge badge-stock">Ativo</span>' : '<span class="badge badge-out">Inativo</span>' ?>
                            </td>
                            <td>
                                <a href="<?= url('admin/produtos/editar/' . $prod['id']) ?>" class="btn btn-secondary btn-sm">
                                    <i class="fa-solid fa-pen"></i> Editar
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../../includes/footer.php'; ?>
