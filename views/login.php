<?php
/**
 * Persona Replay - Login View
 */

$pageTitle = "Entrar na Conta";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="container" style="padding-top: 60px; padding-bottom: 80px; max-width: 480px;">
    <div class="card" style="padding: 40px; border-radius: 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
            <span class="badge badge-primary" style="margin-bottom: 8px;">Autenticação Velvet</span>
            <h1 class="font-display" style="font-size: 28px; font-weight: 900; text-transform: uppercase;">Acessar sua Conta</h1>
            <p style="color: var(--theme-muted); font-size: 13px;">Entre na Persona Replay para visualizar suas chaves digitais e pedidos.</p>
        </div>

        <form method="POST" action="<?= url('login') ?>" class="login-form">
            <?= csrf_field() ?>

            <div class="form-group">
                <label class="form-label" style="color: #fff;">E-mail de Acesso</label>
                <input type="email" name="email" class="form-control form-control-auth" required placeholder="seu.email@exemplo.com" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" style="background-color: #ffffff !important; color: #000000 !important; font-weight: 600;">
            </div>

            <div class="form-group">
                <label class="form-label" style="color: #fff;">Senha</label>
                <input type="password" name="password" class="form-control form-control-auth" required placeholder="••••••••" style="background-color: #ffffff !important; color: #000000 !important; font-weight: 600;">
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 8px;">
                <i class="fa-solid fa-right-to-bracket"></i> Entrar
            </button>
        </form>

        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--theme-border); text-align: center; font-size: 13px; color: var(--theme-muted);">
            Ainda não tem conta? <a href="<?= url('cadastro') ?>" style="color: var(--theme-primary); font-weight: 700;">Criar uma Conta</a>
        </div>

        <!-- Quick Demo Credentials Box -->
        <div style="margin-top: 24px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4); border-radius: 10px; padding: 14px; font-size: 11px; line-height: 1.6;">
            <strong style="color: #fff; display: block; margin-bottom: 4px;">⚡ Acesso Rápido de Demonstração:</strong>
            <div><strong>Admin:</strong> admin@projecsona.com | <code>adminpassword123</code></div>
            <div><strong>Cliente:</strong> ren.amamiya@projecsona.com | <code>userpassword123</code></div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
