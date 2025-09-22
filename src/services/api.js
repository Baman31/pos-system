const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // Outlet methods
  async getOutlets() {
    return this.request('/outlets');
  }

  async getOutlet(id) {
    return this.request(`/outlets/${id}`);
  }

  async createOutlet(outletData) {
    return this.request('/outlets', {
      method: 'POST',
      body: JSON.stringify(outletData),
    });
  }

  async updateOutlet(id, outletData) {
    return this.request(`/outlets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(outletData),
    });
  }

  // Menu methods
  async getMenuItems(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/menu${queryString ? `?${queryString}` : ''}`);
  }

  async getMenuCategories() {
    return this.request('/menu/categories');
  }

  async getMenuItem(id) {
    return this.request(`/menu/${id}`);
  }

  async createMenuItem(itemData) {
    return this.request('/menu', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async updateMenuItem(id, itemData) {
    return this.request(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  }

  async toggleMenuItemAvailability(id) {
    return this.request(`/menu/${id}/availability`, {
      method: 'PATCH',
    });
  }

  async deleteMenuItem(id) {
    return this.request(`/menu/${id}`, {
      method: 'DELETE',
    });
  }

  // Order methods
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders${queryString ? `?${queryString}` : ''}`);
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateOrderItemStatus(orderId, itemId, status) {
    return this.request(`/orders/${orderId}/items/${itemId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getOrderAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders/analytics/summary${queryString ? `?${queryString}` : ''}`);
  }

  // Inventory methods
  async getInventoryItems(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/inventory${queryString ? `?${queryString}` : ''}`);
  }

  async getInventoryCategories() {
    return this.request('/inventory/categories');
  }

  async getLowStockItems() {
    return this.request('/inventory/low-stock');
  }

  async getInventoryItem(id) {
    return this.request(`/inventory/${id}`);
  }

  async createInventoryItem(itemData) {
    return this.request('/inventory', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async updateInventoryItem(id, itemData) {
    return this.request(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  }

  async updateStock(id, quantity, operation = 'set') {
    return this.request(`/inventory/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity, operation }),
    });
  }

  async deleteInventoryItem(id) {
    return this.request(`/inventory/${id}`, {
      method: 'DELETE',
    });
  }

  async getInventoryAnalytics() {
    return this.request('/inventory/analytics/summary');
  }

  // Customer methods
  async getCustomers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/customers${queryString ? `?${queryString}` : ''}`);
  }

  async getCustomer(id) {
    return this.request(`/customers/${id}`);
  }

  async getCustomerByPhone(phone) {
    return this.request(`/customers/phone/${phone}`);
  }

  async createCustomer(customerData) {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  async updateCustomer(id, customerData) {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  async updateLoyaltyPoints(id, points, operation = 'set') {
    return this.request(`/customers/${id}/loyalty`, {
      method: 'PATCH',
      body: JSON.stringify({ points, operation }),
    });
  }

  async getCustomerAnalytics() {
    return this.request('/customers/analytics/summary');
  }

  async deleteCustomer(id) {
    return this.request(`/customers/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();