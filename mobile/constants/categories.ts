/**
 * Categorías fijas del sistema.
 * Coinciden con el seed de la BD (docs/07_schema.sql).
 */
export interface Category {
  id: number;
  name: string;
  slug: string;
}

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Moda',              slug: 'moda' },
  { id: 2, name: 'Cosméticos/Salud',  slug: 'cosmeticos-salud' },
  { id: 3, name: 'Hogar/Decoración',  slug: 'hogar-decoracion' },
  { id: 4, name: 'Accesorios',        slug: 'accesorios' },
];

/**
 * Tabs visibles en el catálogo. Incluye "Todos" como primera opción.
 */
export const CATEGORY_TABS = [
  { id: 0, name: 'Todos', slug: '' },
  ...CATEGORIES,
];
