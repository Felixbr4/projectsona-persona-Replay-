<?php
/**
 * ProjecSona - Admin Offers View
 */

$pageTitle = "Gerenciar Ofertas Externas";
require_once __DIR__ . '/../../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
        <div>
            <span class="badge badge-primary" style="margin-bottom: 6px;">Comparador de Preços</span>
            <h1 class="font-display" style="font-size: 32px; font-weight: 900; text-transform: uppercase;">Ofertas de Lojas Externas</h1>
        </div>
        <a href="<?= url('admin') ?>" class="btn btn-secondary btn-sm"><i class="fa-solid fa-arrow-left"></i> Voltar ao Painel</a>
    </div>

    <!-- Quick Offer Creator -->
    <div class="card" style="padding: 28px; margin-bottom: 36px; border-left: 4px solid var(--theme-primary);">
        <h3 class="font-display" style="font-size: 18px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px;">
            <i class="fa-solid fa-plus-circle"></i> Cadastrar Nova Oferta Externa
        </h3>

        <form method="POST" action="<?= url('admin/ofertas/nova') ?>">
            <?= csrf_field() ?>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) 140px; gap: 16px; align-items: flex-end;">
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Loja</label>
                    <select name="store_id" class="form-control" required>
                        <?php foreach ($stores as $s): ?>
                            <option value="<?= htmlspecialchars($s['id']) ?>"><?= htmlspecialchars($s['name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Jogo Persona</label>
                    <select name="game_id" class="form-control" required>
                        <?php foreach ($games as $g): ?>
                            <option value="<?= htmlspecialchars($g['id']) ?>"><?= htmlspecialchars($g['name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Preço da Oferta (R$)</label>
                    <input type="number" step="0.01" name="price" class="form-control" required placeholder="129.90">
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">URL da Loja</label>
                    <input type="url" name="url" class="form-control" required placeholder="https://store...">
                </div>

                <div>
                    <button type="submit" class="btn btn-primary btn-block" style="padding: 12px;">
                        <i class="fa-solid fa-save"></i> Salvar
                    </button>
                </div>
            </div>
        </form>
    </div>

    <!-- Offers List -->
    <div class="card" style="padding: 0; overflow: hidden;">
        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Jogo</th>
                        <th>Loja</th>
                        <th>Plataforma</th>
                        <th>Preço Oficial</th>
                        <th>Preço da Oferta</th>
                        <th>URL</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($offers as $off): ?>
                        <tr>
                            <td><strong style="color: #fff;"><?= htmlspecialchars($off['game_name']) ?></strong></td>
                            <td><?= htmlspecialchars($off['store_name']) ?></td>
                            <td><span class="badge badge-primary"><?= htmlspecialchars($off['platform']) ?></span></td>
                            <td><?= $off['original_price'] ? format_money((float)$off['original_price']) : '-' ?></td>
                            <td>
                                <span style="font-family: var(--font-mono); font-weight: 800; color: #fff;">
                                    <?= format_money((float)$off['price']) ?>
                                </span>
                            </td>
                            <td>
                                <a href="<?= htmlspecialchars($off['url']) ?>" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                                    Abrir Link <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../../includes/footer.php'; ?>
