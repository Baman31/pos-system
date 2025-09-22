/*
  # Restaurant POS Database Schema

  1. New Tables
    - `outlets` - Restaurant outlet/branch information
    - `users` - System users with role-based access
    - `categories` - Menu item categories
    - `menu_items` - Restaurant menu items
    - `inventory_items` - Inventory/stock management
    - `orders` - Customer orders
    - `order_items` - Items within each order
    - `payments` - Payment transactions
    - `customers` - Customer information for CRM

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure data access based on user roles and outlet ownership

  3. Features
    - Multi-outlet support with proper data isolation
    - Role-based permissions (admin, cashier, kitchen)
    - Real-time order tracking
    - Inventory management with low stock alerts
    - Customer relationship management
*/

-- Create outlets table
CREATE TABLE IF NOT EXISTS outlets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  phone text,
  manager_name text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'cashier', 'kitchen', 'manager')),
  outlet_id uuid REFERENCES outlets(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  outlet_id uuid REFERENCES outlets(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  outlet_id uuid REFERENCES outlets(id) ON DELETE CASCADE,
  image_url text,
  is_available boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  current_stock decimal(10,2) NOT NULL DEFAULT 0,
  min_stock decimal(10,2) NOT NULL DEFAULT 0,
  unit text NOT NULL,
  cost_per_unit decimal(10,2) NOT NULL,
  supplier text,
  outlet_id uuid REFERENCES outlets(id) ON DELETE CASCADE,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  address text,
  loyalty_points integer DEFAULT 0,
  total_orders integer DEFAULT 0,
  total_spent decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id),
  customer_name text,
  customer_phone text,
  order_type text NOT NULL CHECK (order_type IN ('dine-in', 'takeaway', 'delivery')),
  table_number text,
  delivery_address text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  subtotal decimal(10,2) NOT NULL,
  tax_amount decimal(10,2) NOT NULL DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  outlet_id uuid REFERENCES outlets(id) ON DELETE CASCADE,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id),
  item_name text NOT NULL,
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  special_instructions text,
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'card', 'upi', 'wallet')),
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for outlets
CREATE POLICY "Users can view outlets they belong to"
  ON outlets FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT outlet_id FROM users WHERE id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage outlets"
  ON outlets FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for users
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can manage users"
  ON users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for categories
CREATE POLICY "Users can view categories from their outlet"
  ON categories FOR SELECT
  TO authenticated
  USING (
    outlet_id IN (
      SELECT outlet_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins and managers can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
      AND (role = 'admin' OR outlet_id = categories.outlet_id)
    )
  );

-- Create policies for menu_items
CREATE POLICY "Users can view menu items from their outlet"
  ON menu_items FOR SELECT
  TO authenticated
  USING (
    outlet_id IN (
      SELECT outlet_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins and managers can manage menu items"
  ON menu_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
      AND (role = 'admin' OR outlet_id = menu_items.outlet_id)
    )
  );

-- Create policies for inventory_items
CREATE POLICY "Users can view inventory from their outlet"
  ON inventory_items FOR SELECT
  TO authenticated
  USING (
    outlet_id IN (
      SELECT outlet_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins, managers, and kitchen staff can manage inventory"
  ON inventory_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager', 'kitchen')
      AND (role = 'admin' OR outlet_id = inventory_items.outlet_id)
    )
  );

-- Create policies for customers
CREATE POLICY "All authenticated users can view customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "All authenticated users can manage customers"
  ON customers FOR ALL
  TO authenticated
  USING (true);

-- Create policies for orders
CREATE POLICY "Users can view orders from their outlet"
  ON orders FOR SELECT
  TO authenticated
  USING (
    outlet_id IN (
      SELECT outlet_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create and update orders from their outlet"
  ON orders FOR ALL
  TO authenticated
  USING (
    outlet_id IN (
      SELECT outlet_id FROM users WHERE id = auth.uid()
    )
  );

-- Create policies for order_items
CREATE POLICY "Users can view order items from their outlet orders"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE outlet_id IN (
        SELECT outlet_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage order items from their outlet orders"
  ON order_items FOR ALL
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE outlet_id IN (
        SELECT outlet_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Create policies for payments
CREATE POLICY "Users can view payments from their outlet orders"
  ON payments FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE outlet_id IN (
        SELECT outlet_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage payments from their outlet orders"
  ON payments FOR ALL
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE outlet_id IN (
        SELECT outlet_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_outlet_id ON users(outlet_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_outlet_id ON menu_items(outlet_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_outlet_id ON orders(outlet_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);

-- Create functions for automatic order numbering
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_sequence')::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1;

-- Create trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_outlets_updated_at BEFORE UPDATE ON outlets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();