const jwt = require('jsonwebtoken');
const { verifyJWT } = require('../../src/middleware/verifyJWT');

// Mock process.env
process.env.JWT_SECRET = 'test-secret';

// Helpers para crear req/res mock
const mockRequest = (authHeader) => ({
  headers: { authorization: authHeader },
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('verifyJWT middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe rechazar request sin header Authorization', () => {
    const req = { headers: {} };
    const res = mockResponse();

    verifyJWT(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'UNAUTHORIZED' })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('debe rechazar request con Authorization sin prefijo Bearer', () => {
    const req = mockRequest('Basic some-token');
    const res = mockResponse();

    verifyJWT(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'UNAUTHORIZED' })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('debe rechazar token inválido', () => {
    const req = mockRequest('Bearer token-invalido');
    const res = mockResponse();

    verifyJWT(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'INVALID_TOKEN' })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('debe rechazar token expirado', (done) => {
    // Crear un token que expira en 1 segundo
    const token = jwt.sign(
      { id: 1, email: 'test@test.com', role: 'client' },
      process.env.JWT_SECRET,
      { expiresIn: '1s' }
    );

    // Esperar 1.5s para que expire
    setTimeout(() => {
      const req = mockRequest(`Bearer ${token}`);
      const res = mockResponse();

      verifyJWT(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'TOKEN_EXPIRED' })
      );
      expect(mockNext).not.toHaveBeenCalled();
      done();
    }, 1500);
  }, 5000);

  test('debe aceptar token válido y adjuntar payload a req.user', () => {
    const payload = { id: 1, email: 'test@test.com', role: 'client' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const req = mockRequest(`Bearer ${token}`);
    const res = mockResponse();

    verifyJWT(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(payload.id);
    expect(req.user.email).toBe(payload.email);
    expect(req.user.role).toBe(payload.role);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('debe decodificar correctamente un token de admin', () => {
    const payload = { id: 2, email: 'admin@ecommerce.local', role: 'admin' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    const req = mockRequest(`Bearer ${token}`);
    const res = mockResponse();

    verifyJWT(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(req.user.role).toBe('admin');
  });
});
