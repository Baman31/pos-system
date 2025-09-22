import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { POSInterface } from './components/POS/POSInterface';
import { MenuManager } from './components/Menu/MenuManager';
import { InventoryManager } from './components/Inventory/InventoryManager';
import { OrdersManager } from './components/Orders/OrdersManager';
import { ReportsManager } from './components/Reports/ReportsManager';
import { SettingsManager } from './components/Settings/SettingsManager';
import { LoginScreen } from './components/Auth/LoginScreen';
import { DataProvider, useAppData } from './context/DataContext';

function AppContent() {
  const [currentView, setCurrentView] = useState('pos');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { outlets, currentOutlet, setCurrentOutlet } = useAppData();

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    if (outlets.length > 0 && !currentOutlet) {
      setCurrentOutlet(outlets[0]);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentOutlet(null);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'pos':
        return <POSInterface />;
      case 'menu':
        return <MenuManager />;
      case 'inventory':
        return <InventoryManager />;
      case 'orders':
        return <OrdersManager />;
      case 'reports':
        return <ReportsManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <POSInterface />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} userRole={currentUser.role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentUser={currentUser} 
          currentOutlet={currentOutlet}
          onOutletChange={setCurrentOutlet}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;