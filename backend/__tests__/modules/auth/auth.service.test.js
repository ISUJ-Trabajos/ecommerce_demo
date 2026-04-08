const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

// ─── Mock del pool MySQL ──────────────────────────────────
jest.mock('../../../src/config/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

const { pool } = require('../../../src/config/db');
const authService = require('../../../src/modules/auth/auth.service');

// Configurar env
process.env.JWT_SECRET     = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ═══════════════════════════════════════════════════════
  // REGISTER
  // ═══════════════════════════════════════════════════════
  describe('register', () => {
    test('debe registrar un nuevo usuario exitosamente', async () => {
      pool.query
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{ insertId: 10 }]);

      const result = await authService.register('Test User', 'test@test.com', 'password123');

      expect(result).toEqual({
        id: 10,
        name: 'Test User',
        email: 'test@test.com',
        role: 'client',
      });

      // Verificar que se insertó con hash (no texto plano)
      const insertCall = pool.query.mock.calls[1];
      const hashedPassword = insertCall[1][2];
      expect(hashedPassword).not.toBe('password123');
      expect(hashedPassword.startsWith('$2')).toBe(true);
    });

    test('debe rechazar registro con email duplicado', async () => {
      pool.query.mockResolvedValueOnce([[{ id: 1 }]]);

      await expect(
        authService.register('Test', 'existing@test.com', 'pass123')
      ).rejects.toThrow('El email ya está registrado');

      expect(pool.query).toHaveBeenCalledTimes(1);
    });

    test('el usuario registrado siempre tiene rol client', async () => {
      pool.query
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{ insertId: 5 }]);

      const result = await authService.register('Admin Wannabe', 'hack@test.com', 'pass');
      expect(result.role).toBe('client');

      const insertCall = pool.query.mock.calls[1];
      expect(insertCall[1][3]).toBe('client');
    });
  });

  // ═══════════════════════════════════════════════════════
  // LOGIN
  // ═══════════════════════════════════════════════════════
  describe('login', () => {
    const validHash = bcrypt.hashSync('correctPassword', 10);

    test('debe retornar token y usuario con credenciales correctas', async () => {
      pool.query.mockResolvedValueOnce([[{
        id: 1,
        name: 'Client User',
        email: 'client@test.com',
        password: validHash,
        role: 'client',
      }]]);

      const result = await authService.login('client@test.com', 'correctPassword');

      expect(result).toHaveProperty('token');
      expect(result.user).toEqual({
        id: 1,
        name: 'Client User',
        email: 'client@test.com',
        role: 'client',
      });

      const decoded = jwt.verify(result.token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(1);
      expect(decoded.role).toBe('client');
    });

    test('debe rechazar login con email inexistente', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      await expect(
        authService.login('noexiste@test.com', 'password')
      ).rejects.toThrow('Credenciales incorrectas');
    });

    test('debe rechazar login con contraseña incorrecta', async () => {
      pool.query.mockResolvedValueOnce([[{
        id: 1,
        name: 'User',
        email: 'user@test.com',
        password: validHash,
        role: 'client',
      }]]);

      await expect(
        authService.login('user@test.com', 'wrongPassword')
      ).rejects.toThrow('Credenciales incorrectas');
    });

    test('token de admin debe incluir role admin', async () => {
      const adminHash = bcrypt.hashSync('Admin1234!', 10);
      pool.query.mockResolvedValueOnce([[{
        id: 2,
        name: 'Super Admin',
        email: 'admin@ecommerce.local',
        password: adminHash,
        role: 'admin',
      }]]);

      const result = await authService.login('admin@ecommerce.local', 'Admin1234!');
      expect(result.user.role).toBe('admin');

      const decoded = jwt.verify(result.token, process.env.JWT_SECRET);
      expect(decoded.role).toBe('admin');
    });
  });
});
