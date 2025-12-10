'use client'

import { useState } from 'react'
import { Search, CheckCircle, XCircle, Clock, Building2, Globe, Mail, MoreVertical } from 'lucide-react'
import { cn } from '@/components/ui/utils'

// Mock brands data
const mockBrands = [
    {
        id: 1,
        name: 'KFC South Africa',
        email: 'partners@kfc.co.za',
        website: 'https://kfc.co.za',
        status: 'approved',
        commissionRate: 12,
        totalOrders: 1245,
        revenue: 'R 156,420',
        appliedAt: '2024-08-15'
    },
    {
        id: 2,
        name: "Nando's",
        email: 'digital@nandos.co.za',
        website: 'https://nandos.co.za',
        status: 'approved',
        commissionRate: 10,
        totalOrders: 892,
        revenue: 'R 98,340',
        appliedAt: '2024-09-01'
    },
    {
        id: 3,
        name: 'Ocean Basket',
        email: 'partner@oceanbasket.co.za',
        website: 'https://oceanbasket.co.za',
        status: 'pending',
        commissionRate: 10,
        totalOrders: 0,
        revenue: 'R 0',
        appliedAt: '2024-12-08'
    },
    {
        id: 4,
        name: 'Spur Steak Ranches',
        email: 'digital@spur.co.za',
        website: 'https://spur.co.za',
        status: 'pending',
        commissionRate: 10,
        totalOrders: 0,
        revenue: 'R 0',
        appliedAt: '2024-12-07'
    },
    {
        id: 5,
        name: 'Debonairs Pizza',
        email: 'marketing@debonairs.co.za',
        website: 'https://debonairs.co.za',
        status: 'pending',
        commissionRate: 10,
        totalOrders: 0,
        revenue: 'R 0',
        appliedAt: '2024-12-06'
    },
    {
        id: 6,
        name: 'Steers',
        email: 'partners@steers.co.za',
        website: 'https://steers.co.za',
        status: 'approved',
        commissionRate: 11,
        totalOrders: 567,
        revenue: 'R 72,890',
        appliedAt: '2024-10-10'
    },
    {
        id: 7,
        name: 'RocoMamas',
        email: 'brand@rocomamas.co.za',
        website: 'https://rocomamas.co.za',
        status: 'suspended',
        commissionRate: 10,
        totalOrders: 45,
        revenue: 'R 5,670',
        appliedAt: '2024-11-15'
    },
]

const statusColors = {
    approved: 'bg-emerald-500/10 text-emerald-500',
    pending: 'bg-orange-500/10 text-orange-500',
    suspended: 'bg-red-500/10 text-red-500',
}

export default function AdminBrandsPage() {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const filteredBrands = mockBrands.filter(brand => {
        if (search && !brand.name.toLowerCase().includes(search.toLowerCase())) return false
        if (statusFilter !== 'all' && brand.status !== statusFilter) return false
        return true
    })

    const pendingCount = mockBrands.filter(b => b.status === 'pending').length

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Brands</h1>
                    <p className="text-muted-foreground">Manage brand partners and applications</p>
                </div>
                {pendingCount > 0 && (
                    <div className="px-4 py-2 bg-orange-500/10 text-orange-500 rounded-lg text-sm font-medium">
                        {pendingCount} pending applications
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-card border">
                    <div className="text-2xl font-bold">{mockBrands.length}</div>
                    <div className="text-sm text-muted-foreground">Total Brands</div>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                    <div className="text-2xl font-bold text-emerald-500">{mockBrands.filter(b => b.status === 'approved').length}</div>
                    <div className="text-sm text-muted-foreground">Approved</div>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                    <div className="text-2xl font-bold text-orange-500">{pendingCount}</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                    <div className="text-2xl font-bold">10-12%</div>
                    <div className="text-sm text-muted-foreground">Avg Commission</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search brands..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border focus:ring-2 focus:ring-primary"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg bg-card border"
                >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                </select>
            </div>

            {/* Brands Table */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Brand</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Commission</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Orders</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Revenue</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBrands.map((brand) => (
                            <tr key={brand.id} className="border-t hover:bg-muted/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                            <Building2 className="h-5 w-5 text-purple-500" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{brand.name}</div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {brand.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                                        statusColors[brand.status as keyof typeof statusColors]
                                    )}>
                                        {brand.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm font-medium">{brand.commissionRate}%</td>
                                <td className="p-4 text-sm">{brand.totalOrders.toLocaleString()}</td>
                                <td className="p-4 text-sm font-medium">{brand.revenue}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {brand.status === 'pending' && (
                                            <>
                                                <button className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors" title="Approve">
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                                <button className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Reject">
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                        <a
                                            href={brand.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                                            title="Visit Website"
                                        >
                                            <Globe className="h-4 w-4" />
                                        </a>
                                        <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
