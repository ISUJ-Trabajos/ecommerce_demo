const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller');
const verifyJWT = require('../../middleware/verifyJWT');

// Todas las rutas de órdenes requieren autenticación
router.use(verifyJWT);

// Fase 4: Checkout
router.post('/', ordersController.createOrder);

// Fase 5: Historial
router.get('/', ordersController.getUserOrders);
router.get('/:id', ordersController.getOrderById);

module.exports = router;
