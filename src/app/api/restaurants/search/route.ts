import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface MenuSearchRequest {
    query?: string           // General search term
    restaurant?: string      // Specific restaurant name
    category?: string        // burger, chicken, pizza, etc.
    maxPrice?: number        // Budget constraint
    limit?: number
}

const MENU_PROMPT = `You are an expert on South African fast food restaurant menus. Generate realistic menu items based on the search request.

CRITICAL RULES:
1. IF A RESTAURANT IS NAMED (e.g., McDonald's), YOU MUST ONLY RETURN ITEMS FROM THAT SPECIFIC RESTAURANT. Do not include items from other places.
2. USE EXACT MENU ITEM NAMES. Do not invent generic names like "Classic Burger" or "Chicken Burger" unless that is the actual name on the menu.
   - Bad: "Delicious Beef Burger"
   - Good: "Big Mac", "Quarter Pounder with Cheese"
3. Use REALISTIC South African Rand (ZAR) prices (Dec 2024 estimates).
4. RESPECT the maxPrice budget - never return items above it.
5. If the user asks for "McDonald's burgers", ONLY show burgers. If "KFC chicken", ONLY show chicken.

RESTAURANT KNOWLEDGE BASE (Use these specific items):

[MCDONALD'S]
- Burgers: Big Mac (R59.90), McFeast (R54.90), Quarter Pounder with Cheese (R57.90), McChicken (R44.90), Cheeseburger (R29.90), Double Cheeseburger (R44.90), Hamburger (R24.90), Grand Chicken Hot/Classic (R74.90), Boerie Burger (R49.90)
- Sides/Other: 6pc McNuggets (R49.90), 10pc McNuggets (R69.90), Large Fries (R34.90), McFlurry Oreo (R34.90), Happy Meal (R59.90)

[KFC]
- Chicken: Streetwise Two (R42.90), Streetwise Three (R64.90), Streetwise Five (R109.90), 6pc Dunked Wings (R74.90), 10pc Dunked Wings (R114.90), 4pc Zinger Wings (R44.90)
- Burgers: Zinger Burger (R54.90), Colonel Burger (R49.90), Boxmaster (R69.90), Double Crunch Burger (R64.90)
- Buckets: 9 Piece Bucket (R189.90), 15 Piece Bucket (R299.90)

[STEERS]
- Burgers: Wacky Wednesday (2 Burgers for R70 / R35 each), King Steer Burger (R89.90), Classic Burger (R64.90), Rave Burger (R74.90), Ribster Burger (R79.90), Prince Burger (R49.90), Bacon & Cheese Burger (R84.90)
- Chips: Medium Chips (R29.90), Large Chips (R39.90)

[NANDO'S]
- Chicken: 1/4 Chicken (R59.90), 1/2 Chicken (R99.90), Full Chicken (R179.90)
- Burgers/Pitas: Chicken Burger (R79.90), Chicken Pita (R79.90), Chicken Wrap (R84.90)
- Platters: Full Platter (1 Full Chicken + 2 Large Sides) (R329.90)

[DEBONAIRS]
- Pizzas: Small Real Deal (R49.90), Medium Real Deal (R69.90), Something Meaty (Med R99.90), Triple-Decker (Med R129.90), Crammed Crust (Lrg R159.90), On The Double (2 Large Pizzas) (R189.90)

[CHICKEN LICKEN]
- Wings: Hot Wings 6pc (R54.90), Hot Wings 12pc (R99.90), Hot Wings 24pc (R189.90)
- Soul Food: Soul Food Box (R79.90), Love Me Tender (R44.90)
- Burgers: Big John (R39.90), Soulfire (R44.90)

[WIMPY]
- Burgers: Wimpy Burger (R64.90), Cheese Burger (R74.90), Bacon & Cheese Burger (R89.90), Champion Burger (R99.90)
- Breakfast: Wimpy Breakfast (R59.90), Mega Breakfast (R94.90)

[ROMAN'S PIZZA]
- Pizzas (Double prices): 2 x Small (R99), 2 x Medium (R139), 2 x Large (R169) - show single price equivalent like ~R70 for medium

OUTPUT FORMAT (JSON array of objects):
[{"name": "Big Mac", "restaurant": "McDonald's", "price": 59.90, "description": "Two 100% beef patties...", "category": "burger", "eta": "20m", "platforms": ["Uber Eats"]}]

Return ONLY valid JSON. No generic "Cheeseburger" unless it is the specific correct name. Default to "Uber Eats" and "Mr D" for platforms.`

