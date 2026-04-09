import { useState, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useCartStore } from '../store/cartStore';

export function useCart() {
  const { items, total, setCart, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err: any) {
      console.error('[useCart: loadCart] Error:', err?.response?.data || err.message);
      setError(err?.response?.data?.message || 'Error al cargar el carrito');
    } finally {
      setIsLoading(false);
    }
  }, [setCart]);

  const addItemToCart = async (productId: number, quantity: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      await cartService.addToCart(productId, quantity);
      await loadCart(); // Refrescar carrito
    } catch (err: any) {
      console.error('[useCart: addItemToCart] Error:', err?.response?.data || err.message);
      if (err?.response?.data?.error === 'OUT_OF_STOCK' || err?.response?.data?.error === 'STOCK_EXCEEDED') {
         setError(err?.response?.data?.message);
         throw err;
      }
      setError('Error al agregar al carrito');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await cartService.updateQuantity(id, quantity);
      await loadCart();
    } catch (err: any) {
      console.error('[useCart: updateQuantity] Error:', err?.response?.data || err.message);
      if (err?.response?.data?.error === 'STOCK_EXCEEDED') {
         setError(err?.response?.data?.message);
         throw err;
      }
      setError('Error al actualizar cantidad');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await cartService.removeFromCart(id);
      await loadCart();
    } catch (err: any) {
      console.error('[useCart: removeItem] Error:', err?.response?.data || err.message);
      setError('Error al eliminar ítem');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    items,
    total,
    isLoading,
    error,
    setError,
    loadCart,
    addItemToCart,
    updateQuantity,
    removeItem,
    clearCart
  };
}
