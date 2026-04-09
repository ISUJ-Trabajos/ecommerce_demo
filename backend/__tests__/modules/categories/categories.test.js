// ─── Mock del pool MySQL ──────────────────────────────────
jest.mock('../../../src/config/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

const { pool } = require('../../../src/config/db');
const { listCategories } = require('../../../src/modules/categories/categories.controller');

describe('categories.controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  // T2-03 · Categorías: retorna 4 categorías
  describe('listCategories', () => {
    test('debe retornar las 4 categorías del sistema', async () => {
      const mockCategories = [
        { id: 1, name: 'Moda', slug: 'moda' },
        { id: 2, name: 'Cosméticos/Salud', slug: 'cosmeticos-salud' },
        { id: 3, name: 'Hogar/Decoración', slug: 'hogar-decoracion' },
        { id: 4, name: 'Accesorios', slug: 'accesorios' },
      ];

      pool.query.mockResolvedValueOnce([mockCategories]);

      await listCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ categories: mockCategories });
      expect(mockCategories).toHaveLength(4);
    });

    test('debe retornar categorías ordenadas por id', async () => {
      const mockCategories = [
        { id: 1, name: 'Moda', slug: 'moda' },
        { id: 2, name: 'Cosméticos/Salud', slug: 'cosmeticos-salud' },
      ];

      pool.query.mockResolvedValueOnce([mockCategories]);

      await listCategories(req, res);

      // Verificar que la query incluye ORDER BY id
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY id')
      );
    });

    test('debe retornar 500 si hay error en la BD', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB connection failed'));

      await listCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'INTERNAL_ERROR' })
      );
    });
  });
});
