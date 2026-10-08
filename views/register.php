<?php
/**
 * Persona Replay - Register View
 */

$pageTitle = "Criar Conta";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="container" style="padding-top: 60px; padding-bottom: 80px; max-width: 480px;">
    <div class="card" style="padding: 40px; border-radius: 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
            <span class="badge badge-primary" style="margin-bottom: 8px;">Novo Cadastro</span>
            <h1 class="font-display" style="font-size: 28px; font-weight: 900; text-transform: uppercase;">Criar sua Conta</h1>
            <p style="color: var(--theme-muted); font-size: 13px;">Cadastre-se na Persona Replay para comprar jogos e receber chaves instantâneas.</p>
        </div>

        <form method="POST" action="<?= url('cadastro') ?>" class="register-form">
            <?= csrf_field() ?>

            <div class="form-group">
                <label class="form-label" style="color: #fff;">Nome Completo</label>
                <input type="text" name="name" class="form-control form-control-auth" required placeholder="Seu Nome ou Codinome Phantom Thief" value="<?= htmlspecialchars($_POST['name'] ?? '') ?>" style="background-color: #ffffff !important; color: #000000 !important; font-weight: 600;">
            </div>

            <div class="form-group">
                <label class="form-label" style="color: #fff;">E-mail de Acesso</label>
                <input type="email" name="email" class="form-control form-control-auth" required placeholder="seu.email@exemplo.com" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" style="background-color: #ffffff !important; color: #000000 !important; font-weight: 600;">
            </div>

            <div class="form-group">
                <label class="form-label" style="color: #fff;">Senha</label>
                <input type="password" name="password" class="form-control form-control-auth" required placeholder="Mínimo de 6 caracteres" style="background-color: #ffffff !important; color: #000000 !important; font-weight: 600;">
            </div>

            <div class="form-group">
                <label class="form-label" style="color: #fff;">Confirmar Senha</label>
                <input type="password" name="password_confirm" class="form-control form-control-auth" required placeholder="Confirme sua senha" style="background-color: #ffffff !important; color: #000000 !important; font-weight: 600;">
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 8px;">
                <i class="fa-solid fa-user-plus"></i> Concluir Cadastro
            </button>
        </form>

        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--theme-border); text-align: center; font-size: 13px; color: var(--theme-muted);">
            Já possui uma conta? <a href="<?= url('login') ?>" style="color: var(--theme-primary); font-weight: 700;">Fazer Login</a>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
