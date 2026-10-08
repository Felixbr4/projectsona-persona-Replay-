<?php
/**
 * ProjecSona - Checkout View
 */

$pageTitle = "Finalizar Pedido";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px;">
    <!-- Header -->
    <div style="margin-bottom: 32px;">
        <span class="badge badge-primary" style="margin-bottom: 8px;">Ambiente Seguro 256-Bit</span>
        <h1 class="font-display" style="font-size: 36px; font-weight: 900; text-transform: uppercase;">Finalização do Pedido</h1>
    </div>

    <form method="POST" action="<?= url('checkout/processar') ?>">
        <?= csrf_field() ?>
        
        <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 32px; align-items: flex-start;" class="checkout-layout">
            <!-- Left: Payment Method & Customer Information -->
            <div style="display: flex; flex-direction: column; gap: 24px;">
                <!-- Payment Selection -->
                <div class="card" style="padding: 28px;">
                    <h3 class="font-display" style="font-size: 18px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px;">
                        1. Escolha a Forma de Pagamento
                    </h3>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                        <label style="border: 2px solid var(--theme-primary); border-radius: 12px; padding: 18px; cursor: pointer; background: rgba(59, 130, 246, 0.08); display: flex; align-items: center; gap: 12px;">
                            <input type="radio" name="payment_method" value="PIX" checked style="accent-color: var(--theme-primary);">
                            <div>
                                <strong style="color: #fff; font-size: 15px; display: block;">Pix Instantâneo</strong>
                                <span style="font-size: 12px; color: var(--theme-muted);">Aprovação e chave em segundos</span>
                            </div>
                        </label>

                        <label style="border: 1px solid var(--theme-border); border-radius: 12px; padding: 18px; cursor: pointer; background: var(--theme-surface); display: flex; align-items: center; gap: 12px;">
                            <input type="radio" name="payment_method" value="CREDIT_CARD" style="accent-color: var(--theme-primary);">
                            <div>
                                <strong style="color: #fff; font-size: 15px; display: block;">Cartão de Crédito</strong>
                                <span style="font-size: 12px; color: var(--theme-muted);">Até 3x sem juros (Simulado)</span>
                            </div>
                        </label>
                    </div>

                    <!-- Pix Demonstration Box -->
                    <div style="background: #050508; border: 1px dashed var(--theme-border); border-radius: 12px; padding: 20px; text-align: center;">
                        <i class="fa-brands fa-pix" style="font-size: 32px; color: #10b981; margin-bottom: 8px;"></i>
                        <h4 style="font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 4px;">Pagamento com Pix Simulado</h4>
                        <p style="font-size: 12px; color: var(--theme-muted);">Ao confirmar o pedido, o sistema aprovará a transação instantaneamente e liberará sua chave Steam na hora.</p>
                    </div>
                </div>

                <!-- Customer Details -->
                <div class="card" style="padding: 28px;">
                    <h3 class="font-display" style="font-size: 18px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px;">
                        2. Dados do Comprador
                    </h3>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label class="form-label">Nome Completo</label>
                            <input type="text" class="form-control" value="<?= htmlspecialchars($user['name'] ?? 'Ren Amamiya') ?>" readonly style="background: #09090d; opacity: 0.8;">
                        </div>

                        <div class="form-group">
                            <label class="form-label">E-mail para Envio da Chave</label>
                            <input type="email" class="form-control" value="<?= htmlspecialchars($user['email'] ?? 'ren.amamiya@projecsona.com') ?>" readonly style="background: #09090d; opacity: 0.8;">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right: Order Review & Submit -->
            <div class="card" style="padding: 28px; position: sticky; top: 100px;">
                <h3 class="font-display" style="font-size: 18px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px;">
                    Itens no Pedido
                </h3>

                <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
                    <?php foreach ($items as $item): ?>
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                            <div>
                                <strong style="color: #fff;"><?= htmlspecialchars($item['name']) ?></strong>
                                <div style="font-size: 11px; color: var(--theme-muted);"><?= $item['quantity'] ?>x <?= format_money($item['price']) ?></div>
                            </div>
                            <span style="font-family: var(--font-mono); font-weight: 800; color: #fff;">
                                <?= format_money($item['subtotal']) ?>
                            </span>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div style="border-top: 1px solid var(--theme-border); padding-top: 16px; margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <span style="font-weight: 800; text-transform: uppercase;">Total a Pagar</span>
                        <span style="font-family: var(--font-mono); font-size: 28px; font-weight: 900; color: var(--theme-primary);">
                            <?= format_money($total) ?>
                        </span>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-lg">
                    <i class="fa-solid fa-check"></i> Pagar e Liberar Chaves Agora
                </button>

                <div style="margin-top: 16px; text-align: center;">
                    <a href="<?= url('carrinho') ?>" style="font-size: 12px; color: var(--theme-muted);">
                        <i class="fa-solid fa-arrow-left"></i> Voltar ao Carrinho
                    </a>
                </div>
            </div>
        </div>
    </form>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
