import React from 'react';
import { 
  ShoppingCart, 
  Menu, 
  Package, 
  ClipboardList, 
  BarChart3, 
  Settings,
  Store
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  userRole: string;
}

export function Sidebar({ currentView, onViewChange, userRole }: SidebarProps) {
  const menuItems = [
    { id: 'pos', label: 'POS Terminal', icon: ShoppingCart, roles: ['admin', 'cashier'] },
    { id: 'menu', label: 'Menu Management', icon: Menu, roles: ['admin'] },
    { id: 'inventory', label: 'Inventory', icon: Package, roles: ['admin', 'kitchen'] },
    { id: 'orders', label: 'Orders', icon: ClipboardList, roles: ['admin', 'cashier', 'kitchen'] },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] },
  ];

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="bg-gray-900 text-white w-64 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Store className="h-8 w-8 text-orange-500" />
          <div>
            <h1 className="text-xl font-bold">RestaurantPOS</h1>
            <p className="text-sm text-gray-400">Management System</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}