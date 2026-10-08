<?php
/**
 * ProjecSona - ExternalOffer Model
 */

require_once __DIR__ . '/../config/database.php';

class ExternalOffer {
    public static function all(array $filters = []): array {
        $db = Database::getConnection();
        $sql = "
            SELECT eo.*, es.name AS store_name, es.reliability_status, es.logo_url,
                   g.name AS game_name, g.slug AS game_slug, g.theme AS game_theme,
                   p.name AS product_name, p.price AS projecsona_price, p.slug AS product_slug
            FROM external_offers eo
            JOIN external_stores es ON eo.store_id = es.id
            JOIN games g ON eo.game_id = g.id
            LEFT JOIN products p ON eo.product_id = p.id
            WHERE eo.active = 1
        ";
        $params = [];

        if (!empty($filters['game_id'])) {
            $sql .= " AND eo.game_id = ?";
            $params[] = $filters['game_id'];
        }

        if (!empty($filters['platform'])) {
            $sql .= " AND eo.platform = ?";
            $params[] = $filters['platform'];
        }

        $sql .= " ORDER BY eo.price ASC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function getStores(): array {
        $db = Database::getConnection();
        return $db->query("SELECT * FROM external_stores WHERE active = 1 ORDER BY name ASC")->fetchAll();
    }

    public static function create(array $data): string {
        $db = Database::getConnection();
        $id = Database::uuid();
        $stmt = $db->prepare("
            INSERT INTO external_offers (id, store_id, game_id, product_id, price, original_price, url, platform, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        ");
        $stmt->execute([
            $id,
            $data['store_id'],
            $data['game_id'],
            !empty($data['product_id']) ? $data['product_id'] : null,
            (float)$data['price'],
            !empty($data['original_price']) ? (float)$data['original_price'] : null,
            $data['url'],
            $data['platform'] ?? 'Steam'
        ]);
        return $id;
    }
}
