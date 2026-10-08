<?php
/**
 * ProjecSona - Order Model
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/DigitalKey.php';

class Order {
    public static function createOrder(string $userId, array $cartItems, string $paymentMethod = 'PIX'): ?array {
        $db = Database::getConnection();
        
        try {
            $db->beginTransaction();

            $orderId = Database::uuid();
            $orderNumber = 'ORD-' . strtoupper(substr(uniqid(), -6)) . '-' . rand(100, 999);
            
            $totalAmount = 0.0;
            $itemsToInsert = [];

            foreach ($cartItems as $item) {
                $subtotal = $item['price'] * $item['quantity'];
                $totalAmount += $subtotal;
                $itemsToInsert[] = [
                    'id' => Database::uuid(),
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'subtotal' => $subtotal
                ];
            }

            // 1. Insert Order
            $stmtOrder = $db->prepare("
                INSERT INTO orders (id, order_number, user_id, total_amount, status, created_at)
                VALUES (?, ?, ?, ?, 'COMPLETED', CURRENT_TIMESTAMP)
            ");
            $stmtOrder->execute([$orderId, $orderNumber, $userId, $totalAmount]);

            // 2. Insert Items & Allocate Digital Keys
            $stmtItem = $db->prepare("
                INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal, created_at)
                VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ");

            foreach ($itemsToInsert as $item) {
                $stmtItem->execute([$item['id'], $orderId, $item['product_id'], $item['quantity'], $item['unit_price'], $item['subtotal']]);
                
                // Assign keys for each quantity count
                for ($q = 0; $q < $item['quantity']; $q++) {
                    DigitalKey::assignKeyToOrderItem($item['product_id'], $item['id']);
                }
            }

            // 3. Insert Payment Record
            $paymentId = Database::uuid();
            $stmtPayment = $db->prepare("
                INSERT INTO payments (id, order_id, method, status, amount, transaction_ref, paid_at, created_at)
                VALUES (?, ?, ?, 'APPROVED', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ");
            $txRef = 'PAY-' . strtoupper(bin2hex(random_bytes(6)));
            $stmtPayment->execute([$paymentId, $orderId, $paymentMethod, $totalAmount, $txRef]);

            $db->commit();

            return [
                'order_id' => $orderId,
                'order_number' => $orderNumber,
                'total_amount' => $totalAmount,
                'transaction_ref' => $txRef
            ];
        } catch (Exception $e) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            error_log("Erro ao criar pedido: " . $e->getMessage());
            return null;
        }
    }

    public static function getUserOrders(string $userId): array {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            SELECT o.*, p.method AS payment_method, p.status AS payment_status,
                   COUNT(oi.id) AS total_items
            FROM orders o
            LEFT JOIN payments p ON o.id = p.order_id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
        ");
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public static function getOrderDetail(string $orderId, ?string $userId = null): ?array {
        $db = Database::getConnection();
        $sql = "
            SELECT o.*, u.name AS user_name, u.email AS user_email,
                   p.method AS payment_method, p.status AS payment_status, p.paid_at, p.transaction_ref
            FROM orders o
            JOIN users u ON o.user_id = u.id
            LEFT JOIN payments p ON o.id = p.order_id
            WHERE o.id = ?
        ";
        $params = [$orderId];

        if ($userId !== null) {
            $sql .= " AND o.user_id = ?";
            $params[] = $userId;
        }

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $order = $stmt->fetch();

        if (!$order) {
            return null;
        }

        // Fetch items with linked digital keys
        $stmtItems = $db->prepare("
            SELECT oi.*, pr.name AS product_name, pr.slug AS product_slug, pr.image AS product_image, pr.platform,
                   g.name AS game_name, g.theme AS game_theme,
                   dk.code_encrypted, dk.id AS digital_key_id
            FROM order_items oi
            JOIN products pr ON oi.product_id = pr.id
            JOIN games g ON pr.game_id = g.id
            LEFT JOIN digital_keys dk ON dk.order_item_id = oi.id
            WHERE oi.order_id = ?
        ");
        $stmtItems->execute([$orderId]);
        $items = $stmtItems->fetchAll();

        foreach ($items as &$it) {
            if (!empty($it['code_encrypted'])) {
                $it['decrypted_key'] = decrypt_key($it['code_encrypted']);
            } else {
                $it['decrypted_key'] = null;
            }
        }

        $order['items'] = $items;
        return $order;
    }

    public static function all(): array {
        $db = Database::getConnection();
        return $db->query("
            SELECT o.*, u.name AS user_name, u.email AS user_email,
                   p.method AS payment_method, p.status AS payment_status
            FROM orders o
            JOIN users u ON o.user_id = u.id
            LEFT JOIN payments p ON o.id = p.order_id
            ORDER BY o.created_at DESC
        ")->fetchAll();
    }
}
