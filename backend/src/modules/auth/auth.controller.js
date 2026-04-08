const { body, validationResult } = require('express-validator');
const authService = require('./auth.service');

/**
 * Reglas de validación para registro
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

/**
 * Reglas de validación para login
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida'),
];

/**
 * POST /api/auth/register
 */
async function registerController(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      details: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }

  try {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user,
    });
  } catch (err) {
    if (err.code === 'EMAIL_DUPLICATE') {
      return res.status(409).json({
        error: 'EMAIL_DUPLICATE',
        message: err.message,
      });
    }
    console.error('Error en registro:', err);
    return res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Error interno del servidor',
    });
  }
}

/**
 * POST /api/auth/login
 */
async function loginController(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      details: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }

  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    return res.status(200).json(result);
  } catch (err) {
    if (err.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json({
        error: 'INVALID_CREDENTIALS',
        message: err.message,
      });
    }
    console.error('Error en login:', err);
    return res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Error interno del servidor',
    });
  }
}

module.exports = {
  registerValidation,
  loginValidation,
  registerController,
  loginController,
};
