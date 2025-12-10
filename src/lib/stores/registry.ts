import { StoreAdapter } from './adapter'
import { MockStoreAdapter } from './mock-adapter'

const ADAPTERS: Record<string, StoreAdapter> = {
    'checkers': new MockStoreAdapter('checkers', 'Checkers Sixty60', 1.0),
    'pnp': new MockStoreAdapter('pnp', 'Pick n Pay ASAP!', 1.05), // Slightly more expensive for demo
    'woolworths': new MockStoreAdapter('woolworths', 'Woolworths Dash', 1.2), // Premium
}

export function getStoreAdapter(key: string): StoreAdapter | undefined {
    return ADAPTERS[key]
}

export function getAllAdapters(): StoreAdapter[] {
    return Object.values(ADAPTERS)
}
