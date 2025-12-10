'use client'

import { useState } from 'react'
import { Search, Clock, AlertCircle, CheckCircle2, MessageSquare, User } from 'lucide-react'
import { cn } from '@/components/ui/utils'

// Mock tickets data
const mockTickets = [
    {
        id: 'TKT-001',
        subject: 'Order not delivered - ORD-4521',
        user: 'Sarah Matthews',
        userEmail: 'sarah@email.com',
        category: 'order',
        priority: 'high',
        status: 'open',
        messages: 3,
        createdAt: '2024-12-09 14:30',
        lastUpdate: '2 hours ago'
    },
    {
        id: 'TKT-002',
        subject: 'Refund request for cancelled order',
        user: 'John Dube',
        userEmail: 'john.dube@email.com',
        category: 'payment',
        priority: 'medium',
        status: 'in_progress',
        assignedTo: 'Emma T.',
        messages: 5,
        createdAt: '2024-12-09 10:15',
        lastUpdate: '4 hours ago'
    },
    {
        id: 'TKT-003',
        subject: 'Cannot login to my account',
        user: 'Lisa Khumalo',
        userEmail: 'lisa.k@email.com',
        category: 'account',
        priority: 'low',
        status: 'open',
        messages: 1,
        createdAt: '2024-12-09 08:45',
        lastUpdate: '6 hours ago'
    },
    {
        id: 'TKT-004',
        subject: 'Wrong items in order',
        user: 'Mike Roberts',
        userEmail: 'mike.r@email.com',
        category: 'order',
        priority: 'high',
        status: 'resolved',
        assignedTo: 'Emma T.',
        messages: 8,
        createdAt: '2024-12-08 16:20',
        lastUpdate: '1 day ago'
    },
    {
        id: 'TKT-005',
        subject: 'How to update payment method?',
        user: 'Grace Molefe',
        userEmail: 'grace.m@email.com',
        category: 'payment',
        priority: 'low',
        status: 'resolved',
        messages: 2,
        createdAt: '2024-12-07 11:30',
        lastUpdate: '2 days ago'
    },
]

const priorityColors = {
    high: 'bg-red-500/10 text-red-500',
    medium: 'bg-orange-500/10 text-orange-500',
    low: 'bg-blue-500/10 text-blue-500',
}

const statusColors = {
    open: 'bg-yellow-500/10 text-yellow-500',
    in_progress: 'bg-blue-500/10 text-blue-500',
    resolved: 'bg-emerald-500/10 text-emerald-500',
    closed: 'bg-gray-500/10 text-gray-500',
}

const categoryIcons = {
    order: '📦',
    payment: '💳',
    account: '👤',
    other: '❓',
}

export default function AdminTicketsPage() {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [priorityFilter, setPriorityFilter] = useState('all')
    const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null)

    const filteredTickets = mockTickets.filter(ticket => {
        if (search && !ticket.subject.toLowerCase().includes(search.toLowerCase()) &&
            !ticket.user.toLowerCase().includes(search.toLowerCase())) return false
        if (statusFilter !== 'all' && ticket.status !== statusFilter) return false
        if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false
        return true
    })

    const openCount = mockTickets.filter(t => t.status === 'open').length
    const highPriorityCount = mockTickets.filter(t => t.priority === 'high' && t.status !== 'resolved').length

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Support Tickets</h1>
                    <p className="text-muted-foreground">Manage customer support requests</p>
                </div>
                <div className="flex items-center gap-3">
                    {highPriorityCount > 0 && (
                        <div className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {highPriorityCount} high priority
                        </div>
                    )}
                    <div className="px-3 py-1.5 bg-yellow-500/10 text-yellow-500 rounded-lg text-sm font-medium">
                        {openCount} open
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-card border">
                    <div className="text-2xl font-bold">{mockTickets.length}</div>
                    <div className="text-sm text-muted-foreground">Total Tickets</div>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                    <div className="text-2xl font-bold text-yellow-500">{openCount}</div>
                    <div className="text-sm text-muted-foreground">Open</div>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                    <div className="text-2xl font-bold text-blue-500">{mockTickets.filter(t => t.status === 'in_progress').length}</div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                    <div className="text-2xl font-bold text-emerald-500">{mockTickets.filter(t => t.status === 'resolved').length}</div>
                    <div className="text-sm text-muted-foreground">Resolved</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search tickets..."
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
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                </select>
                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg bg-card border"
                >
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>

            {/* Tickets List */}
            <div className="space-y-3">
                {filteredTickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        className="p-4 rounded-xl bg-card border hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setSelectedTicket(ticket)}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{categoryIcons[ticket.category as keyof typeof categoryIcons]}</span>
                                    <span className="font-medium">{ticket.subject}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <User className="h-3.5 w-3.5" />
                                        {ticket.user}
                                    </span>
                                    <span>•</span>
                                    <span>{ticket.id}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {ticket.lastUpdate}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        {ticket.messages} messages
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                                    priorityColors[ticket.priority as keyof typeof priorityColors]
                                )}>
                                    {ticket.priority}
                                </span>
                                <span className={cn(
                                    "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                                    statusColors[ticket.status as keyof typeof statusColors]
                                )}>
                                    {ticket.status.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                        {ticket.assignedTo && (
                            <div className="mt-2 text-xs text-muted-foreground">
                                Assigned to: <span className="font-medium text-foreground">{ticket.assignedTo}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
