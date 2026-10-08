<?php
/**
 * ProjecSona - Admin Digital Keys Management View
 */

$pageTitle = "Estoque de Chaves Digitais";
require_once __DIR__ . '/../../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
        <div>
            <span class="badge badge-primary" style="margin-bottom: 6px;">Criptografia AES-256</span>
            <h1 class="font-display" style="font-size: 32px; font-weight: 900; text-transform: uppercase;">Estoque de Chaves Steam</h1>
        </div>
        <a href="<?= url('admin') ?>" class="btn btn-secondary btn-sm"><i class="fa-solid fa-arrow-left"></i> Voltar ao Painel</a>
    </div>

    <!-- Batch Key Insertion Form -->
    <div class="card" style="padding: 28px; margin-bottom: 36px; border-left: 4px solid var(--theme-primary);">
        <h3 class="font-display" style="font-size: 18px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px;">
            <i class="fa-solid fa-plus-circle"></i> Inserir Novas Chaves Digitais
        </h3>

        <form method="POST" action="<?= url('admin/chaves/adicionar') ?>">
            <?= csrf_field() ?>

            <div style="display: grid; grid-template-columns: 1fr 2fr 160px; gap: 16px; align-items: flex-end;">
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Selecione o Produto</label>
                    <select name="product_id" class="form-control" required>
                        <?php foreach ($products as $p): ?>
                            <option value="<?= htmlspecialchars($p['id']) ?>">
                                <?= htmlspecialchars($p['name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Código da Chave Steam</label>
                    <input type="text" name="key_code" class="form-control font-mono" required placeholder="Ex: P5RY-ABCD-1234-EF56">
                </div>

                <div>
                    <button type="submit" class="btn btn-primary btn-block" style="padding: 12px;">
                        <i class="fa-solid fa-lock"></i> Criptografar & Salvar
                    </button>
                </div>
            </div>
        </form>
    </div>

    <!-- Keys Inventory Table -->
    <div class="card" style="padding: 0; overflow: hidden;">
        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Chave Descriptografada</th>
                        <th>Status</th>
                        <th>Pedido Vinculado</th>
                        <th>Data de Inserção</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($keys)): ?>
                        <tr>
                            <td colspan="5" style="text-align: center; padding: 32px; color: var(--theme-muted);">Nenhuma chave cadastrada no momento.</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($keys as $k): 
                            $rawCode = DigitalKey::getDecryptedCode($k['code_encrypted']);
                        ?>
                            <tr>
                                <td>
                                    <strong style="color: #fff; font-size: 14px;"><?= htmlspecialchars($k['product_name']) ?></strong>
                                    <div style="font-size: 11px; color: var(--theme-muted);"><?= htmlspecialchars($k['game_name']) ?></div>
                                </td>
                                <td>
                                    <code style="font-family: var(--font-mono); font-size: 13px; color: var(--theme-primary); font-weight: 700;">
                                        <?= htmlspecialchars($rawCode ?? 'ERRO-KEY') ?>
                                    </code>
                                </td>
                                <td>
                                    <?php if ($k['status'] === 'AVAILABLE'): ?>
                                        <span class="badge badge-stock">Disponível</span>
                                    <?php elseif ($k['status'] === 'SOLD'): ?>
                                        <span class="badge badge-out">Vendida</span>
                                    <?php else: ?>
                                        <span class="badge badge-primary"><?= htmlspecialchars($k['status']) ?></span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if (!empty($k['order_number'])): ?>
                                        <span style="font-family: var(--font-mono); font-weight: 700; color: #fff;">
                                            <?= htmlspecialchars($k['order_number']) ?>
                                        </span>
                                    <?php else: ?>
                                        <span style="color: var(--theme-muted);">-</span>
                                    <?php endif; ?>
                                </td>
                                <td style="color: var(--theme-muted); font-size: 13px;">
                                    <?= date('d/m/Y H:i', strtotime($k['created_at'])) ?>
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
