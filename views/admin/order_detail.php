<?php
/**
 * ProjecSona - Admin Order Detail View
 */

$pageTitle = "Detalhes do Pedido " . $order['order_number'];
require_once __DIR__ . '/../../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px; max-width: 860px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
        <div>
            <span class="badge badge-primary" style="margin-bottom: 6px;">Gestão de Vendas</span>
            <h1 class="font-display" style="font-size: 28px; font-weight: 900; text-transform: uppercase;">
                Pedido <?= htmlspecialchars($order['order_number']) ?>
            </h1>
        </div>
        <a href="<?= url('admin/pedidos') ?>" class="btn btn-secondary btn-sm"><i class="fa-solid fa-arrow-left"></i> Voltar aos Pedidos</a>
    </div>

    <div class="card" style="padding: 32px; margin-bottom: 32px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid var(--theme-border);">
            <div>
                <h4 style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--theme-muted); margin-bottom: 6px;">Dados do Cliente</h4>
                <div style="color: #fff; font-size: 16px; font-weight: 700;"><?= htmlspecialchars($order['user_name']) ?></div>
                <div style="color: var(--theme-muted); font-size: 13px;"><?= htmlspecialchars($order['user_email']) ?></div>
            </div>

            <div>
                <h4 style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--theme-muted); margin-bottom: 6px;">Status do Pagamento</h4>
                <div>
                    <span class="badge badge-stock" style="margin-right: 8px;"><?= htmlspecialchars($order['payment_status'] ?? 'APPROVED') ?></span>
                    <span style="font-size: 13px; color: #fff;"><?= htmlspecialchars($order['payment_method'] ?? 'PIX') ?></span>
                </div>
                <div style="font-size: 12px; color: var(--theme-muted); margin-top: 4px;">Ref: <code><?= htmlspecialchars($order['transaction_ref'] ?? 'N/A') ?></code></div>
            </div>
        </div>

        <h3 class="font-display" style="font-size: 18px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px;">
            Itens Comprados & Chaves Entregues
        </h3>

        <div style="display: flex; flex-direction: column; gap: 16px;">
            <?php foreach ($order['items'] as $item): ?>
                <div style="background: var(--theme-surface); border: 1px solid var(--theme-border); border-radius: 12px; padding: 18px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div>
                            <strong style="color: #fff; font-size: 15px;"><?= htmlspecialchars($item['product_name']) ?></strong>
                            <div style="font-size: 12px; color: var(--theme-primary);"><?= htmlspecialchars($item['platform']) ?></div>
                        </div>
                        <span style="font-family: var(--font-mono); font-weight: 800; color: #fff; font-size: 16px;">
                            <?= format_money((float)$item['subtotal']) ?>
                        </span>
                    </div>

                    <?php if (!empty($item['decrypted_key'])): ?>
                        <div class="digital-key-box" style="margin-top: 10px;">
                            <span><?= htmlspecialchars($item['decrypted_key']) ?></span>
                            <span class="badge badge-stock">Entregue ao Cliente</span>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../../includes/footer.php'; ?>
