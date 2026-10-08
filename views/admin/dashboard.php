<?php
/**
 * ProjecSona - Admin Dashboard View
 */

$pageTitle = "Painel Administrativo";
require_once __DIR__ . '/../../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px;">
    <!-- Admin Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
        <div>
            <span class="badge badge-primary" style="margin-bottom: 6px;">Velvet Control Room</span>
            <h1 class="font-display" style="font-size: 32px; font-weight: 900; text-transform: uppercase;">Painel de Administração</h1>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="<?= url('admin/produtos/novo') ?>" class="btn btn-primary btn-sm">
                <i class="fa-solid fa-plus"></i> Novo Produto
            </a>
            <a href="<?= url('admin/chaves') ?>" class="btn btn-secondary btn-sm">
                <i class="fa-solid fa-key"></i> Inserir Chaves
            </a>
        </div>
    </div>

    <!-- Navigation Tabs -->
    <div style="display: flex; gap: 8px; margin-bottom: 32px; border-bottom: 1px solid var(--theme-border); padding-bottom: 12px; overflow-x: auto;">
        <a href="<?= url('admin') ?>" class="btn btn-primary btn-sm">Visão Geral</a>
        <a href="<?= url('admin/produtos') ?>" class="btn btn-secondary btn-sm">Produtos (<?= $totalProducts ?>)</a>
        <a href="<?= url('admin/chaves') ?>" class="btn btn-secondary btn-sm">Estoque Chaves (<?= $totalKeys ?>)</a>
        <a href="<?= url('admin/pedidos') ?>" class="btn btn-secondary btn-sm">Pedidos (<?= count($recentOrders) ?>)</a>
        <a href="<?= url('admin/ofertas') ?>" class="btn btn-secondary btn-sm">Ofertas Externas (<?= $totalOffers ?>)</a>
        <a href="<?= url('admin/usuarios') ?>" class="btn btn-secondary btn-sm">Usuários (<?= $totalUsers ?>)</a>
    </div>

    <!-- Stats Cards Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 40px;">
        <div class="card" style="padding: 24px;">
            <div style="font-size: 12px; font-weight: 800; color: var(--theme-muted); text-transform: uppercase; margin-bottom: 6px;">Total Faturado</div>
            <div style="font-size: 28px; font-weight: 900; font-family: var(--font-mono); color: var(--theme-primary);">
                <?= format_money($totalRevenue) ?>
            </div>
            <div style="font-size: 11px; color: #10b981; margin-top: 4px;">Pedidos concluídos</div>
        </div>

        <div class="card" style="padding: 24px;">
            <div style="font-size: 12px; font-weight: 800; color: var(--theme-muted); text-transform: uppercase; margin-bottom: 6px;">Total de Pedidos</div>
            <div style="font-size: 28px; font-weight: 900; font-family: var(--font-mono); color: #fff;">
                <?= $totalOrdersCount ?>
            </div>
            <div style="font-size: 11px; color: var(--theme-muted); margin-top: 4px;">Transações registradas</div>
        </div>

        <div class="card" style="padding: 24px;">
            <div style="font-size: 12px; font-weight: 800; color: var(--theme-muted); text-transform: uppercase; margin-bottom: 6px;">Chaves Disponíveis</div>
            <div style="font-size: 28px; font-weight: 900; font-family: var(--font-mono); color: #10b981;">
                <?= $availableKeysCount ?>
            </div>
            <div style="font-size: 11px; color: var(--theme-muted); margin-top: 4px;">Prontas para entrega</div>
        </div>

        <div class="card" style="padding: 24px;">
            <div style="font-size: 12px; font-weight: 800; color: var(--theme-muted); text-transform: uppercase; margin-bottom: 6px;">Usuários Cadastrados</div>
            <div style="font-size: 28px; font-weight: 900; font-family: var(--font-mono); color: #fff;">
                <?= $totalUsers ?>
            </div>
            <div style="font-size: 11px; color: var(--theme-muted); margin-top: 4px;">Clientes ativos</div>
        </div>
    </div>

    <!-- Recent Orders Table -->
    <div style="margin-bottom: 24px;">
        <h2 class="font-display" style="font-size: 20px; font-weight: 900; text-transform: uppercase;">Últimos Pedidos Realizados</h2>
    </div>

    <div class="card" style="padding: 0; overflow: hidden;">
        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Nº Pedido</th>
                        <th>Cliente</th>
                        <th>Data</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($recentOrders)): ?>
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 32px; color: var(--theme-muted);">Nenhum pedido recente.</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach (array_slice($recentOrders, 0, 8) as $ord): ?>
                            <tr>
                                <td>
                                    <strong style="font-family: var(--font-mono); color: #fff;"><?= htmlspecialchars($ord['order_number']) ?></strong>
                                </td>
                                <td>
                                    <div style="color: #fff; font-weight: 600;"><?= htmlspecialchars($ord['user_name']) ?></div>
                                    <div style="font-size: 11px; color: var(--theme-muted);"><?= htmlspecialchars($ord['user_email']) ?></div>
                                </td>
                                <td style="color: var(--theme-muted); font-size: 13px;">
                                    <?= date('d/m/Y H:i', strtotime($ord['created_at'])) ?>
                                </td>
                                <td>
                                    <span style="font-family: var(--font-mono); font-weight: 800; color: #fff;">
                                        <?= format_money((float)$ord['total_amount']) ?>
                                    </span>
                                </td>
                                <td>
                                    <span class="badge badge-stock"><?= htmlspecialchars($ord['status']) ?></span>
                                </td>
                                <td>
                                    <a href="<?= url('admin/pedidos/' . $ord['id']) ?>" class="btn btn-secondary btn-sm">
                                        Detalhes
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

<?php require_once __DIR__ . '/../../includes/footer.php'; ?>
