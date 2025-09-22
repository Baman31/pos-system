const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Outlet = require('../models/Outlet');
const MenuItem = require('../models/MenuItem');
const InventoryItem = require('../models/InventoryItem');
const Customer = require('../models/Customer');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Outlet.deleteMany({}),
      MenuItem.deleteMany({}),
      InventoryItem.deleteMany({}),
      Customer.deleteMany({})
    ]);

    console.log('Cleared existing data');

    // Create outlets
    const outlets = await Outlet.create([
      {
        name: 'Downtown Branch',
        address: '123 Main Street, Downtown',
        phone: '+91-11-12345678',
        manager: 'Sarah Johnson',
        status: 'active'
      },
      {
        name: 'Mall Branch',
        address: '456 Shopping Mall, Level 2',
        phone: '+91-11-87654321',
        manager: 'David Lee',
        status: 'active'
      },
      {
        name: 'Airport Branch',
        address: 'Terminal 1, International Airport',
        phone: '+91-11-11223344',
        manager: 'Lisa Chen',
        status: 'active'
      }
    ]);

    console.log('Created outlets');

    // Create users
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@restaurant.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        outletId: outlets[0]._id
      },
      {
        username: 'cashier',
        email: 'cashier@restaurant.com',
        password: 'cashier123',
        name: 'John Cashier',
        role: 'cashier',
        outletId: outlets[0]._id
      },
      {
        username: 'kitchen',
        email: 'kitchen@restaurant.com',
        password: 'kitchen123',
        name: 'Mary Kitchen',
        role: 'kitchen',
        outletId: outlets[0]._id
      }
    ]);

    console.log('Created users');

    // Create menu items
    const menuItems = await MenuItem.create([
      // Appetizers
      {
        name: 'Bruschetta',
        description: 'Grilled bread with tomato, basil, and garlic',
        price: 299,
        category: 'Appetizers',
        outletId: outlets[0]._id,
        image: 'https://images.pexels.com/photos/8951346/pexels-photo-8951346.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: true,
        isVegetarian: true
      },
      {
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with Caesar dressing',
        price: 399,
        category: 'Appetizers',
        outletId: outlets[0]._id,
        image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: true,
        isVegetarian: true
      },
      
      // Main Course
      {
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 599,
        category: 'Main Course',
        outletId: outlets[0]._id,
        image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: true,
        isVegetarian: true
      },
      {
        name: 'Grilled Chicken',
        description: 'Herb-marinated grilled chicken breast',
        price: 799,
        category: 'Main Course',
        outletId: outlets[0]._id,
        image: 'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: true
      },
      {
        name: 'Pasta Carbonara',
        description: 'Creamy pasta with bacon and parmesan',
        price: 699,
        category: 'Main Course',
        outletId: outlets[0]._id,
        image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: false
      },
      
      // Beverages
      {
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        price: 199,
        category: 'Beverages',
        outletId: outlets[0]._id,
        image: 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: true,
        isVegetarian: true,
        isVegan: true
      },
      {
        name: 'Cappuccino',
        description: 'Espresso with steamed milk foam',
        price: 249,
        category: 'Beverages',
        outletId: outlets[0]._id,
        image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: true,
        isVegetarian: true
      },
      
      // Desserts
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee and mascarpone',
        price: 399,
        category: 'Desserts',
        outletId: outlets[0]._id,
        image: 'https://images.pexels.com/photos/6419728/pexels-photo-6419728.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: true,
        isVegetarian: true
      },
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center',
        price: 349,
        category: 'Desserts',
        outletId: outlets[0]._id,
        image: 'https://images.pexels.com/photos/8629864/pexels-photo-8629864.jpeg?auto=compress&cs=tinysrgb&w=300',
        available: true,
        isVegetarian: true
      }
    ]);

    console.log('Created menu items');

    // Create inventory items
    const inventoryItems = await InventoryItem.create([
      {
        name: 'Tomatoes',
        category: 'Vegetables',
        currentStock: 25,
        minStock: 10,
        unit: 'kg',
        cost: 40,
        supplier: {
          name: 'Fresh Farm Co.',
          contact: '+91-9876543210'
        },
        outletId: outlets[0]._id
      },
      {
        name: 'Mozzarella Cheese',
        category: 'Dairy',
        currentStock: 5,
        minStock: 8,
        unit: 'kg',
        cost: 450,
        supplier: {
          name: 'Dairy Fresh Ltd.',
          contact: '+91-9876543211'
        },
        outletId: outlets[0]._id
      },
      {
        name: 'Chicken Breast',
        category: 'Meat',
        currentStock: 15,
        minStock: 5,
        unit: 'kg',
        cost: 280,
        supplier: {
          name: 'Premium Meats',
          contact: '+91-9876543212'
        },
        outletId: outlets[0]._id
      },
      {
        name: 'Coffee Beans',
        category: 'Beverages',
        currentStock: 3,
        minStock: 5,
        unit: 'kg',
        cost: 1200,
        supplier: {
          name: 'Coffee Masters',
          contact: '+91-9876543213'
        },
        outletId: outlets[0]._id
      },
      {
        name: 'Pasta',
        category: 'Grains',
        currentStock: 20,
        minStock: 8,
        unit: 'kg',
        cost: 120,
        supplier: {
          name: 'Italian Imports',
          contact: '+91-9876543214'
        },
        outletId: outlets[0]._id
      }
    ]);

    console.log('Created inventory items');

    // Create sample customers
    const customers = await Customer.create([
      {
        name: 'John Smith',
        phone: '+91-9876543210',
        email: 'john@example.com',
        loyaltyPoints: 150,
        totalOrders: 5,
        totalSpent: 2500
      },
      {
        name: 'Emma Wilson',
        phone: '+91-9876543211',
        email: 'emma@example.com',
        loyaltyPoints: 89,
        totalOrders: 3,
        totalSpent: 1800
      },
      {
        name: 'Mike Johnson',
        phone: '+91-9876543212',
        email: 'mike@example.com',
        loyaltyPoints: 45,
        totalOrders: 2,
        totalSpent: 1200
      }
    ]);

    console.log('Created customers');

    console.log('✅ Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin / admin123');
    console.log('Cashier: cashier / cashier123');
    console.log('Kitchen: kitchen / kitchen123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed script
connectDB().then(() => {
  seedData();
});