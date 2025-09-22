export const mockMenuItems = [
  // Appetizers
  {
    id: '1',
    name: 'Bruschetta',
    price: 299,
    category: 'Appetizers',
    description: 'Grilled bread with tomato, basil, and garlic',
    available: true,
    image: 'https://images.pexels.com/photos/8951346/pexels-photo-8951346.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '2',
    name: 'Caesar Salad',
    price: 399,
    category: 'Appetizers',
    description: 'Fresh romaine lettuce with Caesar dressing',
    available: true,
    image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  
  // Main Course
  {
    id: '3',
    name: 'Margherita Pizza',
    price: 599,
    category: 'Main Course',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    available: true,
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '4',
    name: 'Grilled Chicken',
    price: 799,
    category: 'Main Course',
    description: 'Herb-marinated grilled chicken breast',
    available: true,
    image: 'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '5',
    name: 'Pasta Carbonara',
    price: 699,
    category: 'Main Course',
    description: 'Creamy pasta with bacon and parmesan',
    available: false,
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  
  // Beverages
  {
    id: '6',
    name: 'Fresh Orange Juice',
    price: 199,
    category: 'Beverages',
    description: 'Freshly squeezed orange juice',
    available: true,
    image: 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '7',
    name: 'Cappuccino',
    price: 249,
    category: 'Beverages',
    description: 'Espresso with steamed milk foam',
    available: true,
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  
  // Desserts
  {
    id: '8',
    name: 'Tiramisu',
    price: 399,
    category: 'Desserts',
    description: 'Classic Italian dessert with coffee and mascarpone',
    available: true,
    image: 'https://images.pexels.com/photos/6419728/pexels-photo-6419728.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '9',
    name: 'Chocolate Lava Cake',
    price: 349,
    category: 'Desserts',
    description: 'Warm chocolate cake with molten center',
    available: true,
    image: 'https://images.pexels.com/photos/8629864/pexels-photo-8629864.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

export const mockOrders = [
  {
    id: 'ORD-1001',
    customerName: 'John Smith',
    phone: '+91-9876543210',
    type: 'dine-in',
    tableNumber: '5',
    items: [
      { id: '3', name: 'Margherita Pizza', price: 599, quantity: 2 },
      { id: '7', name: 'Cappuccino', price: 249, quantity: 2 }
    ],
    total: 1696,
    status: 'preparing',
    createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
    outlet: 'outlet-1'
  },
  {
    id: 'ORD-1002',
    customerName: 'Emma Wilson',
    phone: '+91-9876543211',
    type: 'takeaway',
    items: [
      { id: '4', name: 'Grilled Chicken', price: 799, quantity: 1 },
      { id: '1', name: 'Bruschetta', price: 299, quantity: 1 }
    ],
    total: 1098,
    status: 'ready',
    createdAt: new Date(Date.now() - 900000), // 15 minutes ago
    outlet: 'outlet-1'
  },
  {
    id: 'ORD-1003',
    customerName: 'Mike Johnson',
    phone: '+91-9876543212',
    type: 'delivery',
    address: '123 Main St, Downtown',
    items: [
      { id: '8', name: 'Tiramisu', price: 399, quantity: 3 }
    ],
    total: 1197,
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    outlet: 'outlet-1'
  }
];

export const mockInventory = [
  {
    id: 'inv-1',
    name: 'Tomatoes',
    category: 'Vegetables',
    currentStock: 25,
    minStock: 10,
    unit: 'kg',
    cost: 40,
    supplier: 'Fresh Farm Co.',
    lastUpdated: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    id: 'inv-2',
    name: 'Mozzarella Cheese',
    category: 'Dairy',
    currentStock: 5,
    minStock: 8,
    unit: 'kg',
    cost: 450,
    supplier: 'Dairy Fresh Ltd.',
    lastUpdated: new Date(Date.now() - 172800000) // 2 days ago
  },
  {
    id: 'inv-3',
    name: 'Chicken Breast',
    category: 'Meat',
    currentStock: 15,
    minStock: 5,
    unit: 'kg',
    cost: 280,
    supplier: 'Premium Meats',
    lastUpdated: new Date()
  },
  {
    id: 'inv-4',
    name: 'Coffee Beans',
    category: 'Beverages',
    currentStock: 3,
    minStock: 5,
    unit: 'kg',
    cost: 1200,
    supplier: 'Coffee Masters',
    lastUpdated: new Date(Date.now() - 43200000) // 12 hours ago
  },
  {
    id: 'inv-5',
    name: 'Pasta',
    category: 'Grains',
    currentStock: 20,
    minStock: 8,
    unit: 'kg',
    cost: 120,
    supplier: 'Italian Imports',
    lastUpdated: new Date(Date.now() - 259200000) // 3 days ago
  }
];

export const mockOutlets = [
  {
    id: 'outlet-1',
    name: 'Downtown Branch',
    address: '123 Main Street, Downtown',
    phone: '+91-11-12345678',
    manager: 'Sarah Johnson',
    status: 'active'
  },
  {
    id: 'outlet-2',
    name: 'Mall Branch',
    address: '456 Shopping Mall, Level 2',
    phone: '+91-11-87654321',
    manager: 'David Lee',
    status: 'active'
  },
  {
    id: 'outlet-3',
    name: 'Airport Branch',
    address: 'Terminal 1, International Airport',
    phone: '+91-11-11223344',
    manager: 'Lisa Chen',
    status: 'active'
  }
];

export const mockUsers = [
  {
    id: 'user-1',
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@restaurant.com'
  },
  {
    id: 'user-2',
    username: 'cashier',
    password: 'cashier123',
    name: 'John Cashier',
    role: 'cashier',
    email: 'cashier@restaurant.com'
  },
  {
    id: 'user-3',
    username: 'kitchen',
    password: 'kitchen123',
    name: 'Mary Kitchen',
    role: 'kitchen',
    email: 'kitchen@restaurant.com'
  }
];