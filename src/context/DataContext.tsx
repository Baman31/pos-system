import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockMenuItems, mockOrders, mockInventory, mockOutlets } from '../data/mockData';

interface AppContextType {
  menuItems: any[];
  setMenuItems: (items: any[]) => void;
  orders: any[];
  setOrders: (orders: any[]) => void;
  inventory: any[];
  setInventory: (inventory: any[]) => void;
  outlets: any[];
  currentOutlet: any;
  setCurrentOutlet: (outlet: any) => void;
  cart: any[];
  setCart: (cart: any[]) => void;
  addToCart: (item: any) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  createOrder: (orderData: any) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [orders, setOrders] = useState(mockOrders);
  const [inventory, setInventory] = useState(mockInventory);
  const [outlets] = useState(mockOutlets);
  const [currentOutlet, setCurrentOutlet] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (item: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prevCart.filter(cartItem => cartItem.id !== itemId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const createOrder = (orderData: any) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      createdAt: new Date(),
      outlet: currentOutlet?.id || 'outlet-1'
    };
    
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const value = {
    menuItems,
    setMenuItems,
    orders,
    setOrders,
    inventory,
    setInventory,
    outlets,
    currentOutlet,
    setCurrentOutlet,
    cart,
    setCart,
    addToCart,
    removeFromCart,
    clearCart,
    createOrder,
    updateOrderStatus
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within a DataProvider');
  }
  return context;
}