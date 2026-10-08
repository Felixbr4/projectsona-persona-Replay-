<?php
/**
 * ProjecSona - Shopping Cart View
 */

$pageTitle = "Meu Carrinho";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px;">
    <!-- Section Header -->
    <div style="margin-bottom: 32px;">
        <span class="badge badge-primary" style="margin-bottom: 8px;">Checkout Seguro</span>
        <h1 class="font-display" style="font-size: 36px; font-weight: 900; text-transform: uppercase;">Carrinho de Compras</h1>
    </div>

    <?php if (empty($items)): ?>
        <div class="card" style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 48px; color: var(--theme-muted); margin-bottom: 16px;">
                <i class="fa-solid fa-cart-shopping"></i>
            </div>
            <h3 class="font-display" style="font-size: 22px; font-weight: 800; margin-bottom: 8px;">Seu carrinho está vazio</h3>
            <p style="color: var(--theme-muted); font-size: 14px; margin-bottom: 24px;">Explore nosso catálogo e adicione suas edições favoritas de Persona.</p>
            <a href="<?= url('catalogo') ?>" class="btn btn-primary">
                <i class="fa-solid fa-bag-shopping"></i> Ir às Compras
            </a>
        </div>
    <?php else: ?>
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px; align-items: flex-start;" class="cart-layout">
            <!-- Left: Items Table -->
            <div class="card" style="padding: 0; overflow: hidden;">
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Preço Unitário</th>
                                <th>Qtd</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($items as $item): ?>
                                <tr>
                                    <td>
                                        <div style="display: flex; gap: 14px; align-items: center;">
                                            <img src="<?= htmlspecialchars($item['image'] ?: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200&auto=format&fit=crop') ?>" alt="<?= htmlspecialchars($item['name']) ?>" style="width: 60px; height: 40px; object-fit: cover; border-radius: 6px;">
                                            <div>
                                                <a href="<?= url('produto/' . $item['slug']) ?>" style="font-weight: 800; color: #fff; display: block; font-size: 14px;">
                                                    <?= htmlspecialchars($item['name']) ?>
                                                </a>
                                                <span style="font-size: 11px; color: var(--theme-primary); text-transform: uppercase;">
                                                    <?= htmlspecialchars($item['platform']) ?> • <?= htmlspecialchars($item['edition']) ?>
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span style="font-family: var(--font-mono); font-weight: 700;">
                                            <?= format_money($item['price']) ?>
                                        </span>
                                    </td>
                                    <td>
                                        <form action="<?= url('carrinho/atualizar') ?>" method="POST" style="display: inline-flex; align-items: center; gap: 6px;">
                                            <?= csrf_field() ?>
                                            <input type="hidden" name="product_id" value="<?= htmlspecialchars($item['product_id']) ?>">
                                            <input type="number" name="quantity" min="1" max="<?= $item['stock'] ?>" value="<?= $item['quantity'] ?>" class="form-control cart-qty-input" style="width: 60px; padding: 6px; text-align: center;">
                                        </form>
                                    </td>
                                    <td>
                                        <span style="font-family: var(--font-mono); font-weight: 800; color: #fff;">
                                            <?= format_money($item['subtotal']) ?>
                                        </span>
                                    </td>
                                    <td style="text-align: right;">
                                        <form action="<?= url('carrinho/remover') ?>" method="POST" style="display: inline;">
                                            <?= csrf_field() ?>
                                            <input type="hidden" name="product_id" value="<?= htmlspecialchars($item['product_id']) ?>">
                                            <button type="submit" class="btn btn-secondary btn-sm" title="Remover item" style="color: #ef4444; border-color: rgba(239,68,68,0.3);">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

                <div style="padding: 16px 24px; background: var(--theme-surface); display: flex; justify-content: space-between; align-items: center;">
                    <a href="<?= url('catalogo') ?>" class="btn btn-secondary btn-sm">
                        <i class="fa-solid fa-arrow-left"></i> Continuar Comprando
                    </a>
                    <form action="<?= url('carrinho/limpar') ?>" method="POST" style="display: inline;">
                        <?= csrf_field() ?>
                        <button type="submit" class="btn btn-secondary btn-sm" onclick="return confirm('Deseja realmente limpar todo o carrinho?');">
                            Limpar Carrinho
                        </button>
                    </form>
                </div>
            </div>

            <!-- Right: Summary & Checkout Button -->
            <div class="card" style="padding: 24px; position: sticky; top: 100px;">
                <h3 class="font-display" style="font-size: 18px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px;">Resumo do Pedido</h3>

                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: var(--theme-muted);">
                    <span>Subtotal</span>
                    <span style="font-family: var(--font-mono);"><?= format_money($total) ?></span>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 14px; color: #10b981;">
                    <span>Entrega Digital</span>
                    <span style="font-weight: 700;">Grátis (Imediata)</span>
                </div>

                <div style="border-top: 1px solid var(--theme-border); padding-top: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: baseline;">
                    <span style="font-weight: 800; font-size: 16px; text-transform: uppercase;">Total</span>
                    <span style="font-family: var(--font-mono); font-size: 26px; font-weight: 900; color: var(--theme-primary);">
                        <?= format_money($total) ?>
                    </span>
                </div>

                <a href="<?= url('checkout') ?>" class="btn btn-primary btn-block btn-lg">
                    <i class="fa-solid fa-lock"></i> Finalizar Compra
                </a>

                <div style="margin-top: 20px; text-align: center; font-size: 11px; color: var(--theme-muted); line-height: 1.5;">
                    <i class="fa-solid fa-shield-halved" style="color: var(--theme-primary);"></i> Pagamento protegido e liberação instantânea da sua chave Steam.
                </div>
            </div>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
