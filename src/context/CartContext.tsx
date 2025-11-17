'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Product } from '@/types/product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock_quantity) {
          console.warn(`No se pueden añadir más unidades de ${product.name}. Stock máximo alcanzado.`);
          alert(`No se pueden añadir más unidades de ${product.name}. Stock máximo alcanzado.`);
          return prevItems;
        }
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      if (product.stock_quantity > 0) {
        return [...prevItems, { ...product, quantity: 1 }];
      }
      console.warn(`${product.name} está agotado.`);
      return prevItems;
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCartItems(prevItems => {
      const itemToUpdate = prevItems.find(item => item.id === productId);
      if (!itemToUpdate) return prevItems;

      if (quantity <= 0) {
        return prevItems.filter(item => item.id !== productId);
      }
      
      if (quantity > itemToUpdate.stock_quantity) {
        alert(`No puedes seleccionar más de ${itemToUpdate.stock_quantity} unidades de este producto.`);
      }

      const newQuantity = Math.min(quantity, itemToUpdate.stock_quantity);

      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
