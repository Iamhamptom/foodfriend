'use client'

import { Users, Building2, ShoppingBag, Ticket, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'

// Mock data - would come from database
const stats = [
    {
        label: 'Total Users',
        value: '2,847',
        change: '+12%',
        trend: 'up',
        icon: Users,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    {
        label: 'Active Brands',
        value: '156',
        change: '+8%',
        trend: 'up',
        icon: Building2,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
    },
    {
        label: 'Orders Today',
        value: '489',
        change: '+23%',
        trend: 'up',
        icon: ShoppingBag,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
    },
    {
        label: 'Open Tickets',
        value: '23',
        change: '-5%',
        trend: 'down',
        icon: Ticket,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10'
    },
]

const recentOrders = [
    { id: 'ORD-001', user: 'Sarah M.', store: 'KFC Sandton', amount: 'R185', status: 'completed' },
    { id: 'ORD-002', user: 'John D.', store: 'Checkers Sixty60', amount: 'R542', status: 'processing' },
    { id: 'ORD-003', user: 'Lisa K.', store: "Nando's", amount: 'R289', status: 'completed' },
    { id: 'ORD-004', user: 'Mike R.', store: 'Pick n Pay', amount: 'R1,205', status: 'pending' },
    { id: 'ORD-005', user: 'Emma T.', store: "McDonald's", amount: 'R156', status: 'completed' },
]

const pendingBrands = [
    { name: 'Ocean Basket', email: 'partner@oceanbasket.co.za', date: '2 hours ago' },
    { name: 'Spur Steak Ranches', email: 'digital@spur.co.za', date: '5 hours ago' },
    { name: 'Debonairs Pizza', email: 'marketing@debonairs.co.za', date: '1 day ago' },
]

const recentTickets = [
    { id: 'TKT-001', subject: 'Order not delivered', priority: 'high', status: 'open' },
    { id: 'TKT-002', subject: 'Refund request', priority: 'medium', status: 'in_progress' },
    { id: 'TKT-003', subject: 'Account access issue', priority: 'low', status: 'open' },
]

export default function AdminDashboard() {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Admin</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.label} className="p-6 rounded-xl bg-card border">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {stat.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                    {stat.change}
                                </div>
                            </div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                    )
                })}
            </div>

            {/* Revenue Card */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-emerald-500/10 border mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm text-muted-foreground mb-1">Total Revenue (This Month)</div>
                        <div className="text-4xl font-bold">R 248,592</div>
                        <div className="text-sm text-emerald-500 flex items-center gap-1 mt-1">
                            <TrendingUp className="h-4 w-4" />
                            +18% vs last month
                        </div>
                    </div>
                    <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <DollarSign className="h-8 w-8 text-primary" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 p-6 rounded-xl bg-card border">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Recent Orders</h2>
                        <a href="/admin/orders" className="text-sm text-primary hover:underline">View all</a>
                    </div>
                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                                        {order.user.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">{order.user}</div>
                                        <div className="text-xs text-muted-foreground">{order.store}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-sm">{order.amount}</div>
                                    <div className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                            order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-orange-500/10 text-orange-500'
                                        }`}>
                                        {order.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Pending Brands */}
                    <div className="p-6 rounded-xl bg-card border">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Pending Brands</h2>
                            <span className="px-2 py-1 bg-orange-500/10 text-orange-500 text-xs font-medium rounded-full">
                                {pendingBrands.length} new
                            </span>
                        </div>
                        <div className="space-y-3">
                            {pendingBrands.map((brand) => (
                                <div key={brand.name} className="p-3 rounded-lg bg-muted/50">
                                    <div className="font-medium text-sm">{brand.name}</div>
                                    <div className="text-xs text-muted-foreground">{brand.email}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{brand.date}</div>
                                </div>
                            ))}
                        </div>
                        <a href="/admin/brands" className="block text-center text-sm text-primary hover:underline mt-4">
                            Review applications
                        </a>
                    </div>

                    {/* Recent Tickets */}
                    <div className="p-6 rounded-xl bg-card border">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Open Tickets</h2>
                            <a href="/admin/tickets" className="text-sm text-primary hover:underline">View all</a>
                        </div>
                        <div className="space-y-3">
                            {recentTickets.map((ticket) => (
                                <div key={ticket.id} className="p-3 rounded-lg bg-muted/50">
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium text-sm">{ticket.subject}</div>
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${ticket.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                                                ticket.priority === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">{ticket.id}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
