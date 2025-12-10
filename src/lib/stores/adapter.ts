export interface StoreProduct {
    store_key: string
    external_id: string
    name: string
    price: number
    currency: string
    image_url?: string
    size?: string
}

export interface CartItem {
    product_id: string
    quantity: number
}

export interface Cart {
    store_key: string
    items: CartItem[]
    total: number
    currency: string
    checkout_url?: string
}

export interface StoreAdapter {
    key: string
    name: string

    /**
     * Search for products in the store's catalog
     */
    search(query: string): Promise<StoreProduct[]>

    /**
     * Get current price for a specific product ID
     */
    getPrice(external_id: string): Promise<number>

    /**
     * Generate a checkout link or cart ID for a list of items
     */
    createCart(items: CartItem[]): Promise<Cart>
}
