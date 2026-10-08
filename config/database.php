<?php
/**
 * ProjecSona - Database Connection Handler (PDO MySQL & SQLite Hybrid with Auto-Healing)
 */

require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $instance = null;
    private static string $driver = 'mysql';

    public static function getConnection(): PDO {
        if (self::$instance !== null) {
            return self::$instance;
        }

        // 1. Try MySQL First (XAMPP standard)
        try {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            self::$driver = 'mysql';

            // Ensure tables exist in MySQL
            self::ensureTablesExist(self::$instance, 'mysql');

            return self::$instance;
        } catch (PDOException $e) {
            // If DB doesn't exist (1049) -> create database and initialize
            if ($e->getCode() == 1049) {
                try {
                    $dsnNoDb = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=" . DB_CHARSET;
                    $pdoNoDb = new PDO($dsnNoDb, DB_USER, DB_PASS);
                    $pdoNoDb->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                    
                    self::$instance = new PDO(
                        "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
                        DB_USER,
                        DB_PASS,
                        [
                            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                        ]
                    );
                    self::$driver = 'mysql';
                    self::ensureTablesExist(self::$instance, 'mysql');
                    return self::$instance;
                } catch (Exception $ex) {
                    // Fallthrough to SQLite
                }
            }

            // 2. Fallback to SQLite if MySQL is offline or refused
            $sqlitePath = __DIR__ . '/../database.sqlite';
            try {
                $dsnSqlite = "sqlite:" . $sqlitePath;
                self::$instance = new PDO($dsnSqlite, null, null, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]);
                self::$driver = 'sqlite';
                self::$instance->exec("PRAGMA foreign_keys = ON;");
                self::ensureTablesExist(self::$instance, 'sqlite');
                return self::$instance;
            } catch (Exception $sqliteEx) {
                die("<h3>Erro de Conexão com o Banco de Dados</h3><p>" . htmlspecialchars($sqliteEx->getMessage()) . "</p>");
            }
        }
    }

    private static function ensureTablesExist(PDO $pdo, string $driver): void {
        try {
            $test = $pdo->query("SELECT 1 FROM games LIMIT 1");
        } catch (Exception $e) {
            // Table doesn't exist -> execute schema and seed automatically
            $sqlFile = __DIR__ . '/../database.sql';
            if ($driver === 'mysql' && file_exists($sqlFile)) {
                $sql = file_get_contents($sqlFile);
                $statements = array_filter(array_map('trim', explode(';', $sql)));
                foreach ($statements as $stmt) {
                    if (!empty($stmt)) {
                        $pdo->exec($stmt);
                    }
                }
            }
        }
    }

    public static function getDriver(): string {
        return self::$driver;
    }

    public static function uuid(): string {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
