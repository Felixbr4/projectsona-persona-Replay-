<?php
/**
 * ProjecSona - Admin Product Form (Create / Edit)
 */

$isEdit = !empty($product);
$pageTitle = $isEdit ? "Editar Produto" : "Novo Produto";
require_once __DIR__ . '/../../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px; max-width: 760px;">
    <div style="margin-bottom: 32px;">
        <span class="badge badge-primary" style="margin-bottom: 6px;">Catálogo da Loja</span>
        <h1 class="font-display" style="font-size: 28px; font-weight: 900; text-transform: uppercase;">
            <?= $isEdit ? "Editar Produto" : "Cadastrar Novo Produto" ?>
        </h1>
    </div>

    <div class="card" style="padding: 36px;">
        <form method="POST" action="<?= $isEdit ? url('admin/produtos/editar/' . $product['id']) : url('admin/produtos/novo') ?>">
            <?= csrf_field() ?>

            <div class="form-group">
                <label class="form-label">Jogo Pertencente</label>
                <select name="game_id" class="form-control" required>
                    <?php foreach ($games as $g): ?>
                        <option value="<?= htmlspecialchars($g['id']) ?>" <?= ($isEdit && $product['game_id'] === $g['id']) ? 'selected' : '' ?>>
                            <?= htmlspecialchars($g['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Nome do Produto</label>
                <input type="text" name="name" class="form-control" required placeholder="Ex: Persona 5 Royal - Deluxe Edition" value="<?= htmlspecialchars($product['name'] ?? '') ?>">
            </div>

            <div class="form-group">
                <label class="form-label">Slug URL</label>
                <input type="text" name="slug" class="form-control" required placeholder="persona-5-royal-deluxe" value="<?= htmlspecialchars($product['slug'] ?? '') ?>">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label class="form-label">Edição</label>
                    <input type="text" name="edition" class="form-control" required placeholder="Ex: Standard Edition, Deluxe..." value="<?= htmlspecialchars($product['edition'] ?? 'Standard Edition') ?>">
                </div>

                <div class="form-group">
                    <label class="form-label">Plataforma</label>
                    <select name="platform" class="form-control">
                        <option value="Steam" <?= ($isEdit && ($product['platform'] ?? '') === 'Steam') ? 'selected' : '' ?>>Steam</option>
                        <option value="PlayStation" <?= ($isEdit && ($product['platform'] ?? '') === 'PlayStation') ? 'selected' : '' ?>>PlayStation</option>
                        <option value="Xbox" <?= ($isEdit && ($product['platform'] ?? '') === 'Xbox') ? 'selected' : '' ?>>Xbox</option>
                        <option value="Switch" <?= ($isEdit && ($product['platform'] ?? '') === 'Switch') ? 'selected' : '' ?>>Nintendo Switch</option>
                    </select>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label class="form-label">Preço de Venda (R$)</label>
                    <input type="number" step="0.01" name="price" class="form-control" required placeholder="149.90" value="<?= htmlspecialchars($product['price'] ?? '') ?>">
                </div>

                <div class="form-group">
                    <label class="form-label">Preço Original / De (R$)</label>
                    <input type="number" step="0.01" name="original_price" class="form-control" placeholder="299.90" value="<?= htmlspecialchars($product['original_price'] ?? '') ?>">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">URL da Imagem de Capa</label>
                <input type="url" name="image" class="form-control" placeholder="https://..." value="<?= htmlspecialchars($product['image'] ?? '') ?>">
            </div>

            <div class="form-group">
                <label class="form-label">Descrição Completa</label>
                <textarea name="description" class="form-control" rows="4" required placeholder="Descrição detalhada dos itens inclusos..."><?= htmlspecialchars($product['description'] ?? '') ?></textarea>
            </div>

            <div style="display: flex; gap: 24px; margin-bottom: 24px;">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: #fff; font-size: 14px;">
                    <input type="checkbox" name="active" value="1" <?= (!$isEdit || !empty($product['active'])) ? 'checked' : '' ?> style="accent-color: var(--theme-primary);">
                    Produto Ativo no Catálogo
                </label>

                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: #fff; font-size: 14px;">
                    <input type="checkbox" name="is_featured" value="1" <?= (!empty($product['is_featured'])) ? 'checked' : '' ?> style="accent-color: var(--theme-primary);">
                    Destacar na Página Inicial
                </label>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
                <a href="<?= url('admin/produtos') ?>" class="btn btn-secondary">Cancelar</a>
                <button type="submit" class="btn btn-primary btn-lg">
                    <i class="fa-solid fa-save"></i> Salvar Produto
                </button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/../../includes/footer.php'; ?>
