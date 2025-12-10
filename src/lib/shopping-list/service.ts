import { getStoreAdapter, getAllAdapters } from '@/lib/stores/registry'
import { StoreProduct } from '@/lib/stores/adapter'

export interface ShoppingListItem {
    ingredient: string
    quantity: number
    unit: string
    best_store?: string
    best_price?: number
    alternatives?: StoreProduct[]
}

export class ShoppingListService {

    async generateListFromPlan(plan: any): Promise<ShoppingListItem[]> {
        // 1. Flatten meals into ingredients
        const ingredients: Record<string, { quantity: number, unit: string }> = {}

        // Mock parsing plan meals array
        // In real app, we'd iterate over plan.meals -> recipe -> ingredients
        // For now, let's just use some dummy ingredients based on the "AI" plan
        const dummyIngredients = [
            { name: 'Milk', quantity: 2, unit: 'L' },
            { name: 'Bread', quantity: 2, unit: 'Loaves' },
            { name: 'Eggs', quantity: 12, unit: 'Units' },
            { name: 'Chicken Breast', quantity: 1, unit: 'kg' },
            { name: 'Rice', quantity: 2, unit: 'kg' }
        ]

        const items: ShoppingListItem[] = []

        // 2. For each ingredient, find the best price
        for (const ing of dummyIngredients) {
            const item: ShoppingListItem = {
                ingredient: ing.name,
                quantity: ing.quantity,
                unit: ing.unit,
                alternatives: []
            }

            // Search all stores
            const searchResults: StoreProduct[] = []
            for (const adapter of getAllAdapters()) {
                const products = await adapter.search(ing.name)
                if (products.length > 0) {
                    // Find cheapest for this adapter
                    const cheapest = products.sort((a, b) => a.price - b.price)[0]
                    searchResults.push(cheapest)
                }
            }

            // Sort by price across all stores
            if (searchResults.length > 0) {
                searchResults.sort((a, b) => a.price - b.price)
                item.alternatives = searchResults
                item.best_store = searchResults[0].store_key
                item.best_price = searchResults[0].price
            }

            items.push(item)
        }

        return items
    }

    async optimizeBudget(listId: string, budget: number): Promise<any> {
        // Retrieve list, verify against budget, suggest swaps
        // Placeholder logic
        return {
            is_within_budget: true,
            total: 1500
        }
    }
}
