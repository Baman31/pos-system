import React, { useState } from 'react';
import { Store, User, Lock } from 'lucide-react';
import apiService from '../../services/api';

interface LoginScreenProps {
  onLogin: (user: any) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.login({ username, password });
      onLogin(response.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (credentials: { username: string; password: string }) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.login(credentials);
      onLogin(response.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Store className="h-16 w-16 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">RestaurantPOS</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-4">Quick Demo Login:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => quickLogin({ username: 'admin', password: 'admin123' })}
              disabled={loading}
              className="text-xs bg-blue-100 text-blue-800 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Admin
            </button>
            <button
              onClick={() => quickLogin({ username: 'cashier', password: 'cashier123' })}
              disabled={loading}
              className="text-xs bg-green-100 text-green-800 py-2 px-3 rounded-lg hover:bg-green-200 transition-colors"
            >
              Cashier
            </button>
            <button
              onClick={() => quickLogin({ username: 'kitchen', password: 'kitchen123' })}
              disabled={loading}
              className="text-xs bg-purple-100 text-purple-800 py-2 px-3 rounded-lg hover:bg-purple-200 transition-colors"
            >
              Kitchen
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-4 space-y-1">
            <p><strong>Admin:</strong> admin / admin123</p>
            <p><strong>Cashier:</strong> cashier / cashier123</p>
            <p><strong>Kitchen:</strong> kitchen / kitchen123</p>
          </div>
        </div>
      </div>
    </div>
  );
}