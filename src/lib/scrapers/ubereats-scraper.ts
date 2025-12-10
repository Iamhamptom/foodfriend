import { BaseScraper, ScrapedProduct, ScraperConfig } from './base-scraper'

export class UberEatsScraper extends BaseScraper {
    readonly storeName = 'Uber Eats'
    readonly baseUrl = 'https://www.ubereats.com'

    constructor(config?: ScraperConfig) {
        super(config)
    }

    async search(query: string, maxResults: number = 10): Promise<ScrapedProduct[]> {
        if (!this.page) {
            await this.launch()
        }

        const products: ScrapedProduct[] = []

        try {
            // Uber Eats South Africa search
            const searchUrl = `${this.baseUrl}/za/search?q=${encodeURIComponent(query)}`
            console.log(`[Uber Eats Scraper] Searching: ${searchUrl}`)

            await this.page!.goto(searchUrl, {
                waitUntil: 'networkidle2',
                timeout: this.config.timeout
            })

            // Wait for React content to render
            await new Promise(resolve => setTimeout(resolve, 3000))

            // Scroll to load more content
            await this.scrollToBottom()

            // Extract products/restaurants
            const productData = await this.page!.evaluate((max) => {
                const items: any[] = []

                // Uber Eats uses various class patterns
                const productCards = document.querySelectorAll(
                    '[data-testid="store-card"], [class*="StoreCard"], [class*="FeedCard"], a[href*="/store/"]'
                )

                productCards.forEach((card, index) => {
                    if (index >= max) return

                    // Restaurant/Store name
                    const nameEl = card.querySelector(
                        'h3, h4, [class*="title"], [class*="name"], [data-testid="store-title"]'
                    )
                    const name = nameEl?.textContent?.trim() || ''

                    // Delivery fee or item price
                    const priceEl = card.querySelector(
                        '[class*="price"], [class*="fee"], [class*="delivery"]'
                    )
                    const priceText = priceEl?.textContent?.trim() || 'R0'

                    // Image
                    const imageEl = card.querySelector('img')
                    const image = imageEl?.src || ''

                    // URL
                    const linkEl = card.tagName === 'A' ? card : card.querySelector('a')
                    const url = (linkEl as HTMLAnchorElement)?.href || ''

                    if (name) {
                        items.push({ name, priceText, image, url })
                    }
                })

                return items
            }, maxResults)

            for (const item of productData) {
                products.push({
                    id: this.generateId(item.name, 'ubereats'),
                    name: item.name,
                    price: this.extractPrice(item.priceText),
                    image: item.image,
                    url: item.url,
                    store: this.storeName,
                    available: true
                })
            }

            console.log(`[Uber Eats Scraper] Found ${products.length} products`)

        } catch (error) {
            console.error('[Uber Eats Scraper] Error:', error)
        }

        return products
    }

    async getProductDetails(url: string): Promise<ScrapedProduct | null> {
        return null // Restaurant details would go here
    }
}
