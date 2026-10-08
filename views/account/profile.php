<?php
/**
 * ProjecSona - User Account Profile & Orders View
 */

$pageTitle = "Minha Conta";
require_once __DIR__ . '/../../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px;">
    <!-- Profile Header -->
    <div class="card" style="padding: 32px; margin-bottom: 36px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
        <div style="display: flex; gap: 20px; align-items: center;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--theme-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 900;">
                <?= strtoupper(substr($user['name'], 0, 1)) ?>
            </div>
            <div>
                <h1 class="font-display" style="font-size: 24px; font-weight: 900; text-transform: uppercase; margin-bottom: 4px;">
                    <?= htmlspecialchars($user['name']) ?>
                </h1>
                <div style="font-size: 13px; color: var(--theme-muted);">
                    <?= htmlspecialchars($user['email']) ?> • <span class="badge badge-primary"><?= htmlspecialchars($user['role']) ?></span>
                </div>
            </div>
        </div>

        <div>
            <a href="<?= url('logout') ?>" class="btn btn-secondary btn-sm">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Encerrar Sessão
            </a>
        </div>
    </div>

    <!-- Orders History Section -->
    <div style="margin-bottom: 24px;">
        <span class="badge badge-primary" style="margin-bottom: 6px;">Histórico de Compras</span>
        <h2 class="font-display" style="font-size: 24px; font-weight: 900; text-transform: uppercase;">Meus Pedidos & Chaves</h2>
    </div>

    <?php if (empty($orders)): ?>
        <div class="card" style="text-align: center; padding: 48px 20px;">
            <p style="color: var(--theme-muted); margin-bottom: 16px;">Você ainda não realizou nenhum pedido na loja.</p>
            <a href="<?= url('catalogo') ?>" class="btn btn-primary btn-sm">Explorar Catálogo Persona</a>
        </div>
    <?php else: ?>
        <div class="card" style="padding: 0; overflow: hidden;">
            <div class="table-responsive">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>Nº do Pedido</th>
                            <th>Data</th>
                            <th>Pagamento</th>
                            <th>Status</th>
                            <th>Valor Total</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($orders as $ord): ?>
                            <tr>
                                <td>
                                    <strong style="color: #fff; font-family: var(--font-mono); font-size: 14px;">
                                        <?= htmlspecialchars($ord['order_number']) ?>
                                    </strong>
                                </td>
                                <td style="color: var(--theme-muted); font-size: 13px;">
                                    <?= date('d/m/Y H:i', strtotime($ord['created_at'])) ?>
                                </td>
                                <td>
                                    <span style="font-weight: 700; color: #fff;"><?= htmlspecialchars($ord['payment_method'] ?? 'PIX') ?></span>
                                </td>
                                <td>
                                    <?php if ($ord['status'] === 'COMPLETED' || $ord['status'] === 'PAID'): ?>
                                        <span class="badge badge-stock">Concluído</span>
                                    <?php else: ?>
                                        <span class="badge badge-primary"><?= htmlspecialchars($ord['status']) ?></span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <span style="font-family: var(--font-mono); font-weight: 800; color: #fff;">
                                        <?= format_money((float)$ord['total_amount']) ?>
                                    </span>
                                </td>
                                <td>
                                    <a href="<?= url('conta/pedidos/' . $ord['id']) ?>" class="btn btn-primary btn-sm">
                                        <i class="fa-solid fa-key"></i> Ver Chaves
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/../../includes/footer.php'; ?>
