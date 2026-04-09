const express = require('express');
const { body } = require('express-validator');
const cartController = require('./cart.controller');
const { verifyJWT } = require('../../middleware/verifyJWT');

const router = express.Router();

// Validaciones
const validateAddToCart = [
  body('product_id').isInt({ min: 1 }).withMessage('ID de producto inválido'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Cantidad debe ser mayor a 0')
];

const validateUpdateQty = [
  body('quantity').isInt({ min: 1 }).withMessage('Cantidad debe ser mayor a 0')
];

// Rutas de Carrito (protegidas)
router.use(verifyJWT);

router.get('/', cartController.getCart);
router.post('/', validateAddToCart, cartController.addToCart);
router.patch('/:id', validateUpdateQty, cartController.updateQuantity);
router.delete('/:id', cartController.removeFromCart);

module.exports = router;
