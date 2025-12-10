-- McDonald's Menu Seed Data (20 Items)
-- Generated from localized data extraction
-- Run this in Supabase SQL Editor

-- First, ensure McDonald's exists in restaurants table
INSERT INTO restaurants (name, slug, logo_url, category, delivery_platforms, avg_delivery_time)
VALUES (
    'McDonald''s', 
    'mcdonalds', 
    'https://www.mcdonalds.co.za/images/logo.png', 
    'fast_food', 
    '["uber_eats", "mr_d"]', 
    '20-30 min'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Menu Items
WITH restaurant AS (SELECT id FROM restaurants WHERE slug = 'mcdonalds')
INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_featured)
SELECT 
    restaurant.id, 
    items.name, 
    'Classic McDonald''s favorite', -- Default description
    items.price, 
    items.category, 
    items.image_url, 
    items.is_featured
FROM restaurant
CROSS JOIN (VALUES
    ('Big Mac', 59.90, 'burger', 'https://d1ralsognjng37.cloudfront.net/695f329d-6927-4340-a316-52c679a9f21f.jpeg', TRUE),
    ('McFeast', 54.90, 'burger', 'https://d1ralsognjng37.cloudfront.net/a7a72382-32a2-4a0b-8d0f-48e0255a9b8f.jpeg', TRUE),
    ('Quarter Pounder with Cheese', 57.90, 'burger', 'https://d1ralsognjng37.cloudfront.net/45ae9418-e4b9-4bd9-92f7-02bf8696d5b1.jpeg', TRUE),
    ('McChicken', 44.90, 'burger', 'https://d1ralsognjng37.cloudfront.net/94f7136f-e2d4-42f8-a2df-9f5b61f2271a.jpeg', TRUE),
    ('Cheeseburger', 29.90, 'burger', 'https://d1ralsognjng37.cloudfront.net/f8d8396c-1123-455b-80a5-f8fc5e02e864.jpeg', FALSE),
    ('Double Cheeseburger', 44.90, 'burger', 'https://d1ralsognjng37.cloudfront.net/5139fbcc-1724-4f81-801a-5d07c0879659.jpeg', FALSE),
    ('Hamburger', 24.90, 'burger', 'https://d1ralsognjng37.cloudfront.net/e35f75ab-722a-44a6-8e50-4d431c9dd9b6.jpeg', FALSE),
    ('Grand Chicken Classic', 74.90, 'burger', 'https://d1ralsognjng37.cloudfront.net/a0eb7071-c052-40f8-9a67-c1cff5ad39bb.jpeg', TRUE),
    ('Boerie Burger', 49.90, 'burger', 'https://d1ralsognjng37.cloudfront.net/69b6181f-f1bb-4573-8b77-3e11f1857903.jpeg', FALSE),
    ('6 Chicken McNuggets', 49.90, 'chicken', 'https://d1ralsognjng37.cloudfront.net/efca01a9-b3a1-4ea7-9d62-a2769dcf468b.jpeg', TRUE),
    ('10 Chicken McNuggets', 69.90, 'chicken', 'https://d1ralsognjng37.cloudfront.net/cb4a2b97-8c3b-410a-b0a6-f286e680a6b7.jpeg', TRUE),
    ('20 Chicken McNuggets', 99.90, 'chicken', 'https://d1ralsognjng37.cloudfront.net/a765377f-1d9c-4903-a212-0051e84a29a3.jpeg', FALSE),
    ('Large Fries', 34.90, 'sides', 'https://d1ralsognjng37.cloudfront.net/1350a804-1b32-474c-87d5-a33ba9f03d6d.jpeg', TRUE),
    ('McFlurry Oreo', 34.90, 'dessert', 'https://d1ralsognjng37.cloudfront.net/a8972e7d-9273-41bb-9464-a032906d91cd.jpeg', TRUE),
    ('Happy Meal (Cheeseburger)', 59.90, 'combo', 'https://d1ralsognjng37.cloudfront.net/325785f7-f050-4de2-9f33-ce05822eabe5.jpeg', FALSE),
    ('Happy Meal (4 McNuggets)', 59.90, 'combo', 'https://d1ralsognjng37.cloudfront.net/06c278c2-31d7-4638-b718-d98c2ab2fec1.jpeg', FALSE),
    ('Coca-Cola 500ml', 22.90, 'drinks', 'https://d1ralsognjng37.cloudfront.net/3d938221-8280-49e0-84a5-b3e390c50d37.jpeg', FALSE),
    ('Fanta Orange 500ml', 22.90, 'drinks', 'https://d1ralsognjng37.cloudfront.net/1ea65268-52ae-40be-84f0-4dbf833a6104.jpeg', FALSE),
    ('Big Mac Meal (Large)', 89.90, 'combo', 'https://d1ralsognjng37.cloudfront.net/695f329d-6927-4340-a316-52c679a9f21f.jpeg', TRUE),
    ('McChicken Meal (Large)', 74.90, 'combo', 'https://d1ralsognjng37.cloudfront.net/94f7136f-e2d4-42f8-a2df-9f5b61f2271a.jpeg', TRUE)
) AS items(name, price, category, image_url, is_featured);

SELECT 'Inserted ' || COUNT(*) || ' menu items for McDonald''s' AS result FROM menu_items 
WHERE restaurant_id = (SELECT id FROM restaurants WHERE slug = 'mcdonalds');
