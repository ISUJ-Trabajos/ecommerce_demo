const jwt = require('jsonwebtoken');

/**
 * Middleware: Verifica el token JWT en el header Authorization.
 * Formato esperado: "Bearer <token>"
 * Si es válido, adjunta el payload decodificado a req.user.
 */
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Token de autenticación no proporcionado',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'TOKEN_EXPIRED',
        message: 'El token ha expirado. Inicia sesión nuevamente.',
      });
    }
    return res.status(401).json({
      error: 'INVALID_TOKEN',
      message: 'Token inválido',
    });
  }
};

module.exports = { verifyJWT };
