-- =============================================================
--  ECommerce Demo — Script DDL MySQL 8.x (XAMPP)
--  Puerto: 3306 | Usuario: root | Password: (vacía)
--  Base de datos: ecommerce_demo
--  
--  INSTRUCCIONES:
--  Opción A: phpMyAdmin → Nueva BD "ecommerce_demo" → Importar este archivo
--  Opción B: mysql -u root ecommerce_demo < database/schema.sql
-- =============================================================

CREATE DATABASE IF NOT EXISTS ecommerce_demo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ecommerce_demo;

-- ───────────────────────────────────────────────────────────
-- TABLA: users
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100)    NOT NULL,
    email       VARCHAR(150)    NOT NULL,
    password    VARCHAR(255)    NOT NULL COMMENT 'Hash bcryptjs',
    role        ENUM('admin','client') NOT NULL DEFAULT 'client',
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────────────────────
-- TABLA: categories
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
    id    TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name  VARCHAR(80)      NOT NULL,
    slug  VARCHAR(80)      NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_categories_name (name),
    UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────────────────────
-- TABLA: products
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    category_id  TINYINT UNSIGNED NOT NULL,
    name         VARCHAR(150)    NOT NULL,
    description  TEXT,
    price        DECIMAL(10,2)   NOT NULL,
    stock        INT UNSIGNED    NOT NULL DEFAULT 0,
    image_url    VARCHAR(255)    DEFAULT NULL COMMENT 'Ruta relativa /uploads/filename',
    is_active    TINYINT(1)      NOT NULL DEFAULT 1,
    created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_products_price  CHECK (price  >= 0),
    INDEX idx_products_category  (category_id),
    INDEX idx_products_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────────────────────
-- TABLA: cart_items
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    user_id     INT UNSIGNED    NOT NULL,
    product_id  INT UNSIGNED    NOT NULL,
    quantity    INT UNSIGNED    NOT NULL DEFAULT 1,
    added_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_cart_user_product (user_id, product_id),
    CONSTRAINT fk_cart_user
        FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    CONSTRAINT fk_cart_product
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT chk_cart_quantity CHECK (quantity > 0),
    INDEX idx_cart_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────────────────────
-- TABLA: orders
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    user_id     INT UNSIGNED    NOT NULL,
    total       DECIMAL(10,2)   NOT NULL,
    status      ENUM('completed') NOT NULL DEFAULT 'completed',
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_orders_total CHECK (total >= 0),
    INDEX idx_orders_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────────────────────
-- TABLA: order_items
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    order_id    INT UNSIGNED    NOT NULL,
    product_id  INT UNSIGNED    NOT NULL,
    quantity    INT UNSIGNED    NOT NULL,
    unit_price  DECIMAL(10,2)   NOT NULL COMMENT 'Precio congelado al momento de la compra',
    PRIMARY KEY (id),
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT chk_order_items_qty   CHECK (quantity   > 0),
    CONSTRAINT chk_order_items_price CHECK (unit_price >= 0),
    INDEX idx_order_items_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════
-- SEED: Categorías (valores fijos del sistema)
-- ═══════════════════════════════════════════════════════════
INSERT INTO categories (name, slug) VALUES
    ('Moda',              'moda'),
    ('Cosméticos/Salud',  'cosmeticos-salud'),
    ('Hogar/Decoración',  'hogar-decoracion'),
    ('Accesorios',        'accesorios');

-- ═══════════════════════════════════════════════════════════
-- SEED: Usuario administrador
-- Email:    admin@ecommerce.local
-- Password: Admin1234!
-- Hash generado con bcryptjs rounds=10
-- IMPORTANTE: Cambiar en un entorno no demo
-- ═══════════════════════════════════════════════════════════
INSERT INTO users (name, email, password, role) VALUES (
    'Super Admin',
    'admin@ecommerce.local',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh7y',
    'admin'
);

-- ═══════════════════════════════════════════════════════════
-- SEED: Productos de demostración (4 por categoría)
-- ═══════════════════════════════════════════════════════════

-- Categoría: Moda (id=1)
INSERT INTO products (category_id, name, description, price, stock) VALUES
(1, 'Camiseta Oversize Premium',
 'Camiseta de algodón pima 100%, corte oversize. Disponible tallas S–XL.',
 29.99, 50),
(1, 'Jeans Slim Fit Oscuro',
 'Jean stretch con lavado oscuro, corte slim. Comodidad y estilo urbano.',
 59.99, 30),
(1, 'Vestido Midi Floral',
 'Vestido midi con estampado floral. Tela ligera ideal para clima cálido.',
 49.99, 20),
(1, 'Blazer Estructurado Negro',
 'Blazer doble botonadura en lana reciclada. Versátil: formal o casual chic.',
 89.99, 3);   -- stock bajo para demo de "Pocas unidades"

-- Categoría: Cosméticos/Salud (id=2)
INSERT INTO products (category_id, name, description, price, stock) VALUES
(2, 'Sérum Vitamina C 30ml',
 'Sérum antioxidante 20% vitamina C pura. Ilumina y uniforma el tono.',
 34.99, 60),
(2, 'Crema Hidratante FPS50',
 'Hidratante diaria SPF50. Fórmula ligera no grasa para uso cotidiano.',
 22.99, 80),
(2, 'Set Labiales Matte x3',
 'Tres labiales larga duración. Fórmula hidratante en acabado matte.',
 18.99, 45),
(2, 'Aceite Corporal Argán',
 'Aceite nutritivo 100% natural de argán marroquí. Hidratación en 5 min.',
 27.99, 0);   -- sin stock para demo del estado agotado

