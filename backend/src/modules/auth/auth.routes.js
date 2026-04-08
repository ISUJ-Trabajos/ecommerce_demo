const { Router } = require('express');
const {
  registerValidation,
  loginValidation,
  registerController,
  loginController,
} = require('./auth.controller');

const router = Router();

// POST /api/auth/register
router.post('/register', registerValidation, registerController);

// POST /api/auth/login
router.post('/login', loginValidation, loginController);

module.exports = router;
