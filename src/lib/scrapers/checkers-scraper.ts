import puppeteer, { Browser, Page } from 'puppeteer'
import { ScrapedProduct, ScraperConfig } from './base-scraper'

// Note: stealth plugin removed due to Next.js Turbopack compatibility issues
// Using standard puppeteer with realistic headers instead

export class CheckersScraper {
    readonly storeName = 'Checkers'
    readonly baseUrl = 'https://www.checkers.co.za'

    protected browser: Browser | null = null
    protected page: Page | null = null
    protected config: ScraperConfig

    constructor(config: ScraperConfig = {}) {
        this.config = {
            headless: true,
            timeout: 30000,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            ...config
        }
    }

    async launch(): Promise<void> {
        this.browser = await puppeteer.launch({
            headless: this.config.headless,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920,1080'
            ]
        })

        this.page = await this.browser.newPage()

        await this.page.setUserAgent(this.config.userAgent!)
        await this.page.setViewport({ width: 1920, height: 1080 })

        await this.page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        })
    }

    async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close()
            this.browser = null
            this.page = null
        }
    }

    async search(query: string, maxResults: number = 10): Promise<ScrapedProduct[]> {
        if (!this.page) {
            await this.launch()
        }

        const products: ScrapedProduct[] = []

        try {
            // Checkers Sixty60 search URL
            const searchUrl = `${this.baseUrl}/c-*/All-Departments/q:${encodeURIComponent(query)}`
            console.log(`[Checkers Scraper] Searching: ${searchUrl}`)

            await this.page!.goto(searchUrl, {
                waitUntil: 'networkidle2',
                timeout: this.config.timeout
            })

            // Wait for Cloudflare challenge (if any) to complete
            await new Promise(resolve => setTimeout(resolve, 5000))

            // Check if we've been blocked
            const isBlocked = await this.page!.evaluate(() => {
                return document.body.textContent?.includes('Checking your browser') ||
                    document.body.textContent?.includes('Please wait')
            })

            if (isBlocked) {
                console.log('[Checkers Scraper] Cloudflare challenge detected, waiting...')
                await new Promise(resolve => setTimeout(resolve, 10000))
            }

            // Extract products
            const productData = await this.page!.evaluate((max) => {
                const items: any[] = []

                const productCards = document.querySelectorAll(
                    '.product-card, .item-product, [class*="ProductCard"], [data-testid="product"]'
                )

                productCards.forEach((card, index) => {
                    if (index >= max) return

                    const nameEl = card.querySelector(
                        '.product-name, .item-name, h3, h4, [class*="name"], [class*="title"]'
                    )
                    const name = nameEl?.textContent?.trim() || ''

                    const priceEl = card.querySelector(
                        '.product-price, .price, [class*="price"], [class*="Price"]'
                    )
                    const priceText = priceEl?.textContent?.trim() || ''

                    const imageEl = card.querySelector('img')
                    const image = imageEl?.src || imageEl?.getAttribute('data-src') || ''

                    const linkEl = card.querySelector('a')
                    const url = linkEl?.href || ''

                    if (name && priceText) {
                        items.push({ name, priceText, image, url })
                    }
                })

                return items
            }, maxResults)

            for (const item of productData) {
                products.push({
                    id: this.generateId(item.name, 'checkers'),
                    name: item.name,
                    price: this.extractPrice(item.priceText),
                    image: item.image,
                    url: item.url.startsWith('http') ? item.url : `${this.baseUrl}${item.url}`,
                    store: this.storeName,
                    available: true
                })
            }

            console.log(`[Checkers Scraper] Found ${products.length} products`)

        } catch (error) {
            console.error('[Checkers Scraper] Error:', error)
        }

        return products
    }

    async getProductDetails(url: string): Promise<ScrapedProduct | null> {
        return null // Not implemented yet
    }

    protected extractPrice(priceText: string): number {
        const cleaned = priceText.replace(/[^\d.,]/g, '').replace(',', '.')
        return parseFloat(cleaned) || 0
    }

    protected generateId(name: string, store: string): string {
        return `${store.toLowerCase()}_${name.toLowerCase().replace(/\s+/g, '_').slice(0, 30)}_${Date.now()}`
    }
}
