import puppeteer, { Browser, Page } from 'puppeteer'

export interface ScrapedProduct {
    id: string
    name: string
    price: number
    originalPrice?: number
    image?: string
    url: string
    store: string
    available: boolean
}

export interface ScraperConfig {
    headless?: boolean
    timeout?: number
    userAgent?: string
}

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

export abstract class BaseScraper {
    protected browser: Browser | null = null
    protected page: Page | null = null
    protected config: ScraperConfig

    abstract readonly storeName: string
    abstract readonly baseUrl: string

    constructor(config: ScraperConfig = {}) {
        this.config = {
            headless: true,
            timeout: 30000,
            userAgent: DEFAULT_USER_AGENT,
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

        // Set extra headers to look more like a real browser
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

    abstract search(query: string, maxResults?: number): Promise<ScrapedProduct[]>

    abstract getProductDetails(url: string): Promise<ScrapedProduct | null>

    protected async waitAndClick(selector: string): Promise<void> {
        if (!this.page) throw new Error('Browser not launched')
        await this.page.waitForSelector(selector, { timeout: this.config.timeout })
        await this.page.click(selector)
    }

    protected async waitAndType(selector: string, text: string): Promise<void> {
        if (!this.page) throw new Error('Browser not launched')
        await this.page.waitForSelector(selector, { timeout: this.config.timeout })
        await this.page.type(selector, text, { delay: 50 })
    }

    protected async scrollToBottom(): Promise<void> {
        if (!this.page) throw new Error('Browser not launched')
        await this.page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0
                const distance = 100
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight
                    window.scrollBy(0, distance)
                    totalHeight += distance
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer)
                        resolve()
                    }
                }, 100)
            })
        })
    }

    protected extractPrice(priceText: string): number {
        // Extract number from price string like "R 45.99" or "R45,99"
        const cleaned = priceText.replace(/[^\d.,]/g, '').replace(',', '.')
        return parseFloat(cleaned) || 0
    }

    protected generateId(name: string, store: string): string {
        return `${store.toLowerCase()}_${name.toLowerCase().replace(/\s+/g, '_').slice(0, 30)}_${Date.now()}`
    }
}
