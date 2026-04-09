import api from './api';

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  added_at: string;
  product_name: string;
  price: string;
  stock: number;
  image_url: string;
  is_active: number;
}

export const cartService = {
  getCart: async () => {
    const response = await api.get<CartItem[]>('/cart');
    return response.data;
  },
  
  addToCart: async (productId: number, quantity: number = 1) => {
    const response = await api.post<CartItem>('/cart', { product_id: productId, quantity });
    return response.data;
  },
  
  updateQuantity: async (id: number, quantity: number) => {
    const response = await api.patch<CartItem>(`/cart/${id}`, { quantity });
    return response.data;
  },
  
  removeFromCart: async (id: number) => {
    await api.delete(`/cart/${id}`);
  }
};
