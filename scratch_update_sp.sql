USE ecommerce_demo;
DROP PROCEDURE IF EXISTS sp_create_order;
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
        WHERE ci.user_id = p_user_id FOR UPDATE;

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
