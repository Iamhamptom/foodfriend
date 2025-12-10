import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface MenuSearchRequest {
    query?: string           // General search term
    restaurant?: string      // Specific restaurant name
    category?: string        // burger, chicken, pizza, etc.
    maxPrice?: number        // Budget constraint
    limit?: number
}

const MENU_PROMPT = `You are an expert on South African fast food restaurant menus. Generate realistic menu items based on the search request.

IMPORTANT RULES:
1. ONLY return items from the specified restaurant if one is provided
2. Use REAL menu item names that actually exist at these restaurants
3. Use REALISTIC South African Rand (ZAR) prices - December 2024 prices
4. RESPECT the maxPrice budget - never return items above it
5. Include actual delivery platforms (Uber Eats, Mr D, Checkers Sixty60)

RESTAURANT KNOWLEDGE (use these as reference):
- McDonald's: Big Mac (R59), McFeast (R54), Quarter Pounder (R57), McChicken (R44), Cheeseburger (R29), McNuggets 6pc (R49)
- KFC: Streetwise Two (R42), Streetwise Three (R64), Zinger Burger (R54), Dunked Wings 6pc (R74), Colonel Burger (R49)
- Steers: Wacky Wednesday (R34), King Steer (R89), Classic Burger (R64), Rave Burger (R74), Ribster (R79)
- Nando's: Quarter Chicken (R59), Half Chicken (R99), Full Chicken (R179), 5 Wings (R64), 10 Wings (R114)
- Debonairs: Something Meaty Medium (R99), Triple-Decker Medium (R129), Margherita Medium (R79)
- Chicken Licken: Hot Wings 6pc (R54), Hot Wings 12pc (R99), Soul Food Box (R79)

OUTPUT FORMAT (JSON array):
[
  {
    "name": "Menu item name",
    "restaurant": "Restaurant name",
    "price": 59.90,
    "description": "Brief description",
    "category": "burger|chicken|pizza|sides|drinks|combo",
    "platforms": ["Uber Eats", "Mr D"],
    "eta": "20-30 min"
  }
]

Return ONLY valid JSON, no markdown or explanation.`

export async function POST(request: NextRequest) {
    try {
        const body: MenuSearchRequest = await request.json()
        const { query, restaurant, category, maxPrice = 500, limit = 8 } = body

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
