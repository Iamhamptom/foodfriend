import { Action, MessageType } from '@/lib/chat/types'
import { cn } from '@/components/ui/utils'
import { ShoppingCart, ExternalLink, Plus, Check, Package, CreditCard } from 'lucide-react'

interface ActionCardsProps {
    actions?: Action[]
    type?: MessageType
    data?: any
    onAction: (value: string) => void
}

export function ActionCards({ actions, type, data, onAction }: ActionCardsProps) {

    // Store Grid for connecting accounts
    if (type === 'store_grid' && data?.stores) {
        return (
            <div className="grid grid-cols-2 gap-3 mt-3 w-full max-w-[80%] ml-11">
                {data.stores.map((store: any) => (
                    <button
                        key={store.key}
                        onClick={() => onAction(store.key)}
                        className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2 text-center relative",
                            store.connected
                                ? "bg-primary/10 border-primary text-primary ring-2 ring-primary/20"
                                : "bg-card hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        {store.connected && (
                            <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                        )}
                        <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center",
                            store.connected ? "bg-primary/20" : "bg-muted"
                        )}>
                            <ShoppingCart className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium">{store.name}</span>
                    </button>
                ))}
                {actions?.map(action => (
                    <button
                        key={action.id}
                        onClick={() => onAction(action.value)}
                        className="col-span-2 flex items-center justify-center p-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                    >
                        {action.label}
                    </button>
                ))}
            </div>
        )
    }

    // Product List - Horizontal Scroll Carousel
    if (type === 'product_list' && data?.products) {
        return (
            <div className="mt-3 w-full ml-11">
                {/* Horizontal Scroll Container */}
                <div
                    className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {data.products.map((product: any) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-[200px] snap-start rounded-xl border bg-card hover:shadow-lg transition-all overflow-hidden"
                        >
                            {/* Product Image */}
                            {product.image && (
                                <div className="relative h-32 w-full overflow-hidden bg-muted">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'
                                        }}
                                    />
                                    {/* Store badge */}
                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium">
                                        {product.store}
                                    </div>
                                </div>
                            )}
                            {/* Product Info */}
                            <div className="p-3">
                                <h4 className="font-semibold text-sm line-clamp-2 mb-1">{product.name}</h4>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-lg font-bold text-primary">R{product.price}</span>
                                        {product.eta && (
                                            <span className="text-xs text-muted-foreground ml-2">{product.eta}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => onAction(`order_${product.id}`)}
                                        className="h-9 w-9 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Scroll hint */}
                <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xs text-muted-foreground">← Swipe for more options →</span>
                </div>
            </div>
        )
    }

    // Grocery List
    if (type === 'grocery_list' && data?.items) {
        // Group by category
        const categories: Record<string, any[]> = {}
        data.items.forEach((item: any) => {
            if (!categories[item.category]) categories[item.category] = []
            categories[item.category].push(item)
        })

        return (
            <div className="mt-3 w-full max-w-[85%] ml-11 space-y-3">
                {Object.entries(categories).map(([category, items]) => (
                    <div key={category} className="rounded-lg border bg-card overflow-hidden">
                        <div className="bg-muted/50 px-3 py-2 border-b">
                            <h5 className="text-xs font-semibold uppercase text-muted-foreground">{category}</h5>
                        </div>
                        <div className="divide-y">
                            {items.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">{item.store}</span>
                                        <span className="font-medium text-sm">R{item.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {actions && actions.length > 0 && (
                    <div className="flex gap-2 mt-3">
                        {actions.map(action => (
                            <button
                                key={action.id}
                                onClick={() => onAction(action.value)}
                                className={cn(
                                    "flex-1 flex items-center justify-center p-3 rounded-xl font-medium text-sm transition-colors",
                                    action.id === 'add_all'
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "border bg-card hover:bg-accent"
                                )}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    // Checkout Card
    if (type === 'checkout' && data?.items) {
        return (
            <div className="mt-3 w-full max-w-[85%] ml-11">
                <div className="rounded-xl border bg-gradient-to-br from-card to-muted/30 p-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">Your Cart</h4>
                    </div>
                    <div className="space-y-2 mb-4">
                        {data.items.slice(0, 4).map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{item.name}</span>
                                <span className="font-medium">R{item.price}</span>
                            </div>
                        ))}
                        {data.items.length > 4 && (
                            <div className="text-xs text-muted-foreground">+{data.items.length - 4} more items...</div>
                        )}
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center mb-4">
                        <span className="font-semibold">Total</span>
                        <span className="text-xl font-bold text-primary">R{data.total}</span>
                    </div>
                    {actions && actions.length > 0 && (
                        <div className="flex gap-2">
                            {actions.map(action => (
                                <button
                                    key={action.id}
                                    onClick={() => onAction(action.value)}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl font-medium text-sm transition-colors",
                                        action.id === 'checkout'
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                            : "border bg-background hover:bg-accent"
                                    )}
                                >
                                    {action.type === 'link' && <ExternalLink className="h-4 w-4" />}
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    if (!actions || actions.length === 0) return null

    return (
        <div className="flex flex-wrap gap-2 mt-2 ml-11">
            {actions.map((action) => (
                <button
                    key={action.id}
                    onClick={() => onAction(action.value)}
                    className={cn(
                        "inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none",
                        "bg-background hover:bg-accent hover:text-accent-foreground border-input"
                    )}
                >
                    {action.type === 'link' && <ExternalLink className="h-3 w-3 mr-1.5" />}
                    {action.label}
                </button>
            ))}
        </div>
    )
}

