'use client'

import { StoreConnectionCard } from './StoreConnectionCard'

interface StoreListProps {
    stores: any[]
    onToggle: (key: string, connected: boolean) => void
}

export function StoreList({ stores, onToggle }: StoreListProps) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
                <StoreConnectionCard key={store.key} store={store} onToggle={onToggle} />
            ))}
        </div>
    )
}
