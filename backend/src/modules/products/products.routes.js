const router = require('express').Router();
const { verifyJWT } = require('../../middleware/verifyJWT');
const productsController = require('./products.controller');

// GET /api/products — Listado de productos activos (requiere JWT)
router.get(
  '/',
  verifyJWT,
  productsController.listValidation,
  productsController.listProducts
);

// GET /api/products/:id — Detalle de un producto (requiere JWT)
router.get(
  '/:id',
  verifyJWT,
  productsController.detailValidation,
  productsController.getProduct
);

module.exports = router;
