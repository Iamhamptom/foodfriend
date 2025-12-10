'use client'

import { useState } from 'react'
import { Search, Star, Clock, MapPin, Filter, Utensils, ShoppingCart } from 'lucide-react'
import { cn } from '@/components/ui/utils'

const categories = ['All', 'Restaurants', 'Groceries', 'Fast Food', 'Healthy', 'Desserts']

const restaurants = [
    // Real SA stores with actual links
    {
        id: 1,
        name: 'KFC, Grayston Drive',
        type: 'Fast Food',
        rating: 4.5,
        deliveryTime: '20-30 min',
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop',
        priceRange: '$$',
        featured: true,
        location: 'Sandton',
        storeLink: 'https://order.kfc.co.za'
    },
    {
        id: 2,
        name: "Nando's, Katherine Street",
        type: 'Portuguese',
        rating: 4.4,
        deliveryTime: '25-35 min',
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
        priceRange: '$$',
        featured: true,
        location: 'Sandton',
        storeLink: 'https://www.nandos.co.za/eat/order-online'
    },
    {
        id: 3,
        name: 'Checkers Sixty60',
        type: 'Groceries',
        rating: 4.5,
        deliveryTime: '45-60 min',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
        priceRange: '$',
        isGrocery: true,
        location: 'Nationwide',
        storeLink: 'https://www.checkers.co.za/sixty60'
    },
    {
        id: 4,
        name: "McDonald's, Sandton Gate",
        type: 'Fast Food',
        rating: 4.3,
        deliveryTime: '20-30 min',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        priceRange: '$',
        location: 'Sandton',
        storeLink: 'https://www.ubereats.com/za/store/mcdonalds-sandton-city/Yj4W1Vd_RXOhqCbmDqLZHg'
    },
    {
        id: 5,
        name: 'Pick n Pay',
        type: 'Groceries',
        rating: 4.4,
        deliveryTime: '60-90 min',
        image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop',
        priceRange: '$',
        isGrocery: true,
        location: 'Nationwide',
        storeLink: 'https://www.pnp.co.za'
    },
    {
        id: 6,
        name: 'Woolworths Food',
        type: 'Premium Grocery',
        rating: 4.6,
        deliveryTime: '30-45 min',
        image: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=400&h=300&fit=crop',
        priceRange: '$$$',
        isGrocery: true,
        location: 'Sandton',
        storeLink: 'https://www.woolworths.co.za/dash'
    },
    {
        id: 7,
        name: 'Uber Eats',
        type: 'Delivery',
        rating: 4.6,
        deliveryTime: '25-35 min',
        image: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=400&h=300&fit=crop',
        priceRange: '$$',
        isGrocery: true,
        location: 'Multiple',
        storeLink: 'https://www.ubereats.com/za'
    },
    {
        id: 8,
        name: "Steers",
        type: 'Burgers',
        rating: 4.3,
        deliveryTime: '25-35 min',
        image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&h=300&fit=crop',
        priceRange: '$$',
        location: 'Multiple Locations',
        storeLink: 'https://www.steers.co.za/order'
    }
]

export default function ExplorePage() {
    const [activeCategory, setActiveCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredRestaurants = restaurants.filter(r => {
        if (activeCategory !== 'All') {
            if (activeCategory === 'Restaurants' && r.isGrocery) return false
            if (activeCategory === 'Groceries' && !r.isGrocery) return false
            if (activeCategory === 'Fast Food' && r.type !== 'Fast Food') return false
        }
        if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
    })

    return (
        <div className="py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Explore</h1>
                    <p className="text-muted-foreground">Discover restaurants and grocery stores near you</p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search restaurants, cuisines..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-3 rounded-xl border bg-card hover:bg-muted transition-colors">
                        <Filter className="h-5 w-5" />
                        Filters
                    </button>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
                                activeCategory === cat
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border hover:bg-muted"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Featured */}
                {activeCategory === 'All' && (
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            Featured
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {restaurants.filter(r => r.featured).map((r) => (
                                <a key={r.id} href={r.storeLink} target="_blank" rel="noopener noreferrer" className="group relative rounded-2xl overflow-hidden border bg-card hover:shadow-xl transition-all cursor-pointer block">
                                    <div className="aspect-[16/9] overflow-hidden">
                                        <img
                                            src={r.image}
                                            alt={r.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                                        Featured
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-semibold text-lg">{r.name}</h3>
                                                <p className="text-sm text-muted-foreground">{r.type} • {r.priceRange}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                {r.rating}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            {r.deliveryTime}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Restaurants */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        {activeCategory === 'All' ? 'All Options' : activeCategory}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRestaurants.map((r) => (
                            <a key={r.id} href={r.storeLink} target="_blank" rel="noopener noreferrer" className="group rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all cursor-pointer block">
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <img
                                        src={r.image}
                                        alt={r.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 right-3">
                                        {r.isGrocery ? (
                                            <div className="p-2 bg-background/80 backdrop-blur-sm rounded-full">
                                                <ShoppingCart className="h-4 w-4" />
                                            </div>
                                        ) : (
                                            <div className="p-2 bg-background/80 backdrop-blur-sm rounded-full">
                                                <Utensils className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className="font-semibold">{r.name}</h3>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                                            {r.rating}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{r.type} • {r.priceRange}</p>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5" />
                                        {r.deliveryTime}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
