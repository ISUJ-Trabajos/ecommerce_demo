const { param, query, validationResult } = require('express-validator');
const productsService = require('./products.service');

/**
 * Validación para el parámetro category (query string)
 */
const listValidation = [
  query('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 80 }).withMessage('Categoría inválida'),
];

/**
 * Validación para el parámetro :id
 */
const detailValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de producto inválido'),
];

/**
 * GET /api/products
 * GET /api/products?category=moda
 * Retorna productos activos, opcionalmente filtrados por categoría.
 */
async function listProducts(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      details: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }

  try {
    const categorySlug = req.query.category || null;
    const products = await productsService.findAll(categorySlug);

    return res.status(200).json({ products });
  } catch (err) {
    console.error('Error al listar productos:', err);
    return res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Error interno del servidor',
    });
  }
}

/**
 * GET /api/products/:id
 * Retorna el detalle de un producto activo con stock actual.
 */
async function getProduct(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      details: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }

  try {
    const product = await productsService.findById(parseInt(req.params.id));

    if (!product) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Producto no encontrado',
      });
    }

    return res.status(200).json({ product });
  } catch (err) {
    console.error('Error al obtener producto:', err);
    return res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Error interno del servidor',
    });
  }
}

module.exports = {
  listValidation,
  detailValidation,
  listProducts,
  getProduct,
};
