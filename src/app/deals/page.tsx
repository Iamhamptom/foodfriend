'use client'

import { Tag, Clock, Percent, ArrowRight, Flame, Star } from 'lucide-react'

const deals = [
    // Real SA store promotions with actual links
    {
        id: 1,
        store: 'Uber Eats',
        title: '2 Offers Available at KFC',
        description: 'Get exclusive discounts on KFC meals - available at Grayston Drive, Sandton',
        code: 'UEATS20',
        expiresIn: '3 days',
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=200&fit=crop',
        discount: 20,
        featured: true,
        storeLink: 'https://www.ubereats.com/za/store/kfc-grayston-drive'
    },
    {
        id: 2,
        store: 'Checkers Sixty60',
        title: 'Free Delivery on R200+',
        description: 'Free delivery on all grocery orders over R200 - delivered in 60 minutes',
        code: 'FREEDEL',
        expiresIn: 'Ongoing',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=200&fit=crop',
        discount: 0,
        featured: true,
        storeLink: 'https://www.checkers.co.za/sixty60'
    },
    {
        id: 3,
        store: "McDonald's",
        title: 'Free Item on R180 Spend',
        description: 'Spend R180 at McDonald\'s and get a free item',
        code: 'MCDFREE',
        expiresIn: '5 days',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=200&fit=crop',
        discount: 0,
        storeLink: 'https://www.ubereats.com/za/store/mcdonalds-sandton-city/Yj4W1Vd_RXOhqCbmDqLZHg'
    },
    {
        id: 4,
        store: 'Pick n Pay',
        title: 'Smart Shopper Double Points',
        description: 'Earn double Smart Shopper points on all online orders this week',
        code: 'DOUBLE',
        expiresIn: '1 week',
        image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=200&fit=crop',
        discount: 0,
        storeLink: 'https://www.pnp.co.za'
    },
    {
        id: 5,
        store: "Nando's",
        title: 'Family Meal Deal',
        description: 'Full chicken + 4 large sides for R349',
        code: 'FAMILY349',
        expiresIn: '4 days',
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=200&fit=crop',
        discount: 15,
        storeLink: 'https://www.nandos.co.za/eat/order-online'
    },
    {
        id: 6,
        store: 'Woolworths',
        title: 'R50 Off First Delivery',
        description: 'New customers get R50 off their first Woolworths delivery order',
        code: 'WOOLIES50',
        expiresIn: '6 days',
        image: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=400&h=200&fit=crop',
        discount: 50,
        storeLink: 'https://www.woolworths.co.za/dash'
    },
    {
        id: 7,
        store: 'Mr D',
        title: 'R30 Off Your Next Order',
        description: 'Use code MRD30 for R30 off orders over R100',
        code: 'MRD30',
        expiresIn: '2 days',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=200&fit=crop',
        discount: 30,
        storeLink: 'https://www.mrd.co.za'
    },
    {
        id: 8,
        store: 'Steers',
        title: 'Buy 1 Get 1 Free Burgers',
        description: 'Buy any premium burger and get a second one free',
        code: 'BOGO',
        expiresIn: 'This weekend',
        image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&h=200&fit=crop',
        discount: 50,
        storeLink: 'https://www.steers.co.za/order'
    }
]

export default function DealsPage() {
    const featuredDeals = deals.filter(d => d.featured)
    const regularDeals = deals.filter(d => !d.featured)

    return (
        <div className="py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        <Tag className="h-8 w-8 text-primary" />
                        Today's Deals
                    </h1>
                    <p className="text-muted-foreground">Exclusive offers from your favorite stores</p>
                </div>

                {/* Featured Deals */}
                <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500" />
                        Hot Deals
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {featuredDeals.map((deal) => (
                            <div key={deal.id} className="group relative rounded-2xl overflow-hidden border bg-card hover:shadow-xl transition-all">
                                <div className="aspect-[2/1] overflow-hidden">
                                    <img
                                        src={deal.image}
                                        alt={deal.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                </div>

                                {/* Discount badge */}
                                {deal.discount > 0 && (
                                    <div className="absolute top-3 right-3 px-3 py-1.5 bg-primary text-primary-foreground font-bold rounded-full flex items-center gap-1">
                                        <Percent className="h-4 w-4" />
                                        {deal.discount}% OFF
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="text-xs text-primary font-medium mb-1">{deal.store}</div>
                                    <h3 className="text-xl font-bold text-white mb-1">{deal.title}</h3>
                                    <p className="text-sm text-white/80 mb-3">{deal.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-white/70">
                                            <Clock className="h-4 w-4" />
                                            Expires in {deal.expiresIn}
                                        </div>
                                        <a
                                            href={deal.storeLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors text-sm"
                                        >
                                            Use Code: {deal.code}
                                            <ArrowRight className="h-4 w-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* All Deals */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">All Deals</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {regularDeals.map((deal) => (
                            <a key={deal.id} href={deal.storeLink} target="_blank" rel="noopener noreferrer" className="group rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all block">
                                <div className="aspect-[16/9] overflow-hidden relative">
                                    <img
                                        src={deal.image}
                                        alt={deal.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {deal.discount > 0 && (
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                                            {deal.discount}% OFF
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="text-xs text-primary font-medium mb-1">{deal.store}</div>
                                    <h3 className="font-semibold mb-1">{deal.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">{deal.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5" />
                                            {deal.expiresIn}
                                        </div>
                                        <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-mono font-bold">
                                            {deal.code}
                                        </div>
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
