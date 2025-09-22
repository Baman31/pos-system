import React, { useState } from 'react';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useAppData } from '../../context/DataContext';
import { PaymentModal } from './PaymentModal';

interface CartProps {
  orderType: string;
}

export function Cart({ orderType }: CartProps) {
  const { cart, addToCart, removeFromCart, clearCart } = useAppData();
  const [showPayment, setShowPayment] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-gray-500">
        <ShoppingBag className="h-16 w-16 mb-4" />
        <p className="text-lg font-medium">Cart is empty</p>
        <p className="text-sm">Add items from the menu to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <button
                    onClick={() => {
                      // Remove all quantities of this item
                      for (let i = 0; i < item.quantity; i++) {
                        removeFromCart(item.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-orange-600 font-semibold">₹{item.price}</span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-orange-600 text-white p-1 rounded hover:bg-orange-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 text-right">
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t bg-white p-6">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={clearCart}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Clear Cart
            </button>
            <button
              onClick={() => setShowPayment(true)}
              className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          total={total}
          orderType={orderType}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  );
}