import { Brain, ShoppingBasket, CalendarCheck } from 'lucide-react'

export function HowItWorks() {
    const steps = [
        {
            icon: <Brain className="h-10 w-10 text-primary" />,
            title: "1. Define Your Goals",
            description: "Tell AutoCart your diet preferences, budget, and family size. AI tailors a plan just for you."
        },
        {
            icon: <CalendarCheck className="h-10 w-10 text-accent" />,
            title: "2. Generate Meal Plan",
            description: "Get a complete weekly schedule with recipes. Swap meals instantly if you change your mind."
        },
        {
            icon: <ShoppingBasket className="h-10 w-10 text-primary" />,
            title: "3. Auto-Fill Cart",
            description: "We compare prices across your connected stores to find the best deal, then fill your cart automatically."
        }
    ]

    return (
        <section id="how-it-works" className="w-full py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple. Smart. Seamless.</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Forget the spreadsheet and the manual store searches.
                    </p>
                </div>
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors">
                            <div className="p-4 bg-background rounded-full shadow-sm ring-1 ring-border">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold">{step.title}</h3>
                            <p className="text-muted-foreground">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
