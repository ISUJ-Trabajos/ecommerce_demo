const ordersService = require('./orders.service');

async function createOrder(req, res, next) {
  try {
    const userId = req.user.id;
    // Checkout service maneja la creación invocando el SP de BD
    const result = await ordersService.checkout(userId);
    res.status(201).json(result);
  } catch (error) {
    if (error.code === 'OUT_OF_STOCK') {
      return res.status(409).json({ error: error.code, message: error.message });
    }
    next(error);
  }
}

async function getUserOrders(req, res, next) {
  try {
    const userId = req.user.id;
    const orders = await ordersService.getOrders(userId);
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

async function getOrderById(req, res, next) {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.id, 10);
    
    if (isNaN(orderId)) {
        return res.status(400).json({ message: "ID de orden inválido" });
    }

    const orderDetails = await ordersService.getOrderDetails(orderId, userId);
    
    if (!orderDetails) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    
    res.json(orderDetails);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById
};
