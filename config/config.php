<?php
/**
 * Persona Replay - Configuration File
 */

// Error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Session initialization
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// App Settings (Persona Replay)
define('APP_NAME', 'Persona Replay');
define('APP_TAGLINE', 'A Loja Definitiva da Franquia Persona');
define('APP_VERSION', '2.0.0');

// Database Configuration (Default XAMPP credentials)
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'projecsona');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');
define('DB_CHARSET', 'utf8mb4');

// Cryptography & Secrets
define('APP_SECRET', 'persona-secret-key-personareplay-2026-32bytes!');
define('ENCRYPTION_KEY', hash('sha256', APP_SECRET, true));
define('ENCRYPTION_CIPHER', 'aes-256-cbc');

// Base URL calculation
$scriptName = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
$baseUrl = rtrim($scriptName, '/');
if (empty($baseUrl)) {
    $baseUrl = '';
}
define('BASE_URL', $baseUrl);

// Current Theme (Persona 3, Persona 4, Persona 5, Velvet default)
if (!isset($_SESSION['theme'])) {
    $_SESSION['theme'] = 'persona5';
}

// Timezone
date_default_timezone_set('America/Sao_Paulo');
