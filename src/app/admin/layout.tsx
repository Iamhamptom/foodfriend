'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Building2,
    ShoppingBag,
    Ticket,
    Tag,
    BarChart3,
    Settings,
    Sparkles,
    LogOut
} from 'lucide-react'
import { cn } from '@/components/ui/utils'

const adminNavLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/brands', label: 'Brands', icon: Building2 },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/tickets', label: 'Support Tickets', icon: Ticket },
    { href: '/admin/deals', label: 'Deals & Content', icon: Tag },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-lg">FoodFriend</span>
                            <span className="block text-xs text-muted-foreground">Admin Panel</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {adminNavLinks.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname === link.href ||
                            (link.href !== '/admin' && pathname.startsWith(link.href))
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    >
                        <LogOut className="h-5 w-5" />
                        Exit Admin
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-background">
                {children}
            </main>
        </div>
    )
}
