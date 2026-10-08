<?php
/**
 * ProjecSona - Admin Orders List View
 */

$pageTitle = "Gerenciar Pedidos";
require_once __DIR__ . '/../../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
        <div>
            <span class="badge badge-primary" style="margin-bottom: 6px;">Vendas & Transações</span>
            <h1 class="font-display" style="font-size: 32px; font-weight: 900; text-transform: uppercase;">Todos os Pedidos</h1>
        </div>
        <a href="<?= url('admin') ?>" class="btn btn-secondary btn-sm"><i class="fa-solid fa-arrow-left"></i> Voltar ao Painel</a>
    </div>

    <div class="card" style="padding: 0; overflow: hidden;">
        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Nº Pedido</th>
                        <th>Cliente</th>
                        <th>Data</th>
                        <th>Método</th>
                        <th>Valor Total</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($orders)): ?>
                        <tr>
                            <td colspan="7" style="text-align: center; padding: 32px; color: var(--theme-muted);">Nenhum pedido registrado.</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($orders as $ord): ?>
                            <tr>
                                <td>
                                    <strong style="font-family: var(--font-mono); color: #fff; font-size: 14px;"><?= htmlspecialchars($ord['order_number']) ?></strong>
                                </td>
                                <td>
                                    <div style="color: #fff; font-weight: 600;"><?= htmlspecialchars($ord['user_name']) ?></div>
                                    <div style="font-size: 11px; color: var(--theme-muted);"><?= htmlspecialchars($ord['user_email']) ?></div>
                                </td>
                                <td style="color: var(--theme-muted); font-size: 13px;">
                                    <?= date('d/m/Y H:i', strtotime($ord['created_at'])) ?>
                                </td>
                                <td><?= htmlspecialchars($ord['payment_method'] ?? 'PIX') ?></td>
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
                                        <i class="fa-solid fa-eye"></i> Detalhes
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
