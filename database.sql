-- ==============================================================================
-- Persona Replay - Database Schema
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `projecsona` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `projecsona`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `status` ENUM('ACTIVE', 'INACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
    `email_verified` DATETIME NULL,
    `image` VARCHAR(255) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Games Table
CREATE TABLE IF NOT EXISTS `games` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT NOT NULL,
    `story` TEXT NOT NULL,
    `image` VARCHAR(500) NOT NULL,
    `banner_image` VARCHAR(500) NULL,
    `theme` VARCHAR(50) NOT NULL DEFAULT 'persona5',
    `genre` VARCHAR(100) NOT NULL DEFAULT 'JRPG / Turn-based',
    `developer` VARCHAR(100) NOT NULL DEFAULT 'ATLUS / P-Studio',
    `release_date` VARCHAR(100) NOT NULL,
    `metacritic_score` INT DEFAULT 90,
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_games_slug` (`slug`),
    INDEX `idx_games_theme` (`theme`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Characters Table
CREATE TABLE IF NOT EXISTS `characters` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `game_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `role_tag` VARCHAR(100) NOT NULL DEFAULT 'Protagonist',
    `persona_name` VARCHAR(100) NULL,
    `arcana` VARCHAR(100) NULL DEFAULT 'The Fool',
    `description` TEXT NOT NULL,
    `image` VARCHAR(500) NOT NULL,
    `image_transformed` VARCHAR(500) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_characters_game_id` (`game_id`),
    CONSTRAINT `fk_characters_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Products Table
CREATE TABLE IF NOT EXISTS `products` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `game_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(150) NOT NULL UNIQUE,
    `description` TEXT NOT NULL,
    `edition` VARCHAR(100) NOT NULL DEFAULT 'Standard Edition',
    `price` DECIMAL(10,2) NOT NULL,
    `original_price` DECIMAL(10,2) NULL,
    `platform` VARCHAR(50) NOT NULL DEFAULT 'Steam',
    `stock_quantity` INT NOT NULL DEFAULT 0,
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
    `image` VARCHAR(500) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_products_game_id` (`game_id`),
    INDEX `idx_products_active` (`active`),
    INDEX `idx_products_platform` (`platform`),
    INDEX `idx_products_price` (`price`),
    CONSTRAINT `fk_products_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `order_number` VARCHAR(50) NOT NULL UNIQUE,
    `user_id` VARCHAR(36) NOT NULL,
    `total_amount` DECIMAL(10,2) NOT NULL,
    `status` ENUM('PENDING_PAYMENT', 'PAID', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING_PAYMENT',
    `notes` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_orders_user_id` (`user_id`),
    INDEX `idx_orders_status` (`status`),
    INDEX `idx_orders_created_at` (`created_at`),
    CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS `order_items` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `order_id` VARCHAR(36) NOT NULL,
    `product_id` VARCHAR(36) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `unit_price` DECIMAL(10,2) NOT NULL,
    `subtotal` DECIMAL(10,2) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_order_items_order_id` (`order_id`),
    INDEX `idx_order_items_product_id` (`product_id`),
    CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Digital Keys Table
CREATE TABLE IF NOT EXISTS `digital_keys` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `product_id` VARCHAR(36) NOT NULL,
    `code_encrypted` TEXT NOT NULL,
    `code_hash` VARCHAR(128) NOT NULL UNIQUE,
    `status` ENUM('AVAILABLE', 'RESERVED', 'SOLD', 'CANCELLED') NOT NULL DEFAULT 'AVAILABLE',
    `order_item_id` VARCHAR(36) NULL UNIQUE,
    `sold_at` DATETIME NULL,
    `viewed_at` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_digital_keys_product_id` (`product_id`),
    INDEX `idx_digital_keys_status` (`status`),
    CONSTRAINT `fk_digital_keys_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_digital_keys_order_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Payments Table
CREATE TABLE IF NOT EXISTS `payments` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `order_id` VARCHAR(36) NOT NULL UNIQUE,
    `method` VARCHAR(50) NOT NULL DEFAULT 'PIX',
    `status` ENUM('PENDING', 'APPROVED', 'DECLINED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `amount` DECIMAL(10,2) NOT NULL,
    `transaction_ref` VARCHAR(100) NULL,
    `paid_at` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_payments_order_id` (`order_id`),
    INDEX `idx_payments_status` (`status`),
    CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. External Stores Table
CREATE TABLE IF NOT EXISTS `external_stores` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `website` VARCHAR(255) NOT NULL,
    `logo_url` VARCHAR(500) NULL,
    `reliability_status` VARCHAR(50) NOT NULL DEFAULT 'VERIFIED',
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_external_stores_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. External Offers Table
CREATE TABLE IF NOT EXISTS `external_offers` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `store_id` VARCHAR(36) NOT NULL,
    `game_id` VARCHAR(36) NOT NULL,
    `product_id` VARCHAR(36) NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `original_price` DECIMAL(10,2) NULL,
    `url` VARCHAR(500) NOT NULL,
    `platform` VARCHAR(50) NOT NULL DEFAULT 'Steam',
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    `last_updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_external_offers_game_id` (`game_id`),
    INDEX `idx_external_offers_store_id` (`store_id`),
    INDEX `idx_external_offers_product_id` (`product_id`),
    INDEX `idx_external_offers_price` (`price`),
    CONSTRAINT `fk_external_offers_store` FOREIGN KEY (`store_id`) REFERENCES `external_stores` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_external_offers_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_external_offers_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
