'use client'

import { useState, useEffect } from 'react'
import { StoreList } from '@/components/stores/StoreList'

const SUPPORTED_STORES = [
    { id: '1', name: 'Checkers Sixty60', key: 'checkers', logo_color: 'bg-teal-600', is_connected: false },
    { id: '2', name: 'Pick n Pay ASAP!', key: 'pnp', logo_color: 'bg-red-600', is_connected: false },
    { id: '3', name: 'Woolworths Dash', key: 'woolworths', logo_color: 'bg-black', is_connected: false },
    { id: '4', name: 'Uber Eats', key: 'uber_eats', logo_color: 'bg-green-600', is_connected: false },
    { id: '5', name: 'Mr D', key: 'mr_d', logo_color: 'bg-orange-600', is_connected: false },
]

export default function StoresPage() {
    // Initialize from static list, then merge with local storage
    const [stores, setStores] = useState(SUPPORTED_STORES)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const saved = localStorage.getItem('autocart_stores')
        if (saved) {
            const savedState = JSON.parse(saved)
            // Merge saved state (is_connected) with supported list (in case we add new stores)
            const merged = SUPPORTED_STORES.map(store => {
                const found = savedState.find((s: any) => s.key === store.key)
                return found ? { ...store, is_connected: found.is_connected } : store
            })
            setStores(merged)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        if (!loading) {
            // Only save the necessary state
            const toSave = stores.map(s => ({ key: s.key, is_connected: s.is_connected }))
            localStorage.setItem('autocart_stores', JSON.stringify(toSave))
        }
    }, [stores, loading])

    const handleToggle = (key: string, connected: boolean) => {
        setStores(stores.map(s =>
            s.key === key ? { ...s, is_connected: connected } : s
        ))
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Store Connections</h1>
                <p className="text-muted-foreground">
                    Connect your accounts to enable price comparison and 1-click checkout.
                </p>
            </div>

            <StoreList stores={stores} onToggle={handleToggle} />
        </div>
    )
}
