<?php
/**
 * ProjecSona - Set Active Theme API
 */

require_once __DIR__ . '/../config/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $theme = $_POST['theme'] ?? 'persona5';
    $validThemes = ['persona3', 'persona4', 'persona5', 'velvet'];
    if (in_array($theme, $validThemes)) {
        $_SESSION['theme'] = $theme;
        echo json_encode(['success' => true, 'theme' => $theme]);
        exit;
    }
}

echo json_encode(['success' => false]);
