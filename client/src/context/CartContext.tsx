import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  product: any;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity?: number, color?: string, size?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: any, quantity = 1, color?: string, size?: string) => {
    const productId = product._id || product.id;
    setItems(prev => {
      const existing = prev.find(i => (i.product._id || i.product.id) === productId);
      if (existing) {
        toast.success(`Updated ${product.name} quantity in cart!`);
        return prev.map(i =>
          (i.product._id || i.product.id) === productId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      toast.success(`${product.name} added to cart!`);
      return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => {
      const item = prev.find(i => (i.product._id || i.product.id) === productId);
      if (item) toast.info(`${item.product.name} removed from cart`);
      return prev.filter(i => (i.product._id || i.product.id) !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev => prev.map(i =>
      (i.product._id || i.product.id) === productId ? { ...i, quantity } : i
    ));
  }, [removeItem]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
