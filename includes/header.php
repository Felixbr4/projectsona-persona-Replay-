<?php
/**
 * Persona Replay - Layout Header
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../models/Cart.php';

$currentTheme = $_SESSION['theme'] ?? 'persona5';
$isVelvet = !empty($_SESSION['velvet_mode']) || (isset($_COOKIE['persona_velvet']) && $_COOKIE['persona_velvet'] === '1');

$bodyClasses = ['theme-' . $currentTheme];
if ($isVelvet) {
    $bodyClasses[] = 'velvet-mode';
}
$themeClass = implode(' ', $bodyClasses);

$cartCount = Cart::count();
$user = current_user();
$flash = get_flash();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($pageTitle) ? htmlspecialchars($pageTitle) . ' | ' : '' ?><?= APP_NAME ?> - <?= APP_TAGLINE ?></title>
    
    <!-- Design System CSS -->
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="<?= $themeClass ?>" data-base-url="<?= BASE_URL ?>" data-velvet-active="<?= $isVelvet ? 'true' : 'false' ?>">

    <!-- Top Navigation Bar -->
    <header class="navbar">
        <div class="container navbar-inner">
            <!-- Main Brand Logo (Persona Replay) -->
            <a href="<?= url('/') ?>" class="logo-brand-wrap" title="Persona Replay">
                <img src="<?= asset('images/logo.png') ?>" alt="Persona Replay Logo" class="logo-brand-img">
            </a>

            <!-- Navigation Links -->
            <nav class="nav-links">
                <a href="<?= url('/') ?>" class="nav-link <?= (!isset($activeNav) || $activeNav === 'home') ? 'active' : '' ?>">Início</a>
                <a href="<?= url('catalogo') ?>" class="nav-link <?= (isset($activeNav) && $activeNav === 'catalog') ? 'active' : '' ?>">Catálogo</a>
                <a href="<?= url('jogos') ?>" class="nav-link <?= (isset($activeNav) && $activeNav === 'games') ? 'active' : '' ?>">Jogos & Lore</a>
                <a href="<?= url('ofertas') ?>" class="nav-link <?= (isset($activeNav) && $activeNav === 'offers') ? 'active' : '' ?>">Comparador</a>
                <a href="<?= url('lgpd') ?>" class="nav-link <?= (isset($activeNav) && $activeNav === 'lgpd') ? 'active' : '' ?>">LGPD</a>
            </nav>

            <!-- Actions: Game Tabs, Velvet Palette Toggle, Cart & User Actions -->
            <div class="nav-actions">
                <!-- Seletor de Abas dos Jogos com Siglas Ampliadas (P3R, P4R, P5R) -->
                <div class="game-tabs-selector" role="tablist" aria-label="Seletor de Jogos Persona">
                    <button type="button" 
                            class="game-tab-pill p3-tab <?= $currentTheme === 'persona3' ? 'active' : '' ?>" 
                            data-theme="persona3" 
                            data-transition-theme="persona3" 
                            data-url="<?= url('jogos/persona-3-reload') ?>" 
                            title="Persona 3 Reload">
                        <span class="tab-sigla">P3R</span>
                    </button>
                    <button type="button" 
                            class="game-tab-pill p4-tab <?= $currentTheme === 'persona4' ? 'active' : '' ?>" 
                            data-theme="persona4" 
                            data-transition-theme="persona4" 
                            data-url="<?= url('jogos/persona-4') ?>" 
                            title="Persona 4 Revival">
                        <span class="tab-sigla">P4R</span>
                    </button>
                    <button type="button" 
                            class="game-tab-pill p5-tab <?= $currentTheme === 'persona5' ? 'active' : '' ?>" 
                            data-theme="persona5" 
                            data-transition-theme="persona5" 
                            data-url="<?= url('jogos/persona-5-royal') ?>" 
                            title="Persona 5 Royal">
                        <span class="tab-sigla">P5R</span>
                    </button>
                </div>

                <!-- Controle Independente da Paleta Velvet Room -->
                <button type="button" 
                        id="velvet-toggle-btn" 
                        class="velvet-btn <?= $isVelvet ? 'active' : '' ?>" 
                        aria-pressed="<?= $isVelvet ? 'true' : 'false' ?>" 
                        title="Alternar paleta de cores Velvet Room">
                    <span class="velvet-dot"></span>
                    <i class="fa-solid fa-moon"></i>
                    <span class="velvet-text">Velvet</span>
                </button>

                <!-- Cart Button -->
                <a href="<?= url('carrinho') ?>" class="btn btn-secondary btn-sm" style="position: relative;" title="Carrinho de Compras">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <?php if ($cartCount > 0): ?>
                        <span class="badge badge-discount" style="padding: 2px 6px; font-size: 10px; margin-left: 4px;"><?= $cartCount ?></span>
                    <?php endif; ?>
                </a>

                <!-- User Profile / Auth -->
                <?php if ($user): ?>
                    <?php if (is_admin()): ?>
                        <a href="<?= url('admin') ?>" class="btn btn-primary btn-sm">
                            <i class="fa-solid fa-shield-halved"></i> Admin
                        </a>
                    <?php endif; ?>
                    <a href="<?= url('conta') ?>" class="btn btn-secondary btn-sm">
                        <i class="fa-solid fa-user"></i> <?= htmlspecialchars(explode(' ', $user['name'])[0]) ?>
                    </a>
                    <a href="<?= url('logout') ?>" class="btn btn-secondary btn-sm" title="Encerrar Sessão">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                    </a>
                <?php else: ?>
                    <a href="<?= url('login') ?>" class="btn btn-primary btn-sm">Entrar</a>
                <?php endif; ?>
            </div>
        </div>
    </header>

    <!-- Flash Notification Messages -->
    <?php if ($flash): ?>
        <div class="container" style="margin-top: 20px;">
            <div class="alert alert-<?= htmlspecialchars($flash['type']) ?> alert-dismissible">
                <i class="fa-solid fa-circle-info"></i>
                <span><?= htmlspecialchars($flash['message']) ?></span>
            </div>
        </div>
    <?php endif; ?>

    <!-- Main Page Content -->
    <main>
