<?php
/**
 * ProjecSona - Order Detail View for Account
 */

$pageTitle = "Pedido " . $order['order_number'];
require_once __DIR__ . '/../../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px; max-width: 860px;">
    <!-- Breadcrumb -->
    <div style="font-size: 13px; color: var(--theme-muted); margin-bottom: 24px; display: flex; align-items: center; gap: 8px;">
        <a href="<?= url('conta') ?>">Minha Conta</a>
        <span>/</span>
        <span style="color: #fff;">Pedido <?= htmlspecialchars($order['order_number']) ?></span>
    </div>

    <div class="card" style="padding: 32px; margin-bottom: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
            <div>
                <span class="badge badge-primary" style="margin-bottom: 6px;">Comprovante do Pedido</span>
                <h1 class="font-display" style="font-size: 28px; font-weight: 900; text-transform: uppercase;">
                    <?= htmlspecialchars($order['order_number']) ?>
                </h1>
                <div style="font-size: 13px; color: var(--theme-muted);">
                    Data: <?= date('d/m/Y H:i', strtotime($order['created_at'])) ?> • Ref Transação: <code><?= htmlspecialchars($order['transaction_ref'] ?? 'N/A') ?></code>
                </div>
            </div>

            <div style="text-align: right;">
                <span class="badge badge-stock" style="font-size: 12px; padding: 6px 12px; margin-bottom: 6px;">
                    <?= htmlspecialchars($order['status']) ?>
                </span>
                <div style="font-family: var(--font-mono); font-size: 22px; font-weight: 900; color: #fff;">
                    <?= format_money((float)$order['total_amount']) ?>
                </div>
            </div>
        </div>

        <!-- Items & Digital Keys -->
        <h3 class="font-display" style="font-size: 18px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px;">
            Itens e Chaves Steam Adquiridas
        </h3>

        <div style="display: flex; flex-direction: column; gap: 20px;">
            <?php foreach ($order['items'] as $item): ?>
                <div style="background: var(--theme-surface); border: 1px solid var(--theme-border); border-radius: 14px; padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                        <div>
                            <h4 style="font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 4px;">
                                <?= htmlspecialchars($item['product_name']) ?>
                            </h4>
                            <span style="font-size: 12px; color: var(--theme-primary); text-transform: uppercase; font-weight: 700;">
                                <?= htmlspecialchars($item['platform']) ?> • <?= $item['quantity'] ?>x <?= format_money((float)$item['unit_price']) ?>
                            </span>
                        </div>
                        <span style="font-family: var(--font-mono); font-weight: 800; color: #fff; font-size: 16px;">
                            <?= format_money((float)$item['subtotal']) ?>
                        </span>
                    </div>

                    <!-- Digital Key Box -->
                    <?php if (!empty($item['decrypted_key'])): ?>
                        <div class="digital-key-box">
                            <span><?= htmlspecialchars($item['decrypted_key']) ?></span>
                            <button type="button" class="btn btn-primary btn-sm btn-copy-key" data-key="<?= htmlspecialchars($item['decrypted_key']) ?>">
                                <i class="fa-solid fa-copy"></i> Copiar Chave
                            </button>
                        </div>
                    <?php else: ?>
                        <div class="alert alert-warning" style="margin-bottom: 0;">
                            Chave em processamento.
                        </div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Back to Account -->
    <a href="<?= url('conta') ?>" class="btn btn-secondary">
        <i class="fa-solid fa-arrow-left"></i> Voltar para Meus Pedidos
    </a>
</div>

<?php require_once __DIR__ . '/../../includes/footer.php'; ?>
