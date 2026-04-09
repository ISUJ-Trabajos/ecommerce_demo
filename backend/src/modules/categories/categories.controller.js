const { pool } = require('../../config/db');

/**
 * GET /api/categories
 * Retorna todas las categorías del sistema.
 */
async function listCategories(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, slug FROM categories ORDER BY id'
    );

    return res.status(200).json({ categories: rows });
  } catch (err) {
    console.error('Error al listar categorías:', err);
    return res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Error interno del servidor',
    });
  }
}

module.exports = { listCategories };
