const { isAdmin } = require('../../src/middleware/isAdmin');

// Helpers para crear req/res mock
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('isAdmin middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe rechazar si req.user no existe', () => {
    const req = {};
    const res = mockResponse();

    isAdmin(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'UNAUTHORIZED' })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('debe rechazar si el usuario tiene rol client', () => {
    const req = { user: { id: 1, email: 'user@test.com', role: 'client' } };
    const res = mockResponse();

    isAdmin(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'FORBIDDEN' })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('debe permitir pasar si el usuario tiene rol admin', () => {
    const req = { user: { id: 2, email: 'admin@ecommerce.local', role: 'admin' } };
    const res = mockResponse();

    isAdmin(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('debe rechazar si req.user existe pero sin propiedad role', () => {
    const req = { user: { id: 1, email: 'user@test.com' } };
    const res = mockResponse();

    isAdmin(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
