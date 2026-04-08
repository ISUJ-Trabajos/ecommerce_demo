// Test para verificar que el módulo db.js se carga correctamente
// y exporta el pool con la configuración esperada.
// Nota: NO se hace conexión real a MySQL en unit tests.

describe('config/db.js', () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('debe exportar un objeto con propiedad pool', () => {
    // Configurar env antes de importar
    process.env.DB_HOST     = 'localhost';
    process.env.DB_PORT     = '3306';
    process.env.DB_USER     = 'root';
    process.env.DB_PASSWORD = '';
    process.env.DB_NAME     = 'ecommerce_demo';

    // Limpiar cache para re-importar con nuevas env vars
    jest.resetModules();
    const db = require('../../src/config/db');

    expect(db).toHaveProperty('pool');
    expect(db.pool).toBeDefined();
  });

  test('el pool debe tener métodos de conexión', () => {
    jest.resetModules();
    const { pool } = require('../../src/config/db');

    // mysql2/promise pool tiene estos métodos
    expect(typeof pool.getConnection).toBe('function');
    expect(typeof pool.query).toBe('function');
    expect(typeof pool.execute).toBe('function');
  });
});
