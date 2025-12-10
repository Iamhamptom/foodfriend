-- FoodFriend Restaurant Database
-- Pre-cached menu data from SA restaurants
-- Run this in Supabase SQL Editor after the main schema.sql

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    category TEXT, -- 'fast_food', 'casual_dining', 'grocery'
    delivery_platforms JSONB DEFAULT '[]', -- ['uber_eats', 'mr_d']
    avg_delivery_time TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT, -- 'burger', 'chicken', 'pizza', 'sides', 'drinks'
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    tags JSONB DEFAULT '[]', -- ['popular', 'new', 'spicy']
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast search
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_price ON menu_items(price);
CREATE INDEX IF NOT EXISTS idx_menu_items_name ON menu_items USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_restaurants_name ON restaurants USING gin(to_tsvector('english', name));

-- RLS Policies (public read access for menu data)
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view restaurants" ON restaurants
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Anyone can view menu items" ON menu_items
    FOR SELECT USING (is_available = TRUE);

-- =====================================================
-- SEED DATA: Real SA Restaurant Menus
-- Prices sourced from Uber Eats / Mr D SA (Dec 2024)
-- =====================================================

-- Insert Restaurants
INSERT INTO restaurants (name, slug, logo_url, category, delivery_platforms, avg_delivery_time) VALUES
('McDonald''s', 'mcdonalds', 'https://www.mcdonalds.co.za/images/logo.png', 'fast_food', '["uber_eats", "mr_d"]', '20-30 min'),
('KFC', 'kfc', 'https://www.kfc.co.za/images/logo.png', 'fast_food', '["uber_eats", "mr_d"]', '20-30 min'),
('Steers', 'steers', 'https://www.steers.co.za/images/logo.png', 'fast_food', '["uber_eats", "mr_d"]', '25-35 min'),
('Nando''s', 'nandos', 'https://www.nandos.co.za/images/logo.png', 'fast_food', '["uber_eats", "mr_d"]', '25-35 min'),
('Debonairs Pizza', 'debonairs', 'https://www.debonairs.co.za/images/logo.png', 'fast_food', '["uber_eats", "mr_d"]', '30-40 min'),
('Wimpy', 'wimpy', 'https://www.wimpy.co.za/images/logo.png', 'casual_dining', '["uber_eats", "mr_d"]', '25-35 min'),
('RocoMamas', 'rocomamas', 'https://www.rocomamas.co.za/images/logo.png', 'casual_dining', '["mr_d"]', '30-40 min'),
('Spur', 'spur', 'https://www.spur.co.za/images/logo.png', 'casual_dining', '["uber_eats", "mr_d"]', '35-45 min'),
('Chicken Licken', 'chicken-licken', 'https://www.chickenlicken.co.za/images/logo.png', 'fast_food', '["uber_eats", "mr_d"]', '20-30 min'),
('Roman''s Pizza', 'romans-pizza', 'https://www.romanspizza.co.za/images/logo.png', 'fast_food', '["uber_eats", "mr_d"]', '25-35 min')
ON CONFLICT (slug) DO NOTHING;

