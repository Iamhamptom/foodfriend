'use client'

import { BarChart3, TrendingUp, Eye, ShoppingBag, Users, Calendar } from 'lucide-react'

// Mock analytics data
const dailyData = [
    { day: 'Mon', views: 342, orders: 45 },
    { day: 'Tue', views: 456, orders: 62 },
    { day: 'Wed', views: 512, orders: 78 },
    { day: 'Thu', views: 489, orders: 71 },
    { day: 'Fri', views: 623, orders: 98 },
    { day: 'Sat', views: 721, orders: 112 },
    { day: 'Sun', views: 654, orders: 96 },
]

const topItems = [
    { name: 'Zinger Burger Combo', orders: 245, revenue: 'R 24,255' },
    { name: 'Family Feast', orders: 189, revenue: 'R 56,511' },
    { name: '12 Piece Bucket', orders: 156, revenue: 'R 31,044' },
    { name: 'Streetwise 2', orders: 134, revenue: 'R 6,700' },
    { name: 'Dunked Wings', orders: 98, revenue: 'R 8,820' },
]

const customerDemographics = [
    { label: 'New Customers', value: 42, color: 'bg-blue-500' },
    { label: 'Returning', value: 38, color: 'bg-emerald-500' },
    { label: 'Loyal (5+ orders)', value: 20, color: 'bg-purple-500' },
]

export default function BrandAnalyticsPage() {
    const maxViews = Math.max(...dailyData.map(d => d.views))

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Analytics</h1>
                    <p className="text-muted-foreground">Track your performance on FoodFriend</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-card border rounded-lg">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <select className="bg-transparent text-sm font-medium">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>This year</option>
                    </select>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="p-6 rounded-xl bg-card border">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Eye className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className="text-sm text-muted-foreground">Total Views</span>
                    </div>
                    <div className="text-2xl font-bold">3,797</div>
                    <div className="text-sm text-emerald-500 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        +24% from last week
                    </div>
                </div>
                <div className="p-6 rounded-xl bg-card border">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <ShoppingBag className="h-5 w-5 text-emerald-500" />
                        </div>
                        <span className="text-sm text-muted-foreground">Total Orders</span>
                    </div>
                    <div className="text-2xl font-bold">562</div>
                    <div className="text-sm text-emerald-500 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        +18% from last week
                    </div>
                </div>
                <div className="p-6 rounded-xl bg-card border">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-purple-500" />
                        </div>
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                    </div>
                    <div className="text-2xl font-bold">14.8%</div>
                    <div className="text-sm text-emerald-500 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        +2.1% from last week
                    </div>
                </div>
                <div className="p-6 rounded-xl bg-card border">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-orange-500" />
                        </div>
                        <span className="text-sm text-muted-foreground">Unique Customers</span>
                    </div>
                    <div className="text-2xl font-bold">423</div>
                    <div className="text-sm text-emerald-500 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        +12% from last week
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Views Chart */}
                <div className="lg:col-span-2 p-6 rounded-xl bg-card border">
                    <h2 className="text-lg font-semibold mb-6">Daily Performance</h2>
                    <div className="flex items-end justify-between gap-2 h-48">
                        {dailyData.map((day) => (
                            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex flex-col gap-1">
                                    <div
                                        className="w-full bg-blue-500/20 rounded-t"
                                        style={{ height: `${(day.views / maxViews) * 150}px` }}
                                    />
                                    <div
                                        className="w-full bg-emerald-500 rounded-b"
                                        style={{ height: `${(day.orders / maxViews) * 150}px` }}
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground">{day.day}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded bg-blue-500/20" />
                            <span className="text-xs text-muted-foreground">Views</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded bg-emerald-500" />
                            <span className="text-xs text-muted-foreground">Orders</span>
                        </div>
                    </div>
                </div>

                {/* Customer Demographics */}
                <div className="p-6 rounded-xl bg-card border">
                    <h2 className="text-lg font-semibold mb-6">Customer Types</h2>
                    <div className="space-y-4">
                        {customerDemographics.map((demo) => (
                            <div key={demo.label}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm">{demo.label}</span>
                                    <span className="text-sm font-medium">{demo.value}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${demo.color} rounded-full`}
                                        style={{ width: `${demo.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Items */}
            <div className="mt-6 p-6 rounded-xl bg-card border">
                <h2 className="text-lg font-semibold mb-4">Top Selling Items</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">#</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Item</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Orders</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topItems.map((item, idx) => (
                                <tr key={item.name} className="border-b last:border-0">
                                    <td className="p-3 text-sm font-medium">{idx + 1}</td>
                                    <td className="p-3 font-medium">{item.name}</td>
                                    <td className="p-3 text-sm">{item.orders}</td>
                                    <td className="p-3 text-sm font-medium">{item.revenue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
