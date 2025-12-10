import Link from 'next/link'
import { ArrowRight, Sparkles, ShoppingCart, Utensils, PiggyBank, Clock, Star, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-emerald-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Food Assistant</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your Personal{' '}
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Food Concierge
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Order takeout, plan groceries, and save money - all through a simple conversation with AI.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/chat"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-emerald-500 text-white font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105"
            >
              Start Chatting
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/how-it-works"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-border bg-background/50 backdrop-blur-sm font-semibold text-lg hover:bg-muted transition-colors"
            >
              How It Works
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-8 mt-12 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm">4.9 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm">Instant Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-emerald-400" />
              <span className="text-sm">Save 20% Monthly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              FoodFriend combines all your food apps into one intelligent assistant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Utensils,
                title: 'Takeout Orders',
                description: 'Find the best deals from Uber Eats, Mr D, and more',
                color: 'text-orange-500',
                bg: 'bg-orange-500/10'
              },
              {
                icon: ShoppingCart,
                title: 'Grocery Shopping',
                description: 'Plan weekly groceries with budget optimization',
                color: 'text-blue-500',
                bg: 'bg-blue-500/10'
              },
              {
                icon: PiggyBank,
                title: 'Budget Tracking',
                description: 'Stay on budget with smart spending alerts',
                color: 'text-emerald-500',
                bg: 'bg-emerald-500/10'
              },
              {
                icon: Clock,
                title: 'Meal Planning',
                description: 'AI-generated meal plans based on your preferences',
                color: 'text-purple-500',
                bg: 'bg-purple-500/10'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className={`h-12 w-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple as 1-2-3
            </h2>
            <p className="text-muted-foreground text-lg">
              Start using FoodFriend in under a minute
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Your Apps',
                description: 'Link your existing Uber Eats, Checkers, PnP accounts'
              },
              {
                step: '02',
                title: 'Tell Us What You Want',
                description: '"I want a burger for R100" or "Weekly groceries for R800"'
              },
              {
                step: '03',
                title: 'We Handle the Rest',
                description: 'FoodFriend finds the best options and places your order'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Learn more about how it works
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary/10 via-background to-emerald-900/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform How You Eat?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of users saving time and money with FoodFriend.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-emerald-500 text-white font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
