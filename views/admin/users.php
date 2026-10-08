<?php
/**
 * ProjecSona - Admin Users Management View
 */

$pageTitle = "Gerenciar Usuários";
require_once __DIR__ . '/../../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
        <div>
            <span class="badge badge-primary" style="margin-bottom: 6px;">Controle de Acesso</span>
            <h1 class="font-display" style="font-size: 32px; font-weight: 900; text-transform: uppercase;">Usuários Cadastrados</h1>
        </div>
        <a href="<?= url('admin') ?>" class="btn btn-secondary btn-sm"><i class="fa-solid fa-arrow-left"></i> Voltar ao Painel</a>
    </div>

    <div class="card" style="padding: 0; overflow: hidden;">
        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Função</th>
                        <th>Status</th>
                        <th>Cadastrado em</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($users as $u): ?>
                        <tr>
                            <td>
                                <strong style="color: #fff; font-size: 14px;"><?= htmlspecialchars($u['name']) ?></strong>
                            </td>
                            <td><?= htmlspecialchars($u['email']) ?></td>
                            <td>
                                <?php if ($u['role'] === 'ADMIN'): ?>
                                    <span class="badge badge-primary">ADMINISTRADOR</span>
                                <?php else: ?>
                                    <span class="badge badge-secondary" style="border: 1px solid var(--theme-border);">CLIENTE</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?php if ($u['status'] === 'ACTIVE'): ?>
                                    <span class="badge badge-stock">Ativo</span>
                                <?php else: ?>
                                    <span class="badge badge-out"><?= htmlspecialchars($u['status']) ?></span>
                                <?php endif; ?>
                            </td>
                            <td style="color: var(--theme-muted); font-size: 13px;">
                                <?= date('d/m/Y H:i', strtotime($u['created_at'])) ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../../includes/footer.php'; ?>
