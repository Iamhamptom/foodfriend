'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, LayoutGrid, ShoppingBasket, Store, Settings, User } from 'lucide-react'
import { cn } from '@/components/ui/utils'

export function DashboardHeader() {
    const pathname = usePathname()

    const navItems = [
        { href: '/planner', label: 'Planner', icon: LayoutGrid },
        { href: '/stores', label: 'Stores', icon: Store },
        { href: '/models', label: 'AI Models', icon: Sparkles },
    ]

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2 font-bold text-xl mr-8">
                <div className="rounded-full bg-primary/10 p-1.5">
                    <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">AutoCart</span>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-2 transition-colors hover:text-primary",
                            pathname?.startsWith(item.href)
                                ? "text-foreground font-semibold"
                                : "text-muted-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="ml-auto flex items-center gap-4">
                {/* User Menu Placeholder */}
                <button className="rounded-full bg-secondary p-2 hover:bg-secondary/80 transition-colors">
                    <User className="h-5 w-5 text-foreground" />
                </button>
            </div>
        </header>
    )
}