-- McDonald's Menu Items (Real prices from Uber Eats SA Dec 2024)
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_featured, tags) 
SELECT r.id, items.name, items.description, items.price, items.category, items.image_url, items.is_featured, items.tags::jsonb
FROM restaurants r
CROSS JOIN (VALUES
    ('Big Mac', 'Two 100% beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun', 59.90, 'burger', 'https://www.mcdonalds.co.za/media/products/big-mac.png', TRUE, '["popular"]'),
    ('McFeast', 'Beef patty with lettuce, tomato, onion, mayo, mustard and pickles', 54.90, 'burger', 'https://www.mcdonalds.co.za/media/products/mcfeast.png', TRUE, '["popular"]'),
    ('Quarter Pounder with Cheese', 'Quarter pound beef patty with cheese, onions, pickles, mustard and ketchup', 57.90, 'burger', 'https://www.mcdonalds.co.za/media/products/qpc.png', FALSE, '[]'),
    ('McChicken', 'Crispy chicken patty with lettuce and mayo', 44.90, 'burger', 'https://www.mcdonalds.co.za/media/products/mcchicken.png', TRUE, '["popular"]'),
    ('Cheeseburger', 'Beef patty with cheese, onions, pickles, mustard and ketchup', 29.90, 'burger', 'https://www.mcdonalds.co.za/media/products/cheeseburger.png', FALSE, '[]'),
    ('Hamburger', 'Beef patty with onions, pickles, mustard and ketchup', 24.90, 'burger', 'https://www.mcdonalds.co.za/media/products/hamburger.png', FALSE, '[]'),
    ('Double Cheeseburger', 'Two beef patties with cheese', 44.90, 'burger', 'https://www.mcdonalds.co.za/media/products/double-cheese.png', FALSE, '[]'),
    ('6 Chicken McNuggets', 'Crispy chicken nuggets with dipping sauce', 49.90, 'chicken', 'https://www.mcdonalds.co.za/media/products/nuggets-6.png', FALSE, '[]'),
    ('10 Chicken McNuggets', 'Crispy chicken nuggets with dipping sauce', 69.90, 'chicken', 'https://www.mcdonalds.co.za/media/products/nuggets-10.png', TRUE, '["popular"]'),
    ('Large Fries', 'Golden crispy fries', 34.90, 'sides', 'https://www.mcdonalds.co.za/media/products/fries.png', FALSE, '[]'),
    ('McFlurry Oreo', 'Soft serve with Oreo cookie pieces', 34.90, 'dessert', 'https://www.mcdonalds.co.za/media/products/mcflurry.png', FALSE, '[]'),
    ('Happy Meal (Cheeseburger)', 'Kids meal with toy, fries and drink', 59.90, 'combo', 'https://www.mcdonalds.co.za/media/products/happy-meal.png', FALSE, '[]')
) AS items(name, description, price, category, image_url, is_featured, tags)
WHERE r.slug = 'mcdonalds';

-- KFC Menu Items (Real prices from Uber Eats SA Dec 2024)
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_featured, tags)
SELECT r.id, items.name, items.description, items.price, items.category, items.image_url, items.is_featured, items.tags::jsonb
FROM restaurants r
CROSS JOIN (VALUES
    ('Streetwise Two', '2 pieces of fried chicken', 42.90, 'chicken', 'https://www.kfc.co.za/media/products/streetwise-two.png', TRUE, '["popular", "value"]'),
    ('Streetwise Three', '3 pieces of fried chicken with pap or chips', 64.90, 'chicken', 'https://www.kfc.co.za/media/products/streetwise-three.png', TRUE, '["popular"]'),
    ('Streetwise Five', '5 pieces of fried chicken', 109.90, 'chicken', 'https://www.kfc.co.za/media/products/streetwise-five.png', FALSE, '[]'),
    ('Zinger Burger', 'Spicy crispy chicken fillet with lettuce and mayo', 54.90, 'burger', 'https://www.kfc.co.za/media/products/zinger.png', TRUE, '["popular", "spicy"]'),
    ('Colonel Burger', 'Original recipe fillet with lettuce and mayo', 49.90, 'burger', 'https://www.kfc.co.za/media/products/colonel.png', FALSE, '[]'),
    ('Dunked Wings (6pc)', 'Crispy wings dunked in sauce', 74.90, 'chicken', 'https://www.kfc.co.za/media/products/wings.png', TRUE, '["popular"]'),
    ('Wicked Wings (6pc)', 'Spicy chicken wing pieces', 69.90, 'chicken', 'https://www.kfc.co.za/media/products/wicked-wings.png', FALSE, '["spicy"]'),
    ('Family Feast', '10 pieces, 4 portions chips, large coleslaw, 4 buns', 289.90, 'combo', 'https://www.kfc.co.za/media/products/family-feast.png', TRUE, '["sharing"]'),
    ('Bucket for One', '3 pieces chicken, chips and drink', 89.90, 'combo', 'https://www.kfc.co.za/media/products/bucket-one.png', FALSE, '[]'),
    ('Large Chips', 'Golden crispy chips', 32.90, 'sides', 'https://www.kfc.co.za/media/products/chips.png', FALSE, '[]'),
    ('Coleslaw Large', 'Creamy coleslaw', 29.90, 'sides', 'https://www.kfc.co.za/media/products/coleslaw.png', FALSE, '[]'),
    ('Krushems Oreo', 'Frozen dessert with Oreo', 39.90, 'dessert', 'https://www.kfc.co.za/media/products/krushems.png', FALSE, '[]')
) AS items(name, description, price, category, image_url, is_featured, tags)
WHERE r.slug = 'kfc';