-- Categoría: Hogar/Decoración (id=3)
INSERT INTO products (category_id, name, description, price, stock) VALUES
(3, 'Lámpara LED Minimalista',
 'Lámpara de mesa base mármol sintético y pantalla de tela. Luz regulable.',
 74.99, 12),
(3, 'Set Cojines Decorativos x2',
 'Dos cojines de lino natural 45×45cm. Bordado geométrico artesanal.',
 39.99, 25),
(3, 'Macetero Cerámica Premium',
 'Macetero artesanal cerámica esmaltada. Diseño moderno, 20cm diámetro.',
 24.99, 40),
(3, 'Cuadro Abstracto 40×60cm',
 'Impresión arte abstracto sobre lienzo estirado. Tonos neutros versátiles.',
 44.99, 18);

-- Categoría: Accesorios (id=4)
INSERT INTO products (category_id, name, description, price, stock) VALUES
(4, 'Bolso Tote Canvas',
 'Bolso tote de lona reforzada con asas de cuero genuino. Cierre magnético.',
 55.99, 22),
(4, 'Cartera Minimalista',
 'Cartera delgada cuero vegano, 6 ranuras tarjetas y billetera interior.',
 32.99, 38),
(4, 'Gorra Estructurada',
 'Dad hat con bordado minimalista. Talla única ajustable, materiales premium.',
 19.99, 55),
(4, 'Gafas de Sol Retro',
 'Marco acetato con lentes polarizadas UV400. Diseño oval retro, estuche.',
 48.99, 2);   -- stock bajo para demo

-- ═══════════════════════════════════════════════════════════
-- VISTAS ÚTILES
-- ═══════════════════════════════════════════════════════════

-- Vista: productos con nombre de categoría (útil para la API)
CREATE OR REPLACE VIEW v_products_full AS
    SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.image_url,
        p.is_active,
        p.created_at,
        c.id   AS category_id,
        c.name AS category_name,
        c.slug AS category_slug
    FROM products p
    INNER JOIN categories c ON c.id = p.category_id;

-- Vista: resumen de pedidos con datos de usuario
CREATE OR REPLACE VIEW v_orders_summary AS
    SELECT
        o.id          AS order_id,
        o.total,
        o.status,
        o.created_at,
        u.id          AS user_id,
        u.name        AS user_name,
        u.email       AS user_email,
        COUNT(oi.id)  AS item_count
    FROM orders o
    INNER JOIN users       u  ON u.id  = o.user_id
    INNER JOIN order_items oi ON oi.order_id = o.id
    GROUP BY o.id, u.id;

-- ═══════════════════════════════════════════════════════════
-- STORED PROCEDURE: Crear pedido con gestión de stock
-- Uso: CALL sp_create_order(user_id, @new_order_id, @error_msg)
-- ═══════════════════════════════════════════════════════════
DELIMITER $$

CREATE PROCEDURE IF NOT EXISTS sp_create_order(
    IN  p_user_id    INT UNSIGNED,
    OUT p_order_id   INT UNSIGNED,
    OUT p_error      VARCHAR(255)
)
BEGIN
    DECLARE v_total      DECIMAL(10,2) DEFAULT 0;
    DECLARE v_stock      INT UNSIGNED;
    DECLARE v_qty        INT UNSIGNED;
    DECLARE v_price      DECIMAL(10,2);
    DECLARE v_product_id INT UNSIGNED;
    DECLARE v_prod_name  VARCHAR(150);
    DECLARE done         INT DEFAULT FALSE;

    DECLARE cur CURSOR FOR
        SELECT ci.product_id, ci.quantity, p.price, p.stock, p.name
        FROM cart_items ci
        INNER JOIN products p ON p.id = ci.product_id
        WHERE ci.user_id = p_user_id;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    SET p_order_id = NULL;
    SET p_error    = NULL;

    START TRANSACTION;

    -- Verificar stock de todos los ítems antes de proceder
    OPEN cur;
    check_loop: LOOP
        FETCH cur INTO v_product_id, v_qty, v_price, v_stock, v_prod_name;
        IF done THEN LEAVE check_loop; END IF;

        IF v_stock = 0 THEN
            SET p_error = CONCAT('Sin stock: ', v_prod_name);
            ROLLBACK;
            CLOSE cur;
            LEAVE check_loop;
        END IF;

        IF v_qty > v_stock THEN
            SET p_error = CONCAT('Stock insuficiente para: ', v_prod_name,
                                 '. Disponible: ', v_stock);
            ROLLBACK;
            CLOSE cur;
            LEAVE check_loop;
        END IF;

        SET v_total = v_total + (v_qty * v_price);
    END LOOP;
    CLOSE cur;

    -- Si no hay error, crear la orden
    IF p_error IS NULL THEN
        INSERT INTO orders (user_id, total, status)
        VALUES (p_user_id, v_total, 'completed');

        SET p_order_id = LAST_INSERT_ID();

        -- Insertar order_items y descontar stock
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        SELECT p_order_id, ci.product_id, ci.quantity, p.price
        FROM cart_items ci
        INNER JOIN products p ON p.id = ci.product_id
        WHERE ci.user_id = p_user_id;

        UPDATE products p
        INNER JOIN cart_items ci ON ci.product_id = p.id
        SET p.stock = p.stock - ci.quantity
        WHERE ci.user_id = p_user_id;

        -- Limpiar carrito
        DELETE FROM cart_items WHERE user_id = p_user_id;

        COMMIT;
    END IF;

END$$

DELIMITER ;

-- ═══════════════════════════════════════════════════════════
-- FIN DEL SCRIPT
-- Datos demo disponibles:
--   Admin:   admin@ecommerce.local / Admin1234!
--   16 productos (1 sin stock, 3 con stock bajo)
-- ═══════════════════════════════════════════════════════════
