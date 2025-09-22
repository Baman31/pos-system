import React from 'react';
import { ChevronDown, User, LogOut, MapPin } from 'lucide-react';

interface HeaderProps {
  currentUser: any;
  currentOutlet: any;
  onOutletChange: (outlet: any) => void;
  onLogout: () => void;
}

export function Header({ currentUser, currentOutlet, onOutletChange, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-700">
              {currentOutlet?.name || 'Select Outlet'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-medium text-gray-900">{currentUser.name}</p>
            <p className="text-sm text-gray-500 capitalize">{currentUser.role}</p>
          </div>
          <div className="relative">
            <button className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 hover:bg-gray-200 transition-colors">
              <User className="h-5 w-5 text-gray-600" />
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-red-600 hover:bg-red-50 rounded-lg px-3 py-2 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}