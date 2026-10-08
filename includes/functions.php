<?php
/**
 * ProjecSona - Core Helper Functions
 */

require_once __DIR__ . '/../config/config.php';

/**
 * Format currency to Brazilian Real (R$)
 */
function format_money(float $amount): string {
    return 'R$ ' . number_format($amount, 2, ',', '.');
}

/**
 * Calculate discount percentage between original price and current price
 */
function get_discount_percentage(float $currentPrice, ?float $originalPrice): int {
    if (!$originalPrice || $originalPrice <= $currentPrice) {
        return 0;
    }
    return (int) round((($originalPrice - $currentPrice) / $originalPrice) * 100);
}

/**
 * Encrypt digital product key with AES-256-CBC
 */
function encrypt_key(string $plainKey): array {
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length(ENCRYPTION_CIPHER));
    $encrypted = openssl_encrypt($plainKey, ENCRYPTION_CIPHER, ENCRYPTION_KEY, 0, $iv);
    $fullEncrypted = bin2hex($iv) . ':' . $encrypted;
    $hash = hash('sha256', $plainKey);
    return ['encrypted' => $fullEncrypted, 'hash' => $hash];
}

/**
 * Decrypt digital product key
 */
function decrypt_key(string $fullEncrypted): ?string {
    $parts = explode(':', $fullEncrypted);
    if (count($parts) !== 2) {
        return null;
    }
    $iv = hex2bin($parts[0]);
    $encrypted = $parts[1];
    $decrypted = openssl_decrypt($encrypted, ENCRYPTION_CIPHER, ENCRYPTION_KEY, 0, $iv);
    return $decrypted !== false ? $decrypted : null;
}

/**
 * Flash messages helper
 */
function set_flash(string $type, string $message): void {
    $_SESSION['flash'] = [
        'type' => $type, // 'success', 'error', 'info', 'warning'
        'message' => $message
    ];
}

function get_flash(): ?array {
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
    }
    return null;
}

/**
 * CSRF Protection
 */
function csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_field(): string {
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars(csrf_token()) . '">';
}

function verify_csrf(?string $token): bool {
    if (!$token || empty($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Authentication Helpers
 */
function is_logged_in(): bool {
    return isset($_SESSION['user']) && !empty($_SESSION['user']['id']);
}

function current_user(): ?array {
    return $_SESSION['user'] ?? null;
}

function is_admin(): bool {
    return is_logged_in() && ($_SESSION['user']['role'] ?? '') === 'ADMIN';
}

function require_auth(): void {
    if (!is_logged_in()) {
        set_flash('warning', 'Faça login para continuar.');
        header('Location: ' . BASE_URL . '/login');
        exit;
    }
}

function require_admin(): void {
    require_auth();
    if (!is_admin()) {
        set_flash('error', 'Acesso negado. Esta área é restrita para administradores.');
        header('Location: ' . BASE_URL . '/');
        exit;
    }
}

/**
 * Helper to get clean sanitized input
 */
function input(string $key, $default = null) {
    if (isset($_POST[$key])) {
        return is_string($_POST[$key]) ? trim($_POST[$key]) : $_POST[$key];
    }
    if (isset($_GET[$key])) {
        return is_string($_GET[$key]) ? trim($_GET[$key]) : $_GET[$key];
    }
    return $default;
}

/**
 * URL Generator helper
 */
function url(string $path = ''): string {
    $cleanPath = '/' . ltrim($path, '/');
    return BASE_URL . $cleanPath;
}

/**
 * Asset URL helper
 */
function asset(string $path): string {
    return url('assets/' . ltrim($path, '/'));
}
