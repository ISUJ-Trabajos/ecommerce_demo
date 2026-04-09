const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// ─── Middlewares globales ──────────────────────────────────
app.use(cors({ origin: '*' }));                       // CORS abierto para dev local
app.use(express.json());                               // Parse JSON body
app.use(express.urlencoded({ extended: true }));       // Parse URL-encoded body

// ─── Archivos estáticos (imágenes de productos) ───────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ─── Rutas de la API ──────────────────────────────────────
// Se registran conforme se implementa cada módulo
app.use('/api/auth',       require('./modules/auth/auth.routes'));
app.use('/api/categories', require('./modules/categories/categories.routes'));
app.use('/api/products',   require('./modules/products/products.routes'));
app.use('/api/cart',       require('./modules/cart/cart.routes'));
// app.use('/api/orders',     require('./modules/orders/orders.routes'));

// ─── Ruta de health check ─────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Manejo de errores global ─────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Error no manejado:', err.stack);
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'Error interno del servidor',
  });
});

module.exports = app;
