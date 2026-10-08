<?php
/**
 * ProjecSona - Character Model
 */

require_once __DIR__ . '/../config/database.php';

class Character {
    public static function getByGameId(string $gameId): array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM characters WHERE game_id = ? ORDER BY name ASC");
        $stmt->execute([$gameId]);
        return $stmt->fetchAll();
    }

    public static function all(): array {
        $db = Database::getConnection();
        return $db->query("
            SELECT c.*, g.name AS game_name, g.slug AS game_slug, g.theme AS game_theme
            FROM characters c
            JOIN games g ON c.game_id = g.id
            ORDER BY c.name ASC
        ")->fetchAll();
    }

    public static function findById(string $id): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM characters WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $char = $stmt->fetch();
        return $char ?: null;
    }
}
