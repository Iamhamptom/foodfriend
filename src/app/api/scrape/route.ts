import { NextRequest, NextResponse } from 'next/server'
import { PnPScraper } from '@/lib/scrapers/pnp-scraper'
import { CheckersScraper } from '@/lib/scrapers/checkers-scraper'
import { UberEatsScraper } from '@/lib/scrapers/ubereats-scraper'
import { ScrapedProduct } from '@/lib/scrapers/base-scraper'

// Simple in-memory cache
const cache = new Map<string, { products: ScrapedProduct[], timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

interface ScrapeRequest {
    query: string
    stores?: string[] // ['pnp', 'checkers', 'ubereats']
    maxResults?: number
}

export async function POST(request: NextRequest) {
    try {
        const body: ScrapeRequest = await request.json()
        const { query, stores = ['pnp'], maxResults = 10 } = body

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 })
        }

        // Check cache
        const cacheKey = `${query}_${stores.join(',')}_${maxResults}`
        const cached = cache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log(`[Scrape API] Cache hit for: ${query}`)
            return NextResponse.json({
                products: cached.products,
                cached: true,
                source: 'cache'
            })
        }

        const allProducts: ScrapedProduct[] = []
        const errors: string[] = []

        // Run scrapers in parallel
        const scraperPromises = stores.map(async (store) => {
            try {
                let scraper
                switch (store.toLowerCase()) {
                    case 'pnp':
                    case 'pick n pay':
                        scraper = new PnPScraper({ headless: true })
                        break
                    case 'checkers':
                        scraper = new CheckersScraper({ headless: true })
                        break
                    case 'ubereats':
                    case 'uber eats':
                        scraper = new UberEatsScraper({ headless: true })
                        break
                    default:
                        errors.push(`Unknown store: ${store}`)
                        return []
                }

                const products = await scraper.search(query, maxResults)
                await scraper.close()
                return products
            } catch (error) {
                errors.push(`${store}: ${error}`)
                return []
            }
        })

        const results = await Promise.all(scraperPromises)
        results.forEach(products => allProducts.push(...products))

        // Sort by price
        allProducts.sort((a, b) => a.price - b.price)

        // Cache results
        cache.set(cacheKey, { products: allProducts, timestamp: Date.now() })

        return NextResponse.json({
            products: allProducts,
            total: allProducts.length,
            errors: errors.length > 0 ? errors : undefined,
            cached: false,
            source: 'live'
        })

    } catch (error) {
        console.error('[Scrape API] Error:', error)
        return NextResponse.json({
            error: 'Failed to scrape products',
            details: String(error)
        }, { status: 500 })
    }
}

// GET endpoint for simple queries
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const store = searchParams.get('store') || 'pnp'

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
    }

    // Forward to POST handler
    return POST(new NextRequest(request.url, {
        method: 'POST',
        body: JSON.stringify({ query, stores: [store], maxResults: 10 })
    }))
}
