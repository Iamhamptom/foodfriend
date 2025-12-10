import { StoreAdapter, StoreProduct, Cart, CartItem } from './adapter'
import { PnPScraper } from '../scrapers/pnp-scraper'
import { CheckersScraper } from '../scrapers/checkers-scraper'
import { UberEatsScraper } from '../scrapers/ubereats-scraper'
import { ScrapedProduct } from '../scrapers/base-scraper'

/**
 * Scraper-based adapter that uses real browser automation
 * to fetch products from store websites
 */
export class ScraperAdapter implements StoreAdapter {
    key: string
    name: string
    private scraperType: 'pnp' | 'checkers' | 'ubereats'

    constructor(store: 'pnp' | 'checkers' | 'ubereats') {
        this.scraperType = store
        switch (store) {
            case 'pnp':
                this.key = 'pnp'
                this.name = 'Pick n Pay'
                break
            case 'checkers':
                this.key = 'checkers'
                this.name = 'Checkers'
                break
            case 'ubereats':
                this.key = 'ubereats'
                this.name = 'Uber Eats'
                break
        }
    }

    async search(query: string): Promise<StoreProduct[]> {
        let scraper
        switch (this.scraperType) {
            case 'pnp':
                scraper = new PnPScraper({ headless: true })
                break
            case 'checkers':
                scraper = new CheckersScraper({ headless: true })
                break
            case 'ubereats':
                scraper = new UberEatsScraper({ headless: true })
                break
        }

        try {
            const scrapedProducts = await scraper.search(query, 10)
            await scraper.close()

            return scrapedProducts.map(this.convertToStoreProduct)
        } catch (error) {
            console.error(`[ScraperAdapter:${this.key}] Search error:`, error)
            await scraper.close()
            return []
        }
    }

    async getPrice(external_id: string): Promise<number> {
        // Would need to scrape product detail page
        // For now, return 0 as price was fetched during search
        return 0
    }

    async createCart(items: CartItem[]): Promise<Cart> {
        // Generate a checkout URL for the store
        const checkoutUrls: Record<string, string> = {
            pnp: 'https://www.pnp.co.za/cart',
            checkers: 'https://www.checkers.co.za/cart',
            ubereats: 'https://www.ubereats.com/za/checkout'
        }

        const total = 0 // Would need to sum up item prices

        return {
            store_key: this.key,
            items,
            total,
            currency: 'ZAR',
            checkout_url: checkoutUrls[this.key]
        }
    }

    private convertToStoreProduct(scraped: ScrapedProduct): StoreProduct {
        return {
            store_key: scraped.store.toLowerCase().replace(/\s+/g, ''),
            external_id: scraped.id,
            name: scraped.name,
            price: scraped.price,
            currency: 'ZAR',
            image_url: scraped.image
        }
    }
}
