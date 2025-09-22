import React, { useState } from 'react';
import { MenuGrid } from './MenuGrid';
import { Cart } from './Cart';
import { OrderTypeSelector } from './OrderTypeSelector';
import { useAppData } from '../../context/DataContext';

export function POSInterface() {
  const [orderType, setOrderType] = useState('dine-in');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { menuItems } = useAppData();

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];

  return (
    <div className="flex h-full">
      {/* Left Panel - Menu */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Menu Items</h2>
            
            {/* Category Filter */}
            <div className="flex space-x-2 mb-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            <MenuGrid selectedCategory={selectedCategory} />
          </div>
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="w-96 p-6">
        <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Current Order</h2>
            <OrderTypeSelector orderType={orderType} onOrderTypeChange={setOrderType} />
          </div>
          
          <div className="flex-1">
            <Cart orderType={orderType} />
          </div>
        </div>
      </div>
    </div>
  );
}