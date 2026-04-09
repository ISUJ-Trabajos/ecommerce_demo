const { validationResult } = require('express-validator');
const cartService = require('./cart.service');

async function getCart(req, res, next) {
  try {
    const userId = req.user.id;
    const items = await cartService.getCartItems(userId);
    res.json(items);
  } catch (error) {
    next(error);
  }
}

async function addToCart(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    const item = await cartService.addItem(userId, product_id, quantity || 1);
    res.status(201).json(item);
  } catch (error) {
    if (error.code === 'OUT_OF_STOCK' || error.code === 'STOCK_EXCEEDED' || error.code === 'NOT_ACTIVE') {
      return res.status(409).json({ error: error.code, message: error.message, available: error.available });
    }
    if (error.code === 'NOT_FOUND') {
      return res.status(404).json({ error: error.code, message: error.message });
    }
    next(error);
  }
}

async function updateQuantity(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const cartItemId = parseInt(req.params.id, 10);
    const { quantity } = req.body;

    const item = await cartService.updateQuantity(cartItemId, userId, quantity);
    res.json(item);
  } catch (error) {
    if (error.code === 'OUT_OF_STOCK' || error.code === 'STOCK_EXCEEDED') {
      return res.status(409).json({ error: error.code, message: error.message, available: error.available });
    }
    if (error.code === 'NOT_FOUND') {
      return res.status(404).json({ error: error.code, message: error.message });
    }
    next(error);
  }
}

async function removeFromCart(req, res, next) {
  try {
    const userId = req.user.id;
    const cartItemId = parseInt(req.params.id, 10);

    const deleted = await cartService.removeItem(cartItemId, userId);
    if (!deleted) {
      return res.status(404).json({ message: 'Ítem no encontrado en su carrito' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart
};
