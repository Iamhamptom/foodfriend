'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Tag,
    BarChart3,
    CreditCard,
    Settings,
    Sparkles,
    LogOut,
    Building2
} from 'lucide-react'
import { cn } from '@/components/ui/utils'

const brandNavLinks = [
    { href: '/brand', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/brand/deals', label: 'My Deals', icon: Tag },
    { href: '/brand/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/brand/billing', label: 'Billing', icon: CreditCard },
    { href: '/brand/settings', label: 'Settings', icon: Settings },
]

export default function BrandLayout({
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
                    <Link href="/brand" className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-lg">FoodFriend</span>
                            <span className="block text-xs text-muted-foreground">Brand Portal</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {brandNavLinks.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname === link.href ||
                            (link.href !== '/brand' && pathname.startsWith(link.href))
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-purple-500 text-white"
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
                        Exit Portal
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
