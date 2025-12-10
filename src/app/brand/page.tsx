'use client'

import { TrendingUp, Eye, ShoppingBag, DollarSign, Tag, BarChart3, ArrowUpRight } from 'lucide-react'

// Mock brand data
const brandStats = [
    { label: 'Total Views', value: '24,891', change: '+18%', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Orders via FoodFriend', value: '1,245', change: '+23%', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Revenue Generated', value: 'R 156,420', change: '+15%', icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Active Deals', value: '8', change: '+2', icon: Tag, color: 'text-orange-500', bg: 'bg-orange-500/10' },
]

const recentOrders = [
    { id: 'ORD-4521', customer: 'Sarah M.', items: '2x Burgers, 1x Fries', amount: 'R 185', time: '2 hours ago' },
    { id: 'ORD-4520', customer: 'John D.', items: '1x Family Meal', amount: 'R 289', time: '3 hours ago' },
    { id: 'ORD-4519', customer: 'Lisa K.', items: '3x Wings, 2x Drinks', amount: 'R 156', time: '5 hours ago' },
    { id: 'ORD-4518', customer: 'Mike R.', items: '1x Combo Meal', amount: 'R 98', time: '6 hours ago' },
]

const topDeals = [
    { name: '20% Off Family Meals', clicks: 1245, conversions: 312, rate: '25%' },
    { name: 'Free Delivery Weekend', clicks: 892, conversions: 178, rate: '20%' },
    { name: 'Buy 1 Get 1 Free', clicks: 567, conversions: 89, rate: '16%' },
]

export default function BrandDashboard() {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Welcome back, KFC South Africa</h1>
                <p className="text-muted-foreground">Here's how your brand is performing on FoodFriend</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {brandStats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.label} className="p-6 rounded-xl bg-card border">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <div className="flex items-center gap-1 text-sm text-emerald-500">
                                    <TrendingUp className="h-4 w-4" />
                                    {stat.change}
                                </div>
                            </div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                    )
                })}
            </div>

            {/* Commission Info */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm text-muted-foreground mb-1">Next Payout (Dec 15)</div>
                        <div className="text-3xl font-bold">R 14,235</div>
                        <div className="text-sm text-muted-foreground mt-1">Commission rate: 12%</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">Month-to-Date</div>
                        <div className="text-xl font-bold">R 18,770</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="p-6 rounded-xl bg-card border">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Recent Orders</h2>
                        <a href="/brand/orders" className="text-sm text-purple-500 hover:underline flex items-center gap-1">
                            View all <ArrowUpRight className="h-4 w-4" />
                        </a>
                    </div>
                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div>
                                    <div className="font-medium text-sm">{order.customer}</div>
                                    <div className="text-xs text-muted-foreground">{order.items}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-sm">{order.amount}</div>
                                    <div className="text-xs text-muted-foreground">{order.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performing Deals */}
                <div className="p-6 rounded-xl bg-card border">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Top Performing Deals</h2>
                        <a href="/brand/deals" className="text-sm text-purple-500 hover:underline flex items-center gap-1">
                            Manage deals <ArrowUpRight className="h-4 w-4" />
                        </a>
                    </div>
                    <div className="space-y-3">
                        {topDeals.map((deal, idx) => (
                            <div key={deal.name} className="p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-medium text-sm">{deal.name}</div>
                                    <div className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded-full">
                                        #{idx + 1}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span>{deal.clicks.toLocaleString()} clicks</span>
                                    <span>{deal.conversions} orders</span>
                                    <span className="text-emerald-500">{deal.rate} conversion</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
