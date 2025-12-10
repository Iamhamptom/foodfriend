'use client'

import { useState } from 'react'
import { Search, Filter, MoreVertical, Mail, Calendar, Shield, Ban, CheckCircle } from 'lucide-react'
import { cn } from '@/components/ui/utils'

// Mock users data
const mockUsers = [
    { id: 1, name: 'Sarah Matthews', email: 'sarah@email.com', role: 'user', status: 'active', orders: 24, joined: '2024-10-15' },
    { id: 2, name: 'John Dube', email: 'john.dube@email.com', role: 'user', status: 'active', orders: 12, joined: '2024-11-02' },
    { id: 3, name: 'Lisa Khumalo', email: 'lisa.k@email.com', role: 'brand', status: 'active', orders: 0, joined: '2024-09-20' },
    { id: 4, name: 'Mike Roberts', email: 'mike.r@email.com', role: 'user', status: 'suspended', orders: 3, joined: '2024-11-15' },
    { id: 5, name: 'Emma Thompson', email: 'emma.t@email.com', role: 'admin', status: 'active', orders: 0, joined: '2024-08-01' },
    { id: 6, name: 'David Nkosi', email: 'david.n@email.com', role: 'user', status: 'active', orders: 45, joined: '2024-07-10' },
    { id: 7, name: 'Grace Molefe', email: 'grace.m@email.com', role: 'user', status: 'active', orders: 8, joined: '2024-11-28' },
    { id: 8, name: 'Peter van der Berg', email: 'peter.vdb@email.com', role: 'brand', status: 'pending', orders: 0, joined: '2024-12-05' },
]

const roleColors = {
    user: 'bg-blue-500/10 text-blue-500',
    brand: 'bg-purple-500/10 text-purple-500',
    admin: 'bg-primary/10 text-primary',
}

const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-500',
    suspended: 'bg-red-500/10 text-red-500',
    pending: 'bg-orange-500/10 text-orange-500',
}

export default function AdminUsersPage() {
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    const filteredUsers = mockUsers.filter(user => {
        if (search && !user.name.toLowerCase().includes(search.toLowerCase()) &&
            !user.email.toLowerCase().includes(search.toLowerCase())) return false
        if (roleFilter !== 'all' && user.role !== roleFilter) return false
        if (statusFilter !== 'all' && user.status !== statusFilter) return false
        return true
    })

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Users</h1>
                    <p className="text-muted-foreground">Manage all platform users</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{mockUsers.length} total users</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border focus:ring-2 focus:ring-primary"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg bg-card border"
                >
                    <option value="all">All Roles</option>
                    <option value="user">Users</option>
                    <option value="brand">Brands</option>
                    <option value="admin">Admins</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg bg-card border"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="rounded-xl border bg-card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Orders</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-t hover:bg-muted/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                                        roleColors[user.role as keyof typeof roleColors]
                                    )}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                                        statusColors[user.status as keyof typeof statusColors]
                                    )}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm">{user.orders}</td>
                                <td className="p-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {user.joined}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {user.status === 'active' ? (
                                            <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors" title="Suspend">
                                                <Ban className="h-4 w-4" />
                                            </button>
                                        ) : (
                                            <button className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-500 transition-colors" title="Activate">
                                                <CheckCircle className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors" title="Make Admin">
                                            <Shield className="h-4 w-4" />
                                        </button>
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
