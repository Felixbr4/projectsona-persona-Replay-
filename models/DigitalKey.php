<?php
/**
 * ProjecSona - DigitalKey Model
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

class DigitalKey {
    public static function addKey(string $productId, string $rawKey): string {
        $db = Database::getConnection();
        $id = Database::uuid();
        $enc = encrypt_key(trim($rawKey));
        $stmt = $db->prepare("
            INSERT INTO digital_keys (id, product_id, code_encrypted, code_hash, status)
            VALUES (?, ?, ?, ?, 'AVAILABLE')
        ");
        $stmt->execute([$id, $productId, $enc['encrypted'], $enc['hash']]);
        return $id;
    }

    public static function all(): array {
        $db = Database::getConnection();
        return $db->query("
            SELECT dk.id, dk.product_id, dk.code_encrypted, dk.status, dk.sold_at, dk.viewed_at, dk.created_at,
                   p.name AS product_name, p.platform, g.name AS game_name,
                   o.order_number
            FROM digital_keys dk
            JOIN products p ON dk.product_id = p.id
            JOIN games g ON p.game_id = g.id
            LEFT JOIN order_items oi ON dk.order_item_id = oi.id
            LEFT JOIN orders o ON oi.order_id = o.id
            ORDER BY dk.created_at DESC
        ")->fetchAll();
    }

    public static function assignKeyToOrderItem(string $productId, string $orderItemId): ?string {
        $db = Database::getConnection();
        
        // Find an available key
        $stmt = $db->prepare("
            SELECT id, code_encrypted FROM digital_keys
            WHERE product_id = ? AND status = 'AVAILABLE'
            LIMIT 1
        ");
        $stmt->execute([$productId]);
        $key = $stmt->fetch();

        if (!$key) {
            return null;
        }

        // Mark as SOLD and link to order item
        $updateStmt = $db->prepare("
            UPDATE digital_keys
            SET status = 'SOLD', sold_at = CURRENT_TIMESTAMP, order_item_id = ?
            WHERE id = ?
        ");
        $updateStmt->execute([$orderItemId, $key['id']]);

        // Return decrypted key code
        return decrypt_key($key['code_encrypted']);
    }

    public static function getDecryptedCode(string $codeEncrypted): ?string {
        return decrypt_key($codeEncrypted);
    }
}
