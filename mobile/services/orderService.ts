import api from './api';

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  name: string;
  image_url: string | null;
}

export interface Order {
  id: number;
  user_id: number;
  total: string;
  status: 'completed' | 'pending'; // Ajustar según backend
  created_at: string;
  items?: OrderItem[]; // Sólo en detalle
  // Campos del listado summary:
  item_count?: number; 
}

export const orderService = {
  async createOrder(): Promise<{ orderId: number; message: string }> {
    const response = await api.post('/orders');
    return response.data;
  },

  async getOrders(): Promise<Order[]> {
    const response = await api.get('/orders');
    return response.data;
  },

  async getOrderById(id: number): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }
};
