import React, { useState } from 'react';
import { Search, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import { useAppData } from '../../context/DataContext';

export function OrdersManager() {
  const { orders, updateOrderStatus } = useAppData();
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'dine-in': return 'bg-purple-100 text-purple-800';
      case 'takeaway': return 'bg-orange-100 text-orange-800';
      case 'delivery': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders Management</h2>
          
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Types</option>
              <option value="dine-in">Dine In</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{order.id}</h3>
                  <p className="text-sm text-gray-600">{order.customerName}</p>
                  {order.phone && (
                    <p className="text-sm text-gray-600">{order.phone}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <div className="mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(order.type)}`}>
                      {order.type.charAt(0).toUpperCase() + order.type.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {order.tableNumber && (
                <p className="text-sm text-gray-600 mb-2">Table: {order.tableNumber}</p>
              )}
              
              {order.address && (
                <p className="text-sm text-gray-600 mb-2">Address: {order.address}</p>
              )}

              <div className="border-t pt-4 mb-4">
                <h4 className="font-medium mb-2">Items:</h4>
                <ul className="text-sm space-y-1">
                  {order.items.map((item: any, index: number) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total: ₹{order.total}</span>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </span>
              </div>

              <div className="flex space-x-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700"
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700"
                  >
                    Complete
                  </button>
                )}
                {['pending', 'preparing'].includes(order.status) && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    className="bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}