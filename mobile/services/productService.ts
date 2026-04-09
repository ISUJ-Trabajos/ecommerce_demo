import api from './api';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  is_active: number;
  category_id: number;
  category_name: string;
  category_slug: string;
  created_at: string;
}

interface ProductListResponse {
  products: Product[];
}

interface ProductDetailResponse {
  product: Product;
}

/**
 * GET /api/products
 * GET /api/products?category=:slug
 * Retorna productos activos, opcionalmente filtrados por categoría.
 */
export async function getProducts(categorySlug?: string): Promise<Product[]> {
  const params = categorySlug ? { category: categorySlug } : {};
  const { data } = await api.get<ProductListResponse>('/products', { params });
  return data.products;
}

/**
 * GET /api/products/:id
 * Retorna el detalle de un producto activo con stock.
 */
export async function getProductById(id: number): Promise<Product> {
  const { data } = await api.get<ProductDetailResponse>(`/products/${id}`);
  return data.product;
}
