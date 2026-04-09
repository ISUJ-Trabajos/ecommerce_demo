// ─── Mock del pool MySQL ──────────────────────────────────
jest.mock('../../../src/config/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

const { pool } = require('../../../src/config/db');
const productsService = require('../../../src/modules/products/products.service');

describe('products.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ═══════════════════════════════════════════════════════
  // T2-01 · Listado: solo activos, filtra por categoría
  // ═══════════════════════════════════════════════════════
  describe('findAll', () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Camiseta Oversize Premium',
        description: 'Camiseta de algodón pima 100%',
        price: 29.99,
        stock: 50,
        image_url: '/uploads/camiseta_oversize.png',
        is_active: 1,
        category_id: 1,
        category_name: 'Moda',
        category_slug: 'moda',
        created_at: '2026-01-01',
      },
      {
        id: 5,
        name: 'Sérum Vitamina C',
        description: 'Sérum antioxidante',
        price: 34.99,
        stock: 60,
        image_url: '/uploads/serum_vitamina_c.png',
        is_active: 1,
        category_id: 2,
        category_name: 'Cosméticos/Salud',
        category_slug: 'cosmeticos-salud',
        created_at: '2026-01-01',
      },
    ];

    test('debe retornar solo productos activos', async () => {
      pool.query.mockResolvedValueOnce([mockProducts]);

      const result = await productsService.findAll();

      expect(result).toHaveLength(2);
      expect(result.every(p => p.is_active === 1)).toBe(true);

      // Verificar que la query filtra por is_active = 1
      const queryArg = pool.query.mock.calls[0][0];
      expect(queryArg).toContain('is_active = 1');
    });

    test('debe filtrar por categoría cuando se proporciona slug', async () => {
      const modaProducts = [mockProducts[0]];
      pool.query.mockResolvedValueOnce([modaProducts]);

      const result = await productsService.findAll('moda');

      expect(result).toHaveLength(1);
      expect(result[0].category_slug).toBe('moda');

      // Verificar que se pasa el slug como parámetro
      const queryArg = pool.query.mock.calls[0][0];
      expect(queryArg).toContain('category_slug = ?');
      expect(pool.query.mock.calls[0][1]).toEqual(['moda']);
    });

    test('debe retornar todos los productos activos sin filtro de categoría', async () => {
      pool.query.mockResolvedValueOnce([mockProducts]);

      const result = await productsService.findAll();

      expect(result).toHaveLength(2);

      // Verificar que NO se filtra por categoría
      const queryArg = pool.query.mock.calls[0][0];
      expect(queryArg).not.toContain('category_slug = ?');
    });

    test('debe retornar array vacío si no hay productos', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const result = await productsService.findAll();

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });

  // ═══════════════════════════════════════════════════════
  // T2-02 · Detalle: retorna stock, null si no existe
  // ═══════════════════════════════════════════════════════
  describe('findById', () => {
    const mockProduct = {
      id: 4,
      name: 'Blazer Estructurado Negro',
      description: 'Blazer doble botonadura',
      price: 89.99,
      stock: 3,
      image_url: '/uploads/blazer_negro.png',
      is_active: 1,
      category_id: 1,
      category_name: 'Moda',
      category_slug: 'moda',
      created_at: '2026-01-01',
    };

    test('debe retornar un producto con su stock actual', async () => {
      pool.query.mockResolvedValueOnce([[mockProduct]]);

      const result = await productsService.findById(4);

      expect(result).toBeDefined();
      expect(result.id).toBe(4);
      expect(result.stock).toBe(3);
      expect(result.name).toBe('Blazer Estructurado Negro');
      expect(result.category_name).toBe('Moda');
      expect(result.image_url).toBe('/uploads/blazer_negro.png');
    });

    test('debe retornar null si el producto no existe', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const result = await productsService.findById(999);

      expect(result).toBeNull();
    });

    test('debe consultar solo productos activos', async () => {
      pool.query.mockResolvedValueOnce([[mockProduct]]);

      await productsService.findById(4);

      const queryArg = pool.query.mock.calls[0][0];
      expect(queryArg).toContain('is_active = 1');
    });

    test('debe incluir las columnas de categoría en la respuesta', async () => {
      pool.query.mockResolvedValueOnce([[mockProduct]]);

      const result = await productsService.findById(4);

      expect(result).toHaveProperty('category_id');
      expect(result).toHaveProperty('category_name');
      expect(result).toHaveProperty('category_slug');
    });
  });
});
