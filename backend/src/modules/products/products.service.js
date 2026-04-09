const { pool } = require('../../config/db');

/**
 * Retorna productos activos, opcionalmente filtrados por categoría.
 * Usa la vista v_products_full para incluir datos de categoría.
 * @param {string|null} categorySlug - Slug de categoría para filtrar (opcional)
 * @returns {Array} Lista de productos activos
 */
async function findAll(categorySlug = null) {
  let query = `
    SELECT id, name, description, price, stock, image_url, is_active,
           category_id, category_name, category_slug, created_at
    FROM v_products_full
    WHERE is_active = 1
  `;
  const params = [];

  if (categorySlug) {
    query += ' AND category_slug = ?';
    params.push(categorySlug);
  }

  query += ' ORDER BY created_at DESC';

  const [rows] = await pool.query(query, params);
  return rows;
}

/**
 * Retorna un producto por ID con datos completos (incluye stock).
 * Solo retorna productos activos para el catálogo público.
 * @param {number} id - ID del producto
 * @returns {Object|null} Producto o null si no existe/no está activo
 */
async function findById(id) {
  const [rows] = await pool.query(
    `SELECT id, name, description, price, stock, image_url, is_active,
            category_id, category_name, category_slug, created_at
     FROM v_products_full
     WHERE id = ? AND is_active = 1`,
    [id]
  );

  return rows.length > 0 ? rows[0] : null;
}

module.exports = { findAll, findById };
