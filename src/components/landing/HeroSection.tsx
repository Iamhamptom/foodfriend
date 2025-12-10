import Link from 'next/link'
import { ArrowRight, ShoppingCart, Sparkles } from 'lucide-react'

export function HeroSection() {
    return (
        <section className="relative w-full py-24 md:py-32 lg:py-40 bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center">
                <div className="space-y-4 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10 mb-4">
                        <Sparkles className="w-3.5 h-3.5 mr-1 text-accent" />
                        <span>AI-Powered Meal Planning</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Groceries on Autopilot.
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl">
                        Turn your diet goals into a delivered shopping cart in seconds. Connect your favorite stores, define your budget, and let AI handle the rest.
                    </p>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <Link
                        href="/onboarding"
                        className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        Start Planning
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background/50 backdrop-blur-sm px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        How it Works
                    </Link>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full blur-3xl" />
            </div>
        </section>
    )
}
