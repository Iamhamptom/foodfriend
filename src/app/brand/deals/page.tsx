'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, Calendar, Tag as TagIcon, Pause, Play } from 'lucide-react'
import { cn } from '@/components/ui/utils'

// Mock deals data
const mockDeals = [
    {
        id: 1,
        title: '20% Off Family Meals',
        description: 'Get 20% off all family meal combos',
        code: 'FAMILY20',
        discount: '20%',
        status: 'active',
        views: 1245,
        uses: 312,
        startDate: '2024-12-01',
        endDate: '2024-12-31',
    },
    {
        id: 2,
        title: 'Free Delivery Weekend',
        description: 'Free delivery on orders over R150',
        code: 'FREEDEL',
        discount: 'Free Delivery',
        status: 'active',
        views: 892,
        uses: 178,
        startDate: '2024-12-07',
        endDate: '2024-12-08',
    },
    {
        id: 3,
        title: 'Buy 1 Get 1 Free Burgers',
        description: 'Buy any burger, get one free',
        code: 'BOGO',
        discount: '50%',
        status: 'paused',
        views: 567,
        uses: 89,
        startDate: '2024-11-15',
        endDate: '2024-11-30',
    },
    {
        id: 4,
        title: 'Happy Hour Special',
        description: '30% off 2-5 PM weekdays',
        code: 'HAPPY30',
        discount: '30%',
        status: 'scheduled',
        views: 0,
        uses: 0,
        startDate: '2024-12-15',
        endDate: '2024-12-20',
    },
]

const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-500',
    paused: 'bg-orange-500/10 text-orange-500',
    scheduled: 'bg-blue-500/10 text-blue-500',
    ended: 'bg-gray-500/10 text-gray-500',
}

export default function BrandDealsPage() {
    const [showModal, setShowModal] = useState(false)

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">My Deals</h1>
                    <p className="text-muted-foreground">Create and manage your promotional deals</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Create Deal
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-card border">
                    <div className="text-2xl font-bold">{mockDeals.length}</div>
                    <div className="text-sm text-muted-foreground">Total Deals</div>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                    <div className="text-2xl font-bold text-emerald-500">{mockDeals.filter(d => d.status === 'active').length}</div>
                    <div className="text-sm text-muted-foreground">Active</div>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                    <div className="text-2xl font-bold">{mockDeals.reduce((sum, d) => sum + d.views, 0).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Views</div>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                    <div className="text-2xl font-bold">{mockDeals.reduce((sum, d) => sum + d.uses, 0).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Uses</div>
                </div>
            </div>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockDeals.map((deal) => (
                    <div key={deal.id} className="rounded-xl bg-card border overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <TagIcon className="h-5 w-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">{deal.title}</div>
                                        <div className="text-xs text-muted-foreground">{deal.discount}</div>
                                    </div>
                                </div>
                                <span className={cn(
                                    "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                                    statusColors[deal.status as keyof typeof statusColors]
                                )}>
                                    {deal.status}
                                </span>
                            </div>

                            <p className="text-sm text-muted-foreground mb-4">{deal.description}</p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                <span className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {deal.views.toLocaleString()}
                                </span>
                                <span>{deal.uses} uses</span>
                            </div>

                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                                <Calendar className="h-3.5 w-3.5" />
                                {deal.startDate} - {deal.endDate}
                            </div>

                            <div className="px-3 py-2 bg-muted rounded-lg text-center font-mono font-bold text-sm">
                                {deal.code}
                            </div>
                        </div>

                        <div className="flex border-t">
                            <button className="flex-1 flex items-center justify-center gap-1 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                <Edit className="h-4 w-4" />
                                Edit
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-1 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border-l">
                                {deal.status === 'active' ? (
                                    <>
                                        <Pause className="h-4 w-4" />
                                        Pause
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4" />
                                        Resume
                                    </>
                                )}
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-1 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors border-l">
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Deal Card */}
                <button
                    onClick={() => setShowModal(true)}
                    className="rounded-xl border-2 border-dashed border-muted-foreground/25 p-8 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:border-purple-500 hover:text-purple-500 transition-colors"
                >
                    <Plus className="h-10 w-10" />
                    <span className="font-medium">Create New Deal</span>
                </button>
            </div>
        </div>
    )
}
