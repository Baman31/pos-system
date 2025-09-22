import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

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
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [outlets, setOutlets] = useState<any[]>([]);
  const [currentOutlet, setCurrentOutlet] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from API
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [menuResponse, ordersResponse, inventoryResponse, outletsResponse] = await Promise.all([
        apiService.getMenuItems(),
        apiService.getOrders(),
        apiService.getInventoryItems(),
        apiService.getOutlets().catch(() => []) // Non-admin users can't access outlets
      ]);

      setMenuItems(menuResponse);
      setOrders(ordersResponse);
      setInventory(inventoryResponse);
      setOutlets(outletsResponse);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshData();
    }
  }, []);

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

  const createOrder = async (orderData: any) => {
    try {
      const orderPayload = {
        ...orderData,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };
      
      const newOrder = await apiService.createOrder(orderPayload);
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      clearCart();
      return newOrder;
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
      throw err;
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const updatedOrder = await apiService.updateOrderStatus(orderId, status);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? updatedOrder : order
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
      throw err;
    }
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
    updateOrderStatus,
    loading,
    error,
    refreshData
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