import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CallToActionSection() {
    return (
        <section className="w-full py-24 bg-primary/5 border-y border-primary/10">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to automate your groceries?</h2>
                        <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Join the future of meal planning today. It takes less than 2 minutes to set up.
                        </p>
                    </div>
                    <div className="w-full max-w-sm space-y-2 mt-6">
                        <Link
                            href="/onboarding"
                            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                            Get Started Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
