import { NextResponse } from 'next/server'
import { getStoreAdapter } from '@/lib/stores/registry'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const storeKey = searchParams.get('store')

    if (!query) {
        return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 })
    }

    try {
        const results = []

        if (storeKey) {
            // Search specific store
            const adapter = getStoreAdapter(storeKey)
            if (adapter) {
                const products = await adapter.search(query)
                results.push(...products)
            }
        } else {
            // Search all (demo mode: just limit to 2 to avoid chaos)
            // In real app, we'd act on the user's "enabled stores" list 
            const adapter1 = getStoreAdapter('checkers')
            const adapter2 = getStoreAdapter('pnp')

            if (adapter1) results.push(...await adapter1.search(query))
            if (adapter2) results.push(...await adapter2.search(query))
        }

        return NextResponse.json({ results })
    } catch (error) {
        console.error('Store Search API Error:', error)
        return NextResponse.json({ error: 'Failed to search stores' }, { status: 500 })
    }
}
