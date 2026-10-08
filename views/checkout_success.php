<?php
/**
 * ProjecSona - Checkout Success / Key Delivery View
 */

$pageTitle = "Pedido Aprovado!";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px; max-width: 860px;">
    <!-- Success Celebration Card -->
    <div class="card" style="text-align: center; padding: 40px; margin-bottom: 32px; border-color: #10b981; background: rgba(16, 185, 129, 0.05);">
        <div style="width: 70px; height: 70px; border-radius: 50%; background: #10b981; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px auto; box-shadow: 0 0 25px rgba(16, 185, 129, 0.5);">
            <i class="fa-solid fa-check"></i>
        </div>

        <span class="badge badge-stock" style="margin-bottom: 8px;">Pagamento Aprovado Instantaneamente</span>
        <h1 class="font-display" style="font-size: 36px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;">
            Obrigado pelo seu Pedido!
        </h1>
        <p style="color: var(--theme-muted); font-size: 15px;">
            Pedido <strong><?= htmlspecialchars($order['order_number']) ?></strong> • Total: <strong style="color: #fff;"><?= format_money((float)$order['total_amount']) ?></strong>
        </p>
    </div>

    <!-- Digital Keys Display Section -->
    <div class="card" style="padding: 32px; margin-bottom: 32px;">
        <h2 class="font-display" style="font-size: 22px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px;">
            <i class="fa-solid fa-key" style="color: var(--theme-primary);"></i> Suas Chaves Oficiais Steam
        </h2>

        <div style="display: flex; flex-direction: column; gap: 24px;">
            <?php foreach ($order['items'] as $item): ?>
                <div style="background: var(--theme-surface); border: 1px solid var(--theme-border); border-radius: 14px; padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                        <div>
                            <h3 style="font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 2px;">
                                <?= htmlspecialchars($item['product_name']) ?>
                            </h3>
                            <span style="font-size: 12px; color: var(--theme-primary); text-transform: uppercase; font-weight: 700;">
                                Plataforma: <?= htmlspecialchars($item['platform']) ?>
                            </span>
                        </div>
                        <span class="badge badge-stock"><i class="fa-solid fa-circle-check"></i> Pronta para Resgate</span>
                    </div>

                    <!-- Decrypted Key Box with Copy Action -->
                    <?php if (!empty($item['decrypted_key'])): ?>
                        <div class="digital-key-box">
                            <span><?= htmlspecialchars($item['decrypted_key']) ?></span>
                            <button type="button" class="btn btn-primary btn-sm btn-copy-key" data-key="<?= htmlspecialchars($item['decrypted_key']) ?>">
                                <i class="fa-solid fa-copy"></i> Copiar Chave
                            </button>
                        </div>
                    <?php else: ?>
                        <div class="alert alert-warning" style="margin-bottom: 0;">
                            Chave em processamento ou aguardando reposição imediata.
                        </div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Activation Guide -->
    <div class="card" style="padding: 32px; margin-bottom: 32px;">
        <h3 class="font-display" style="font-size: 18px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px;">
            <i class="fa-brands fa-steam"></i> Como ativar sua chave na Steam
        </h3>
        <ol style="padding-left: 20px; color: var(--theme-muted); font-size: 14px; line-height: 1.8;">
            <li>Abra o aplicativo da <strong>Steam</strong> no seu computador e faça login na sua conta.</li>
            <li>No menu superior, clique em <strong>Jogos</strong> ➔ <strong>Ativar um produto no Steam...</strong></li>
            <li>Siga as instruções na tela e cole a chave copiada acima no campo correspondente.</li>
            <li>Conclua o processo e o jogo será adicionado imediatamente à sua biblioteca Steam para download!</li>
        </ol>
    </div>

    <!-- Actions -->
    <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
        <a href="<?= url('conta/pedidos/' . $order['id']) ?>" class="btn btn-secondary">
            <i class="fa-solid fa-file-invoice"></i> Ver Detalhes do Pedido
        </a>
        <a href="<?= url('catalogo') ?>" class="btn btn-primary">
            <i class="fa-solid fa-bag-shopping"></i> Continuar Explorando a Loja
        </a>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
