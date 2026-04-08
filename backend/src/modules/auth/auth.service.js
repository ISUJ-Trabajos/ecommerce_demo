const { pool } = require('../../config/db');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

const SALT_ROUNDS = 10;

/**
 * Registra un nuevo usuario con rol 'client'.
 * @param {string} name
 * @param {string} email
 * @param {string} password - texto plano, se hashea con bcryptjs
 * @returns {{ id, name, email, role }}
 */
async function register(name, email, password) {
  // Verificar si el email ya existe
  const [existing] = await pool.query(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existing.length > 0) {
    const error = new Error('El email ya está registrado');
    error.code = 'EMAIL_DUPLICATE';
    error.status = 409;
    throw error;
  }

  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Insertar usuario
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, 'client']
  );

  return {
    id:    result.insertId,
    name,
    email,
    role:  'client',
  };
}

/**
 * Autentica un usuario y retorna un JWT.
 * @param {string} email
 * @param {string} password - texto plano
 * @returns {{ token, user: { id, name, email, role } }}
 */
async function login(email, password) {
  // Buscar usuario por email
  const [rows] = await pool.query(
    'SELECT id, name, email, password, role FROM users WHERE email = ?',
    [email]
  );

  if (rows.length === 0) {
    const error = new Error('Credenciales incorrectas');
    error.code = 'INVALID_CREDENTIALS';
    error.status = 401;
    throw error;
  }

  const user = rows[0];

  // Comparar contraseña
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Credenciales incorrectas');
    error.code = 'INVALID_CREDENTIALS';
    error.status = 401;
    throw error;
  }

  // Generar JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return {
    token,
    user: {
      id:    user.id,
      name:  user.name,
      email: user.email,
      role:  user.role,
    },
  };
}

module.exports = { register, login };
