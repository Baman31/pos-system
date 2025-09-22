import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useAppData } from '../../context/DataContext';

interface MenuGridProps {
  selectedCategory: string;
}

export function MenuGrid({ selectedCategory }: MenuGridProps) {
  const { menuItems, addToCart, cart } = useAppData();

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const getItemQuantity = (itemId: string) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredItems.map(item => (
        <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="aspect-w-16 aspect-h-12 mb-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-orange-600">₹{item.price}</span>
            
            {item.available ? (
              <div className="flex items-center space-x-2">
                {getItemQuantity(item.id) > 0 && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                    {getItemQuantity(item.id)}
                  </span>
                )}
                <button
                  onClick={() => addToCart(item)}
                  className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <span className="text-red-500 text-sm font-medium">Out of Stock</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}