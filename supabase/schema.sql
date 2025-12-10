-- FoodFriend Database Schema for Supabase
-- Run this in Supabase SQL Editor (supabase.com/dashboard > SQL Editor)

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- User roles enum
CREATE TYPE user_role AS ENUM ('user', 'brand', 'admin', 'super_admin');

-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role user_role DEFAULT 'user',
    phone TEXT,
    location TEXT,
    currency TEXT DEFAULT 'ZAR',
    weekly_budget DECIMAL(10,2),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brands (for advertisers/stores)
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    logo_url TEXT,
    website TEXT,
    phone TEXT,
    email TEXT,
    description TEXT,
    category TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, suspended
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals/Promotions
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    code TEXT,
    discount_percent DECIMAL(5,2),
    discount_amount DECIMAL(10,2),
    image_url TEXT,
    status TEXT DEFAULT 'active', -- active, paused, scheduled, ended
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    views INTEGER DEFAULT 0,
    uses INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    brand_id UUID REFERENCES brands(id),
    store_name TEXT,
    items JSONB,
    total_amount DECIMAL(10,2),
    commission_amount DECIMAL(10,2),
    status TEXT DEFAULT 'pending', -- pending, processing, completed, cancelled
    delivery_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support Tickets
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    subject TEXT NOT NULL,
    description TEXT,
    category TEXT, -- order, payment, account, other
    status TEXT DEFAULT 'open', -- open, in_progress, resolved, closed
    priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket Messages
CREATE TABLE ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id),
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences (diet, connected stores, etc.)
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    diet_preferences JSONB DEFAULT '[]',
    connected_stores JSONB DEFAULT '[]',
    notification_settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meal Plans
CREATE TABLE meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    week_start DATE,
    meals JSONB, -- {monday: {breakfast: {...}, lunch: {...}, dinner: {...}}, ...}
    family_size INTEGER DEFAULT 4,
    budget DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- Policies: Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policies: Anyone can view approved brands
CREATE POLICY "Anyone can view approved brands" ON brands
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Brand owners can manage their brand" ON brands
    FOR ALL USING (user_id = auth.uid());

-- Policies: Anyone can view active deals
CREATE POLICY "Anyone can view active deals" ON deals
    FOR SELECT USING (status = 'active');

-- Policies: Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (user_id = auth.uid());

-- Policies: Users can manage their own tickets
CREATE POLICY "Users can view own tickets" ON support_tickets
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets" ON support_tickets
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Policies: Users can manage their own preferences
CREATE POLICY "Users can manage own preferences" ON user_preferences
    FOR ALL USING (user_id = auth.uid());

-- Policies: Users can manage their own meal plans
CREATE POLICY "Users can manage own meal plans" ON meal_plans
    FOR ALL USING (user_id = auth.uid());

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
    
    INSERT INTO user_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert a default admin user (update this with your email after signup)
-- INSERT INTO profiles (id, email, name, role) 
-- VALUES ('your-user-id', 'tonydavidhampton@gmail.com', 'Admin', 'super_admin');

-- Success message
SELECT 'FoodFriend database schema created successfully!' AS message;
