/**
 * Middleware: Verifica que el usuario autenticado tenga rol 'admin'.
 * Debe usarse DESPUÉS de verifyJWT (requiere req.user).
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Autenticación requerida',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'FORBIDDEN',
      message: 'Se requieren permisos de administrador',
    });
  }

  next();
};

module.exports = { isAdmin };
