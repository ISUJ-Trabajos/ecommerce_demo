const db = require('../../config/db');

async function checkout(userId) {
  const connection = await db.pool.getConnection();
  try {
    // Llamar al Stored Procedure
    // CALL sp_create_order(p_user_id, @new_order_id, @error_msg)
    await connection.query('CALL sp_create_order(?, @new_order_id, @error_msg)', [userId]);
    
    // Obtener los resultados de las variables OUT
    const [rows] = await connection.query('SELECT @new_order_id AS order_id, @error_msg AS error_msg');
    const result = rows[0];

    if (result.error_msg) {
      if (result.error_msg.includes('Stock insuficiente') || result.error_msg.includes('Sin stock')) {
        const error = new Error(result.error_msg);
        error.code = 'OUT_OF_STOCK';
        throw error;
      }
      throw new Error(result.error_msg);
    }

    if (!result.order_id) {
        throw new Error("No se pudo crear la orden.");
    }

    return { orderId: result.order_id, message: 'Pedido creado exitosamente' };
  } finally {
    connection.release();
  }
}

async function getOrders(userId) {
  // Utilizamos la vista v_orders_summary creada en la bd
  const [rows] = await db.pool.query(
    'SELECT * FROM v_orders_summary WHERE user_id = ? ORDER BY created_at DESC', 
    [userId]
  );
  return rows;
}

async function getOrderDetails(orderId, userId) {
  // Obtener detalle de la orden validando que corresponda al usuario
  const [orderRows] = await db.pool.query(
    'SELECT * FROM orders WHERE id = ? AND user_id = ?',
    [orderId, userId]
  );

  if (orderRows.length === 0) {
    return null; // Orden no existe o no es del usuario
  }

  const order = orderRows[0];

  // Obtener los ítems de la orden (unit_price es el precio histórico guardado)
  const [itemRows] = await db.pool.query(`
    SELECT oi.id, oi.product_id, oi.quantity, oi.unit_price, p.name, p.image_url
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ?
  `, [orderId]);

  order.items = itemRows;
  
  return order;
}

module.exports = {
  checkout,
  getOrders,
  getOrderDetails
};
