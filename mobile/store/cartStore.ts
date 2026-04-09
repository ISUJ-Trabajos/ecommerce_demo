import { create } from 'zustand';
import { CartItem } from '../services/cartService';

interface CartState {
  items: CartItem[];
  total: number;
  setCart: (items: CartItem[]) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  total: 0,
  
  setCart: (items) => {
    const total = items.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    set({ items, total });
  },
  
  clearCart: () => set({ items: [], total: 0 }),
}));
