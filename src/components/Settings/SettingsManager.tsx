import React, { useState } from 'react';
import { Store, Users, Bell, CreditCard, Globe, Shield } from 'lucide-react';
import { useAppData } from '../../context/DataContext';

export function SettingsManager() {
  const { outlets, currentOutlet } = useAppData();
  const [activeTab, setActiveTab] = useState('outlets');

  const tabs = [
    { id: 'outlets', label: 'Outlets', icon: Store },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'outlets':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Outlet Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {outlets.map(outlet => (
                <div key={outlet.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{outlet.name}</h4>
                      <p className="text-sm text-gray-600">{outlet.address}</p>
                      <p className="text-sm text-gray-600">{outlet.phone}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      outlet.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {outlet.status}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p><strong>Manager:</strong> {outlet.manager}</p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      Edit
                    </button>
                    <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'users':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">User Management</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600">User management features coming soon...</p>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Settings</h3>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium mb-3">Accepted Payment Methods</h4>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Cash
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Credit/Debit Cards
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    UPI
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Digital Wallets
                  </label>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium mb-3">Tax Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">CGST (%)</label>
                    <input type="number" className="w-full p-2 border rounded" defaultValue="9" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SGST (%)</label>
                    <input type="number" className="w-full p-2 border rounded" defaultValue="9" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium mb-3">Order Notifications</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    New order received
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Order status updates
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Payment confirmations
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium mb-3">Inventory Alerts</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Low stock alerts
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Expiry date reminders
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Third-party Integrations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Zomato</h4>
                <p className="text-sm text-gray-600 mb-4">Sync menu and receive orders from Zomato</p>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Connect Zomato
                </button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Swiggy</h4>
                <p className="text-sm text-gray-600 mb-4">Sync menu and receive orders from Swiggy</p>
                <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                  Connect Swiggy
                </button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">WhatsApp Business</h4>
                <p className="text-sm text-gray-600 mb-4">Send order updates via WhatsApp</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Connect WhatsApp
                </button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">SMS Gateway</h4>
                <p className="text-sm text-gray-600 mb-4">Send SMS notifications to customers</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Configure SMS
                </button>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium mb-3">Password Policy</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Require strong passwords
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Two-factor authentication
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Auto-logout after inactivity
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium mb-3">Data Backup</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Backup Frequency</label>
                    <select className="w-full p-2 border rounded">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Backup Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          </div>
          <div className="px-6">
            <nav className="flex space-x-8">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}