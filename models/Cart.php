<?php
/**
 * ProjecSona - Cart Model & Session Manager
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Product.php';

class Cart {
    public static function getItems(): array {
        if (!isset($_SESSION['cart']) || !is_array($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }

        $items = [];
        foreach ($_SESSION['cart'] as $productId => $qty) {
            $prod = Product::findById($productId);
            if ($prod) {
                $stock = Product::getAvailableStock($productId);
                $items[] = [
                    'product_id' => $prod['id'],
                    'name' => $prod['name'],
                    'slug' => $prod['slug'],
                    'price' => (float)$prod['price'],
                    'original_price' => $prod['original_price'] ? (float)$prod['original_price'] : null,
                    'image' => $prod['image'],
                    'platform' => $prod['platform'],
                    'edition' => $prod['edition'],
                    'game_name' => $prod['game_name'],
                    'game_theme' => $prod['game_theme'],
                    'quantity' => min($qty, max(1, $stock)),
                    'stock' => $stock,
                    'subtotal' => (float)$prod['price'] * $qty
                ];
            }
        }
        return $items;
    }

    public static function add(string $productId, int $quantity = 1): bool {
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }

        $stock = Product::getAvailableStock($productId);
        if ($stock <= 0) {
            return false;
        }

        $currentQty = $_SESSION['cart'][$productId] ?? 0;
        $newQty = min($stock, $currentQty + $quantity);
        $_SESSION['cart'][$productId] = max(1, $newQty);

        return true;
    }

    public static function update(string $productId, int $quantity): void {
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }

        if ($quantity <= 0) {
            self::remove($productId);
            return;
        }

        $stock = Product::getAvailableStock($productId);
        $_SESSION['cart'][$productId] = min(max(1, $quantity), max(1, $stock));
    }

    public static function remove(string $productId): void {
        if (isset($_SESSION['cart'][$productId])) {
            unset($_SESSION['cart'][$productId]);
        }
    }

    public static function clear(): void {
        $_SESSION['cart'] = [];
    }

    public static function count(): int {
        if (!isset($_SESSION['cart']) || !is_array($_SESSION['cart'])) {
            return 0;
        }
        return array_sum($_SESSION['cart']);
    }

    public static function total(): float {
        $items = self::getItems();
        $total = 0.0;
        foreach ($items as $item) {
            $total += $item['subtotal'];
        }
        return $total;
    }
}
