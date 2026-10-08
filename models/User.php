<?php
/**
 * ProjecSona - User Model
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

class User {
    public static function findById(string $id): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT id, name, email, role, status, image, created_at FROM users WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public static function findByEmail(string $email): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([strtolower(trim($email))]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public static function create(string $name, string $email, string $password, string $role = 'USER'): string {
        $db = Database::getConnection();
        $id = Database::uuid();
        $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
        $stmt = $db->prepare("
            INSERT INTO users (id, name, email, password_hash, role, status, email_verified)
            VALUES (?, ?, ?, ?, ?, 'ACTIVE', CURRENT_TIMESTAMP)
        ");
        $stmt->execute([$id, trim($name), strtolower(trim($email)), $hash, $role]);
        return $id;
    }

    public static function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }

    public static function all(): array {
        $db = Database::getConnection();
        return $db->query("SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC")->fetchAll();
    }

    public static function updateStatus(string $userId, string $status): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE users SET status = ? WHERE id = ?");
        return $stmt->execute([$status, $userId]);
    }
}
