<?php
/**
 * ProjecSona - Game Model
 */

require_once __DIR__ . '/../config/database.php';

class Game {
    public static function all(bool $onlyActive = true): array {
        $db = Database::getConnection();
        $sql = "SELECT * FROM games" . ($onlyActive ? " WHERE active = 1" : "") . " ORDER BY release_date DESC";
        return $db->query($sql)->fetchAll();
    }

    public static function findBySlug(string $slug): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM games WHERE slug = ? LIMIT 1");
        $stmt->execute([$slug]);
        $game = $stmt->fetch();
        return $game ?: null;
    }

    public static function findById(string $id): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM games WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $game = $stmt->fetch();
        return $game ?: null;
    }

    public static function getCharacters(string $gameId): array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM characters WHERE game_id = ? ORDER BY name ASC");
        $stmt->execute([$gameId]);
        return $stmt->fetchAll();
    }

    public static function getProducts(string $gameId): array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM products WHERE game_id = ? AND active = 1 ORDER BY price ASC");
        $stmt->execute([$gameId]);
        return $stmt->fetchAll();
    }

    public static function getExternalOffers(string $gameId): array {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            SELECT eo.*, es.name AS store_name, es.reliability_status, es.logo_url
            FROM external_offers eo
            JOIN external_stores es ON eo.store_id = es.id
            WHERE eo.game_id = ? AND eo.active = 1
            ORDER BY eo.price ASC
        ");
        $stmt->execute([$gameId]);
        return $stmt->fetchAll();
    }

    public static function create(array $data): string {
        $db = Database::getConnection();
        $id = Database::uuid();
        $stmt = $db->prepare("
            INSERT INTO games (id, name, slug, description, story, image, banner_image, theme, genre, developer, release_date, metacritic_score, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $id,
            $data['name'],
            $data['slug'],
            $data['description'],
            $data['story'],
            $data['image'],
            $data['banner_image'] ?? null,
            $data['theme'] ?? 'persona5',
            $data['genre'] ?? 'JRPG',
            $data['developer'] ?? 'ATLUS / P-Studio',
            $data['release_date'],
            $data['metacritic_score'] ?? 90,
            isset($data['active']) ? (int)$data['active'] : 1
        ]);
        return $id;
    }

    public static function update(string $id, array $data): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            UPDATE games
            SET name = ?, slug = ?, description = ?, story = ?, image = ?, banner_image = ?, theme = ?, genre = ?, developer = ?, release_date = ?, metacritic_score = ?, active = ?
            WHERE id = ?
        ");
        return $stmt->execute([
            $data['name'],
            $data['slug'],
            $data['description'],
            $data['story'],
            $data['image'],
            $data['banner_image'] ?? null,
            $data['theme'] ?? 'persona5',
            $data['genre'] ?? 'JRPG',
            $data['developer'] ?? 'ATLUS / P-Studio',
            $data['release_date'],
            $data['metacritic_score'] ?? 90,
            isset($data['active']) ? (int)$data['active'] : 1,
            $id
        ]);
    }
}
