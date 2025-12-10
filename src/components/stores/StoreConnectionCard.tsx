'use client'

import { useState } from 'react'
import { Check, X, ShoppingCart, ExternalLink, Loader2 } from 'lucide-react'
import { cn } from '@/components/ui/utils'

interface StoreConnectionCardProps {
    store: {
        id: string
        name: string
        key: string
        logo_color: string
        is_connected: boolean
    }
    onToggle: (key: string, connected: boolean) => void
}

export function StoreConnectionCard({ store, onToggle }: StoreConnectionCardProps) {
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        setLoading(true)
        // Simulate auth delay
        await new Promise(resolve => setTimeout(resolve, 800))
        onToggle(store.key, !store.is_connected)
        setLoading(false)
    }

    return (
        <div className={cn(
            "relative rounded-xl border bg-card p-6 shadow-sm transition-all overflow-hidden",
            store.is_connected ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
        )}>
            {/* Logo Placeholder */}
            <div className={cn(
                "h-12 w-12 rounded-lg flex items-center justify-center mb-4 transition-colors",
                store.is_connected ? store.logo_color : "bg-muted text-muted-foreground"
            )}>
                <ShoppingCart className="h-6 w-6 text-white" />
            </div>

            <div className="space-y-1 mb-6">
                <h3 className="font-semibold text-lg">{store.name}</h3>
                <p className="text-sm text-muted-foreground">
                    {store.is_connected ? 'Connected and ready.' : 'Connect to fetch prices.'}
                </p>
            </div>

            <button
                onClick={handleToggle}
                disabled={loading}
                className={cn(
                    "w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
                    store.is_connected
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : store.is_connected ? (
                    <>Disconnect</>
                ) : (
                    <>Connect</>
                )}
            </button>

            {store.is_connected && (
                <div className="absolute top-4 right-4 text-primary">
                    <Check className="h-5 w-5" />
                </div>
            )}
        </div>
    )
}