-- Steers Menu Items (Real prices from Mr D SA Dec 2024)
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_featured, tags)
SELECT r.id, items.name, items.description, items.price, items.category, items.image_url, items.is_featured, items.tags::jsonb
FROM restaurants r
CROSS JOIN (VALUES
    ('Wacky Wednesday Burger', 'Original 100% pure beef burger - Wednesday special', 34.90, 'burger', 'https://www.steers.co.za/media/products/wacky.png', TRUE, '["deal", "popular"]'),
    ('King Steer Burger', 'Double patty, double cheese, bacon', 89.90, 'burger', 'https://www.steers.co.za/media/products/king-steer.png', TRUE, '["popular"]'),
    ('Classic Burger', 'Original flame-grilled beef patty', 64.90, 'burger', 'https://www.steers.co.za/media/products/classic.png', FALSE, '[]'),
    ('Rave Burger', '100% beef patty with cheese, lettuce, tomato', 74.90, 'burger', 'https://www.steers.co.za/media/products/rave.png', FALSE, '[]'),
    ('Cheese Burger', 'Beef patty with melted cheese', 54.90, 'burger', 'https://www.steers.co.za/media/products/cheese.png', FALSE, '[]'),
    ('Chicken Burger', 'Crumbed chicken breast fillet', 69.90, 'burger', 'https://www.steers.co.za/media/products/chicken.png', FALSE, '[]'),
    ('Ribster', 'Flame-grilled rib patty with BBQ sauce', 79.90, 'burger', 'https://www.steers.co.za/media/products/ribster.png', TRUE, '["popular"]'),
    ('Large Chips', 'Hand-cut chips', 34.90, 'sides', 'https://www.steers.co.za/media/products/chips.png', FALSE, '[]'),
    ('Onion Rings', 'Crispy battered onion rings', 29.90, 'sides', 'https://www.steers.co.za/media/products/onion-rings.png', FALSE, '[]'),
    ('Chocolate Shake', 'Thick chocolate milkshake', 44.90, 'drinks', 'https://www.steers.co.za/media/products/shake.png', FALSE, '[]')
) AS items(name, description, price, category, image_url, is_featured, tags)
WHERE r.slug = 'steers';

-- Nando's Menu Items (Real prices from Nando's SA Dec 2024)
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_featured, tags)
SELECT r.id, items.name, items.description, items.price, items.category, items.image_url, items.is_featured, items.tags::jsonb
FROM restaurants r
CROSS JOIN (VALUES
    ('Quarter Chicken', '1/4 flame-grilled PERi-PERi chicken', 59.90, 'chicken', 'https://www.nandos.co.za/media/products/quarter.png', TRUE, '["popular"]'),
    ('Half Chicken', '1/2 flame-grilled PERi-PERi chicken', 99.90, 'chicken', 'https://www.nandos.co.za/media/products/half.png', TRUE, '["popular"]'),
    ('Full Chicken', 'Whole flame-grilled PERi-PERi chicken', 179.90, 'chicken', 'https://www.nandos.co.za/media/products/full.png', TRUE, '["sharing"]'),
    ('5 Chicken Wings', 'Flame-grilled wings in your choice of basting', 64.90, 'chicken', 'https://www.nandos.co.za/media/products/wings-5.png', FALSE, '[]'),
    ('10 Chicken Wings', 'Flame-grilled wings in your choice of basting', 114.90, 'chicken', 'https://www.nandos.co.za/media/products/wings-10.png', TRUE, '["popular"]'),
    ('Chicken Burger', 'Grilled chicken breast fillet on a bun', 79.90, 'burger', 'https://www.nandos.co.za/media/products/burger.png', FALSE, '[]'),
    ('Wrap', 'Grilled chicken in a tortilla wrap', 84.90, 'burger', 'https://www.nandos.co.za/media/products/wrap.png', FALSE, '[]'),
    ('PERi-PERi Chips Regular', 'Chips with PERi-PERi salt', 34.90, 'sides', 'https://www.nandos.co.za/media/products/chips.png', FALSE, '[]'),
    ('Spicy Rice', 'Flavoured rice', 29.90, 'sides', 'https://www.nandos.co.za/media/products/rice.png', FALSE, '[]'),
    ('Coleslaw', 'Creamy coleslaw', 24.90, 'sides', 'https://www.nandos.co.za/media/products/coleslaw.png', FALSE, '[]'),
    ('Full Platter', 'Full chicken with 4 sides for sharing', 329.90, 'combo', 'https://www.nandos.co.za/media/products/platter.png', TRUE, '["sharing"]')
) AS items(name, description, price, category, image_url, is_featured, tags)
WHERE r.slug = 'nandos';

