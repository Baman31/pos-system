import React, { useState } from 'react';
import { X, CreditCard, Banknote, Smartphone, Wallet } from 'lucide-react';
import { useAppData } from '../../context/DataContext';

interface PaymentModalProps {
  total: number;
  orderType: string;
  onClose: () => void;
}

export function PaymentModal({ total, orderType, onClose }: PaymentModalProps) {
  const { createOrder } = useAppData();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [address, setAddress] = useState('');

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: Banknote },
    { id: 'card', label: 'Card', icon: CreditCard },
    { id: 'upi', label: 'UPI', icon: Smartphone },
    { id: 'wallet', label: 'Wallet', icon: Wallet }
  ];

  const handlePayment = () => {
    const orderData = {
      customerName: customerName || 'Walk-in Customer',
      phone: customerPhone,
      type: orderType,
      paymentMethod,
      ...(orderType === 'dine-in' && { tableNumber }),
      ...(orderType === 'delivery' && { address })
    };

    createOrder(orderData);
    onClose();
    
    // Show success message (in a real app, this would be a toast notification)
    alert('Order placed successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Customer Details */}
          <div>
            <label className="block text-sm font-medium mb-2">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="+91-9876543210"
            />
          </div>

          {orderType === 'dine-in' && (
            <div>
              <label className="block text-sm font-medium mb-2">Table Number</label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 5"
              />
            </div>
          )}

          {orderType === 'delivery' && (
            <div>
              <label className="block text-sm font-medium mb-2">Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                rows={3}
                placeholder="Enter complete address"
              />
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map(method => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center space-x-2 p-3 border rounded-lg ${
                      paymentMethod === method.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700"
            >
              Complete Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}