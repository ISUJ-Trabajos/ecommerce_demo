const { pool } = require('../../config/db');

/**
 * Obtener items del carrito de un usuario
 */
async function getCartItems(userId) {
  const [rows] = await pool.query(`
    SELECT ci.id, ci.user_id, ci.product_id, ci.quantity, ci.added_at,
           p.name AS product_name, p.price, p.stock, p.image_url, p.is_active
    FROM cart_items ci
    INNER JOIN products p ON p.id = ci.product_id
    WHERE ci.user_id = ?
    ORDER BY ci.added_at ASC
  `, [userId]);
  return rows;
}

/**
 * Añadir o actualizar producto en el carrito validando stock.
 * Lanza un error de validación si excede el stock.
 */
async function addItem(userId, productId, quantityToAdd) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Obtener producto para verificar stock
    const [products] = await connection.query(
      'SELECT id, name, stock, is_active FROM products WHERE id = ? FOR UPDATE',
      [productId]
    );

    if (products.length === 0) {
      const err = new Error('Producto no encontrado');
      err.code = 'NOT_FOUND';
      throw err;
    }

    const product = products[0];

    if (!product.is_active) {
      const err = new Error('El producto no está activo');
      err.code = 'NOT_ACTIVE';
      throw err;
    }

    if (product.stock === 0) {
      const err = new Error('Producto sin stock disponible');
      err.code = 'OUT_OF_STOCK';
      throw err;
    }

    // Verificar si el item ya existe en el carrito
    const [existingItems] = await connection.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ? FOR UPDATE',
      [userId, productId]
    );

    const currentQty = existingItems.length > 0 ? existingItems[0].quantity : 0;
    const newQty = currentQty + quantityToAdd;

    if (newQty > product.stock) {
      const err = new Error(`Solo ${product.stock} unidades disponibles`);
      err.code = 'STOCK_EXCEEDED';
      err.available = product.stock;
      throw err;
    }

    let cartItemId;

    if (existingItems.length > 0) {
      // Actualizar cantidad
      cartItemId = existingItems[0].id;
      await connection.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQty, cartItemId]
      );
    } else {
      // Insertar nuevo item
      const [result] = await connection.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, newQty]
      );
      cartItemId = result.insertId;
    }

    await connection.commit();
    return await getCartItemById(cartItemId, connection);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Actualizar específicamente la cantidad de un item validando stock
 */
async function updateQuantity(cartItemId, userId, newQty) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [items] = await connection.query(
      'SELECT product_id, quantity FROM cart_items WHERE id = ? AND user_id = ? FOR UPDATE',
      [cartItemId, userId]
    );

    if (items.length === 0) {
      const err = new Error('Ítem del carrito no encontrado');
      err.code = 'NOT_FOUND';
      throw err;
    }

    const productId = items[0].product_id;

    const [products] = await connection.query(
      'SELECT stock FROM products WHERE id = ? FOR UPDATE',
      [productId]
    );

    const product = products[0];

    if (newQty > product.stock) {
      const err = new Error(`Solo ${product.stock} unidades disponibles`);
      err.code = 'STOCK_EXCEEDED';
      err.available = product.stock;
      throw err;
    }

    await connection.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [newQty, cartItemId]
    );

    await connection.commit();
    return await getCartItemById(cartItemId, connection);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Eliminar ítem del carrito
 */
async function removeItem(cartItemId, userId) {
  const [result] = await pool.query(
    'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
    [cartItemId, userId]
  );
  return result.affectedRows > 0;
}

/**
 * Helper para obtener un item insertado/actualizado (dentro o fuera de trx)
 */
async function getCartItemById(cartItemId, connection = pool) {
  const [rows] = await connection.query(`
    SELECT ci.id, ci.user_id, ci.product_id, ci.quantity, ci.added_at,
           p.name AS product_name, p.price, p.stock, p.image_url, p.is_active
    FROM cart_items ci
    INNER JOIN products p ON p.id = ci.product_id
    WHERE ci.id = ?
  `, [cartItemId]);
  return rows[0];
}

module.exports = {
  getCartItems,
  addItem,
  updateQuantity,
  removeItem
};