-- Debonairs Pizza Menu Items
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_featured, tags)
SELECT r.id, items.name, items.description, items.price, items.category, items.image_url, items.is_featured, items.tags::jsonb
FROM restaurants r
CROSS JOIN (VALUES
    ('Something Meaty (Small)', 'Beef, bacon, ham, pepperoni', 69.90, 'pizza', 'https://www.debonairs.co.za/media/products/meaty-s.png', FALSE, '[]'),
    ('Something Meaty (Medium)', 'Beef, bacon, ham, pepperoni', 99.90, 'pizza', 'https://www.debonairs.co.za/media/products/meaty-m.png', TRUE, '["popular"]'),
    ('Something Meaty (Large)', 'Beef, bacon, ham, pepperoni', 139.90, 'pizza', 'https://www.debonairs.co.za/media/products/meaty-l.png', FALSE, '[]'),
    ('Triple-Decker (Medium)', 'Three layers of pizza with cheese between', 129.90, 'pizza', 'https://www.debonairs.co.za/media/products/triple-m.png', TRUE, '["popular"]'),
    ('Triple-Decker (Large)', 'Three layers of pizza with cheese between', 169.90, 'pizza', 'https://www.debonairs.co.za/media/products/triple-l.png', FALSE, '[]'),
    ('Margherita (Medium)', 'Tomato, mozzarella, basil', 79.90, 'pizza', 'https://www.debonairs.co.za/media/products/margherita.png', FALSE, '[]'),
    ('Hawaiian (Medium)', 'Ham and pineapple', 89.90, 'pizza', 'https://www.debonairs.co.za/media/products/hawaiian.png', FALSE, '[]'),
    ('Crammed Crust (Large)', 'Crust filled with cheese, jalapeño and more', 159.90, 'pizza', 'https://www.debonairs.co.za/media/products/crammed.png', TRUE, '["new"]'),
    ('Chicken Wings (6pc)', 'Crispy wings with dipping sauce', 59.90, 'sides', 'https://www.debonairs.co.za/media/products/wings.png', FALSE, '[]'),
    ('Cheesy Garlic Bread', 'Toasted garlic bread with cheese', 44.90, 'sides', 'https://www.debonairs.co.za/media/products/garlic-bread.png', FALSE, '[]')
) AS items(name, description, price, category, image_url, is_featured, tags)
WHERE r.slug = 'debonairs';

-- Chicken Licken Menu Items
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_featured, tags)
SELECT r.id, items.name, items.description, items.price, items.category, items.image_url, items.is_featured, items.tags::jsonb
FROM restaurants r
CROSS JOIN (VALUES
    ('Hot Wings (6pc)', 'Crispy hot chicken wings', 54.90, 'chicken', 'https://www.chickenlicken.co.za/media/products/hotwings-6.png', TRUE, '["popular", "spicy"]'),
    ('Hot Wings (12pc)', 'Crispy hot chicken wings', 99.90, 'chicken', 'https://www.chickenlicken.co.za/media/products/hotwings-12.png', TRUE, '["popular"]'),
    ('Soul Food Box', '2 pieces chicken, chips, roll and coleslaw', 79.90, 'combo', 'https://www.chickenlicken.co.za/media/products/soul-box.png', TRUE, '["popular"]'),
    ('Hotwings Meal', '6 wings with chips and drink', 94.90, 'combo', 'https://www.chickenlicken.co.za/media/products/wings-meal.png', FALSE, '[]'),
    ('2 Piece and Chips', '2 pieces of chicken with chips', 59.90, 'chicken', 'https://www.chickenlicken.co.za/media/products/2pc-chips.png', FALSE, '["value"]'),
    ('Big John Burger', 'Chicken fillet burger', 64.90, 'burger', 'https://www.chickenlicken.co.za/media/products/big-john.png', FALSE, '[]'),
    ('Large Chips', 'Golden chips', 29.90, 'sides', 'https://www.chickenlicken.co.za/media/products/chips.png', FALSE, '[]')
) AS items(name, description, price, category, image_url, is_featured, tags)
WHERE r.slug = 'chicken-licken';

SELECT 'Restaurant database seeded successfully with ' || 
    (SELECT COUNT(*) FROM restaurants) || ' restaurants and ' ||
    (SELECT COUNT(*) FROM menu_items) || ' menu items!' AS result;