export async function POST(request: NextRequest) {
    try {
        const body: MenuSearchRequest = await request.json()
        const { query, restaurant, category, maxPrice = 500, limit = 8 } = body

        // 1. Try fetching from Supabase Database first
        if (restaurant) {
            let dbQuery = supabase
                .from('menu_items')
                .select(`
                    id, name, description, price, category, image_url,
                    restaurant:restaurants!inner(name, slug)
                `)
                .eq('restaurant.slug', restaurant)
                .lte('price', maxPrice)

            if (category) {
                dbQuery = dbQuery.eq('category', category)
            }

            const { data: dbItems, error } = await dbQuery

            if (!error && dbItems && dbItems.length > 0) {
                const products = dbItems.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    store: item.restaurant.name,
                    price: item.price,
                    description: item.description,
                    category: item.category,
                    eta: '20-30 min', // Default for now
                    platforms: ['Uber Eats', 'Mr D'],
                    image: item.image_url
                }))

                return NextResponse.json({
                    products,
                    total: products.length,
                    source: 'database',
                    query: { restaurant, category, maxPrice }
                })
            }
        }

        // 2. Fallback to AI Generation if no DB data found or no specific restaurant
        if (!process.env.GEMINI_API_KEY) {
            // Return fallback mock data if no API key
            return NextResponse.json({
                products: getFallbackMenu(restaurant, category, maxPrice, limit),
                source: 'fallback'
            })
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

        // Build the search request
        let searchRequest = `Generate ${limit} menu items`
        if (restaurant) searchRequest += ` from ${restaurant} only`
        if (category) searchRequest += ` in the ${category} category`
        if (query) searchRequest += ` matching "${query}"`
        searchRequest += `. Maximum price: R${maxPrice}.`

        const prompt = `${MENU_PROMPT}\n\nSearch Request: ${searchRequest}`

        const result = await model.generateContent(prompt)
        const response = await result.response
        let text = response.text()

        // Clean up the response - remove markdown code blocks if present
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

        try {
            const menuItems = JSON.parse(text)

            // Transform to standard product format
            const products = menuItems.map((item: any, i: number) => ({
                id: `ai_${Date.now()}_${i}`,
                name: item.name,
                store: item.restaurant,
                price: item.price,
                description: item.description,
                category: item.category,
                eta: item.eta || '25m',
                platforms: item.platforms || ['Uber Eats', 'Mr D'],
                // Use placeholder image - in production, could use image generation
                image: getImageForCategory(item.category)
            }))

            return NextResponse.json({
                products,
                total: products.length,
                source: 'ai',
                query: { restaurant, category, maxPrice }
            })

        } catch (parseError) {
            console.error('[AI Menu] Parse error:', parseError, 'Raw:', text)
            return NextResponse.json({
                products: getFallbackMenu(restaurant, category, maxPrice, limit),
                source: 'fallback',
                parseError: true
            })
        }

    } catch (error) {
        console.error('[AI Menu] Error:', error)
        return NextResponse.json({
            error: 'Failed to generate menu',
            details: String(error)
        }, { status: 500 })
    }
}

function getImageForCategory(category: string): string {
    const images: Record<string, string> = {
        burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
        chicken: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200&h=200&fit=crop',
        pizza: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
        sides: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop',
        drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop',
        combo: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&h=200&fit=crop'
    }
    return images[category] || images.burger
}

function getFallbackMenu(restaurant?: string, category?: string, maxPrice?: number, limit?: number): any[] {
    const allItems = [
        { id: 'f1', name: 'Big Mac', store: "McDonald's", price: 59.90, category: 'burger', eta: '20m' },
        { id: 'f2', name: 'McFeast', store: "McDonald's", price: 54.90, category: 'burger', eta: '20m' },
        { id: 'f3', name: 'McChicken', store: "McDonald's", price: 44.90, category: 'burger', eta: '20m' },
        { id: 'f4', name: 'Streetwise Two', store: 'KFC', price: 42.90, category: 'chicken', eta: '20m' },
        { id: 'f5', name: 'Zinger Burger', store: 'KFC', price: 54.90, category: 'burger', eta: '20m' },
        { id: 'f6', name: 'Quarter Chicken', store: "Nando's", price: 59.90, category: 'chicken', eta: '25m' },
        { id: 'f7', name: 'Wacky Wednesday', store: 'Steers', price: 34.90, category: 'burger', eta: '25m' },
        { id: 'f8', name: 'Something Meaty', store: 'Debonairs', price: 99.00, category: 'pizza', eta: '30m' },
        { id: 'f9', name: 'Hot Wings 6pc', store: 'Chicken Licken', price: 54.90, category: 'chicken', eta: '20m' },
    ]

    let filtered = allItems
    if (restaurant) {
        const restLower = restaurant.toLowerCase()
        filtered = filtered.filter(item => item.store.toLowerCase().includes(restLower))
    }
    if (category) {
        filtered = filtered.filter(item => item.category === category)
    }
    if (maxPrice) {
        filtered = filtered.filter(item => item.price < maxPrice)
    }

    return filtered.slice(0, limit || 8).map(item => ({
        ...item,
        image: getImageForCategory(item.category)
    }))
}
