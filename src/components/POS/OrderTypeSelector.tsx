import React from 'react';
import { Store, Package, Truck } from 'lucide-react';

interface OrderTypeSelectorProps {
  orderType: string;
  onOrderTypeChange: (type: string) => void;
}

export function OrderTypeSelector({ orderType, onOrderTypeChange }: OrderTypeSelectorProps) {
  const orderTypes = [
    { id: 'dine-in', label: 'Dine In', icon: Store },
    { id: 'takeaway', label: 'Takeaway', icon: Package },
    { id: 'delivery', label: 'Delivery', icon: Truck }
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {orderTypes.map(type => {
        const Icon = type.icon;
        return (
          <button
            key={type.id}
            onClick={() => onOrderTypeChange(type.id)}
            className={`flex flex-col items-center p-3 rounded-lg text-sm transition-colors ${
              orderType === type.id
                ? 'bg-orange-100 text-orange-800 border-2 border-orange-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon className="h-5 w-5 mb-1" />
            {type.label}
          </button>
        );
      })}
    </div>
  );
}