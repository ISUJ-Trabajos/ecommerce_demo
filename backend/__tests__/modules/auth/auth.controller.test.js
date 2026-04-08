const request = require('supertest');

// ─── Mock del pool MySQL y del auth service ───────────────
jest.mock('../../../src/config/db', () => ({
  pool: { query: jest.fn() },
}));

jest.mock('../../../src/modules/auth/auth.service', () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

const app = require('../../../src/app');
const authService = require('../../../src/modules/auth/auth.service');

describe('auth.controller — validación de inputs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ═══════════════════════════════════════════════════════
  // REGISTER — Validaciones
  // ═══════════════════════════════════════════════════════
  describe('POST /api/auth/register', () => {
    test('debe rechazar si faltan campos requeridos', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('VALIDATION_ERROR');
      expect(res.body.details.length).toBeGreaterThanOrEqual(3);
    });

    test('debe rechazar email inválido', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'no-es-email', password: '123456' });

      expect(res.status).toBe(400);
      expect(res.body.details.some(d => d.field === 'email')).toBe(true);
    });

    test('debe rechazar contraseña corta (< 6 caracteres)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'test@test.com', password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.details.some(d => d.field === 'password')).toBe(true);
    });

    test('debe registrar exitosamente con datos válidos', async () => {
      authService.register.mockResolvedValueOnce({
        id: 1, name: 'Test', email: 'test@test.com', role: 'client',
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'test@test.com', password: '123456' });

      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe('client');
    });

    test('debe retornar 409 cuando el email está duplicado', async () => {
      const err = new Error('El email ya está registrado');
      err.code = 'EMAIL_DUPLICATE';
      err.status = 409;
      authService.register.mockRejectedValueOnce(err);

      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'dupe@test.com', password: '123456' });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe('EMAIL_DUPLICATE');
    });
  });

  // ═══════════════════════════════════════════════════════
  // LOGIN — Validaciones
  // ═══════════════════════════════════════════════════════
  describe('POST /api/auth/login', () => {
    test('debe rechazar si faltan campos', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    test('debe rechazar email inválido', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalido', password: '123456' });

      expect(res.status).toBe(400);
    });

    test('debe retornar token con credenciales válidas', async () => {
      authService.login.mockResolvedValueOnce({
        token: 'jwt-token-mock',
        user: { id: 1, name: 'Test', email: 'test@test.com', role: 'client' },
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: '123456' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBe('jwt-token-mock');
      expect(res.body.user).toBeDefined();
    });

    test('debe retornar 401 con credenciales incorrectas', async () => {
      const err = new Error('Credenciales incorrectas');
      err.code = 'INVALID_CREDENTIALS';
      err.status = 401;
      authService.login.mockRejectedValueOnce(err);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'wrong' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('INVALID_CREDENTIALS');
    });
  });
});
