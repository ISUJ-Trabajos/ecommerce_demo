const router = require('express').Router();
const categoriesController = require('./categories.controller');

// GET /api/categories — Retorna todas las categorías del sistema
router.get('/', categoriesController.listCategories);

module.exports = router;
