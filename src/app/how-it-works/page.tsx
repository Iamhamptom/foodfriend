import Link from 'next/link'
import { ArrowRight, UserPlus, MessageCircle, ShoppingBag, CheckCircle, HelpCircle } from 'lucide-react'

export default function HowItWorksPage() {
    const steps = [
        {
            icon: UserPlus,
            title: 'Create Your Profile',
            description: 'Tell FoodFriend your name, location, and preferred currency. No passwords or lengthy forms - just a quick chat.',
            color: 'text-blue-500',
            bg: 'bg-blue-500'
        },
        {
            icon: MessageCircle,
            title: 'Connect Your Apps',
            description: 'Link your existing Uber Eats, Checkers Sixty60, Pick n Pay, and Mr D accounts. We\'ll learn your preferences from your order history.',
            color: 'text-purple-500',
            bg: 'bg-purple-500'
        },
        {
            icon: ShoppingBag,
            title: 'Tell Us What You Want',
            description: 'Just type naturally: "I want a burger for R100" or "Plan my groceries for R800 this week". Our AI understands your needs.',
            color: 'text-orange-500',
            bg: 'bg-orange-500'
        },
        {
            icon: CheckCircle,
            title: 'We Handle Everything',
            description: 'FoodFriend finds the best options across all your connected apps, compares prices, and lets you checkout with a single tap.',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500'
        }
    ]

    const faqs = [
        {
            q: 'Is FoodFriend free to use?',
            a: 'Yes! FoodFriend is completely free. We earn a small referral fee from partner stores when you place an order.'
        },
        {
            q: 'Which stores are supported?',
            a: 'We currently support Uber Eats, Mr D, Checkers Sixty60, and Pick n Pay. More stores coming soon!'
        },
        {
            q: 'Is my data safe?',
            a: 'Absolutely. We never store your login credentials. We use secure OAuth to connect to your accounts and all data is encrypted.'
        },
        {
            q: 'Can I use FoodFriend on mobile?',
            a: 'Yes! Our website is fully responsive and works great on phones and tablets.'
        }
    ]

    return (
        <div className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                        How FoodFriend Works
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Get started in under a minute. Here's how our AI food concierge helps you eat better and save money.
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-12 mb-24">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex gap-6 items-start">
                            <div className="flex-shrink-0">
                                <div className={`h-12 w-12 rounded-xl ${step.bg} flex items-center justify-center text-white font-bold text-lg`}>
                                    {idx + 1}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                    <step.icon className={`h-5 w-5 ${step.color}`} />
                                    {step.title}
                                </h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mb-24 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-emerald-500/10 border">
                    <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
                    <Link
                        href="/chat"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Start Chatting Now
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* FAQ */}
                <div>
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <HelpCircle className="h-6 w-6 text-primary" />
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="p-6 rounded-xl bg-card border">
                                <h3 className="font-semibold mb-2">{faq.q}</h3>
                                <p className="text-muted-foreground">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
