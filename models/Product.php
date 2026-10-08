<?php
/**
 * ProjecSona - Product Model
 */

require_once __DIR__ . '/../config/database.php';

class Product {
    public static function all(array $filters = []): array {
        $db = Database::getConnection();
        $sql = "
            SELECT p.*, g.name AS game_name, g.slug AS game_slug, g.theme AS game_theme,
                   (SELECT COUNT(*) FROM digital_keys dk WHERE dk.product_id = p.id AND dk.status = 'AVAILABLE') AS available_keys
            FROM products p
            JOIN games g ON p.game_id = g.id
            WHERE 1=1
        ";
        $params = [];

        if (!empty($filters['game_id'])) {
            $sql .= " AND p.game_id = ?";
            $params[] = $filters['game_id'];
        }
        if (!empty($filters['game_slug'])) {
            $sql .= " AND g.slug = ?";
            $params[] = $filters['game_slug'];
        }
        if (!empty($filters['platform'])) {
            $sql .= " AND p.platform = ?";
            $params[] = $filters['platform'];
        }
        if (!empty($filters['is_featured'])) {
            $sql .= " AND p.is_featured = 1";
        }
        if (isset($filters['active'])) {
            $sql .= " AND p.active = ?";
            $params[] = (int)$filters['active'];
        } else {
            $sql .= " AND p.active = 1";
        }
        if (!empty($filters['search'])) {
            $sql .= " AND (p.name LIKE ? OR p.description LIKE ? OR g.name LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'featured';
        switch ($sortBy) {
            case 'price_asc':
                $sql .= " ORDER BY p.price ASC";
                break;
            case 'price_desc':
                $sql .= " ORDER BY p.price DESC";
                break;
            case 'discount':
                $sql .= " ORDER BY (COALESCE(p.original_price, p.price) - p.price) DESC, p.is_featured DESC";
                break;
            case 'name_asc':
                $sql .= " ORDER BY p.name ASC";
                break;
            case 'featured':
            default:
                $sql .= " ORDER BY p.is_featured DESC, p.created_at DESC";
                break;
        }

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function findBySlug(string $slug): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            SELECT p.*, g.name AS game_name, g.slug AS game_slug, g.theme AS game_theme, g.description AS game_description,
                   (SELECT COUNT(*) FROM digital_keys dk WHERE dk.product_id = p.id AND dk.status = 'AVAILABLE') AS available_keys
            FROM products p
            JOIN games g ON p.game_id = g.id
            WHERE p.slug = ?
            LIMIT 1
        ");
        $stmt->execute([$slug]);
        $prod = $stmt->fetch();
        return $prod ?: null;
    }

    public static function findById(string $id): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            SELECT p.*, g.name AS game_name, g.slug AS game_slug, g.theme AS game_theme,
                   (SELECT COUNT(*) FROM digital_keys dk WHERE dk.product_id = p.id AND dk.status = 'AVAILABLE') AS available_keys
            FROM products p
            JOIN games g ON p.game_id = g.id
            WHERE p.id = ?
            LIMIT 1
        ");
        $stmt->execute([$id]);
        $prod = $stmt->fetch();
        return $prod ?: null;
    }

    public static function getAvailableStock(string $productId): int {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT COUNT(*) FROM digital_keys WHERE product_id = ? AND status = 'AVAILABLE'");
        $stmt->execute([$productId]);
        return (int) $stmt->fetchColumn();
    }

    public static function create(array $data): string {
        $db = Database::getConnection();
        $id = Database::uuid();
        $stmt = $db->prepare("
            INSERT INTO products (id, game_id, name, slug, description, edition, price, original_price, platform, stock_quantity, active, is_featured, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $id,
            $data['game_id'],
            $data['name'],
            $data['slug'],
            $data['description'],
            $data['edition'] ?? 'Standard Edition',
            (float) $data['price'],
            !empty($data['original_price']) ? (float) $data['original_price'] : null,
            $data['platform'] ?? 'Steam',
            (int) ($data['stock_quantity'] ?? 0),
            isset($data['active']) ? (int)$data['active'] : 1,
            isset($data['is_featured']) ? (int)$data['is_featured'] : 0,
            $data['image'] ?? null
        ]);
        return $id;
    }

    public static function update(string $id, array $data): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            UPDATE products
            SET game_id = ?, name = ?, slug = ?, description = ?, edition = ?, price = ?, original_price = ?, platform = ?, active = ?, is_featured = ?, image = ?
            WHERE id = ?
        ");
        return $stmt->execute([
            $data['game_id'],
            $data['name'],
            $data['slug'],
            $data['description'],
            $data['edition'] ?? 'Standard Edition',
            (float) $data['price'],
            !empty($data['original_price']) ? (float) $data['original_price'] : null,
            $data['platform'] ?? 'Steam',
            isset($data['active']) ? (int)$data['active'] : 1,
            isset($data['is_featured']) ? (int)$data['is_featured'] : 0,
            $data['image'] ?? null,
            $id
        ]);
    }
}
