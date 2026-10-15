<?php
/**
 * Persona Replay - Set Active Game Theme & Independent Velvet Color Mode API
 */

require_once __DIR__ . '/../config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Independent Velvet Palette Toggle
    if (isset($_POST['velvet'])) {
        $velvetState = filter_var($_POST['velvet'], FILTER_VALIDATE_BOOLEAN);
        $_SESSION['velvet_mode'] = $velvetState;
        setcookie('persona_velvet', $velvetState ? '1' : '0', time() + (86400 * 30), '/');
        echo json_encode(['success' => true, 'velvet_mode' => $velvetState]);
        exit;
    }

    // 2. Game Theme Selection
    $theme = $_POST['theme'] ?? null;
    $validThemes = ['persona3', 'persona4', 'persona5'];
    if ($theme && in_array($theme, $validThemes)) {
        $_SESSION['theme'] = $theme;
        echo json_encode(['success' => true, 'theme' => $theme]);
        exit;
    }
}

echo json_encode(['success' => false]);
