import React, { useState } from 'react';
import { Calendar, TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import { useAppData } from '../../context/DataContext';

export function ReportsManager() {
  const { orders, menuItems } = useAppData();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const today = new Date();
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const avgOrderValue = orders.length > 0 ? totalSales / orders.length : 0;

  const popularItems = menuItems
    .map(item => {
      const totalSold = orders.reduce((sum, order) => {
        const orderItem = order.items.find((i: any) => i.id === item.id);
        return sum + (orderItem ? orderItem.quantity : 0);
      }, 0);
      return { ...item, totalSold };
    })
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);

  const salesByType = orders.reduce((acc, order) => {
    acc[order.type] = (acc[order.type] || 0) + order.total;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Sales</p>
              <p className="text-2xl font-bold text-gray-900">₹{todaySales.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <ShoppingBag className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{Math.round(avgOrderValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Orders</p>
              <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Items */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Most Popular Items</h3>
          <div className="space-y-4">
            {popularItems.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2 py-1 rounded-full mr-3">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.totalSold} sold</p>
                  </div>
                </div>
                <span className="font-semibold text-green-600">
                  ₹{(item.totalSold * item.price).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Order Type */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Sales by Order Type</h3>
          <div className="space-y-4">
            {Object.entries(salesByType).map(([type, amount]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    type === 'dine-in' ? 'bg-purple-500' :
                    type === 'takeaway' ? 'bg-orange-500' : 'bg-indigo-500'
                  }`} />
                  <span className="capitalize font-medium">{type.replace('-', ' ')}</span>
                </div>
                <span className="font-semibold">₹{amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.slice(0, 10).map(order => (
                  <tr key={order.id} className="border-t">
                    <td className="py-3 font-medium">{order.id}</td>
                    <td className="py-3">{order.customerName}</td>
                    <td className="py-3 capitalize">{order.type.replace('-', ' ')}</td>
                    <td className="py-3 font-semibold">₹{order.total}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'ready' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}