import { StoreAdapter, StoreProduct, CartItem, Cart } from './adapter'

export class MockStoreAdapter implements StoreAdapter {
    key: string
    name: string
    private basePriceMultiplier: number

    constructor(key: string, name: string, basePriceMultiplier: number = 1.0) {
        this.key = key
        this.name = name
        this.basePriceMultiplier = basePriceMultiplier
    }

    async search(query: string): Promise<StoreProduct[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Return mock results based on query
        // In a real app, this would call the store's API or a scraper
        return [
            {
                store_key: this.key,
                external_id: `${this.key}-1`,
                name: `${query} (Generic Brand) @ ${this.name}`,
                price: Math.round(25 * this.basePriceMultiplier),
                currency: 'ZAR',
                size: '1kg'
            },
            {
                store_key: this.key,
                external_id: `${this.key}-2`,
                name: `Premium ${query} @ ${this.name}`,
                price: Math.round(45 * this.basePriceMultiplier),
                currency: 'ZAR',
                size: '500g'
            }
        ]
    }

    async getPrice(external_id: string): Promise<number> {
        return 25 * this.basePriceMultiplier
    }

    async createCart(items: CartItem[]): Promise<Cart> {
        return {
            store_key: this.key,
            items,
            total: items.length * 30 * this.basePriceMultiplier, // Dummy total
            currency: 'ZAR',
            checkout_url: `https://www.example.com/checkout/${this.key}?cart=123`
        }
    }
}
