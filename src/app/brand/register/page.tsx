'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'

export default function BrandRegisterPage() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        phone: '',
        website: '',
        category: 'restaurant',
        description: '',
        agreeTerms: false
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setLoading(false)
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-background">
                <div className="max-w-md text-center">
                    <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
                    <p className="text-muted-foreground mb-8">
                        Thank you for applying to become a FoodFriend partner! Our team will review your application within 2-3 business days.
                    </p>
                    <p className="text-sm text-muted-foreground mb-8">
                        We'll send an email to <span className="font-medium text-foreground">{formData.email}</span> once your application is approved.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Back to Home
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-background">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mx-auto mb-4">
                        <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Become a FoodFriend Partner</h1>
                    <p className="text-muted-foreground">
                        Join our platform and reach thousands of hungry customers
                    </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { emoji: '📈', label: 'Grow Sales', desc: 'Reach new customers' },
                        { emoji: '💰', label: 'Low Fees', desc: 'Only 10-15% commission' },
                        { emoji: '📊', label: 'Analytics', desc: 'Track performance' },
                    ].map((item) => (
                        <div key={item.label} className="p-4 rounded-xl bg-card border text-center">
                            <div className="text-3xl mb-2">{item.emoji}</div>
                            <div className="font-semibold">{item.label}</div>
                            <div className="text-xs text-muted-foreground">{item.desc}</div>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-card border">
                    <h2 className="text-xl font-semibold mb-6">Business Details</h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Company Name *</label>
                                <input
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg bg-background border focus:ring-2 focus:ring-purple-500"
                                    placeholder="Your Restaurant/Store Name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg bg-background border focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="restaurant">Restaurant</option>
                                    <option value="fast_food">Fast Food</option>
                                    <option value="grocery">Grocery Store</option>
                                    <option value="cafe">Café/Coffee Shop</option>
                                    <option value="bakery">Bakery</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Business Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg bg-background border focus:ring-2 focus:ring-purple-500"
                                    placeholder="partner@yourcompany.co.za"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg bg-background border focus:ring-2 focus:ring-purple-500"
                                    placeholder="011 123 4567"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Website</label>
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg bg-background border focus:ring-2 focus:ring-purple-500"
                                placeholder="https://www.yourcompany.co.za"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Tell us about your business</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg bg-background border focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                                placeholder="What type of food do you serve? How many locations do you have?"
                            />
                        </div>

                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={formData.agreeTerms}
                                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                                className="mt-1 rounded"
                                required
                            />
                            <span className="text-sm text-muted-foreground">
                                I agree to the <a href="#" className="text-purple-500 hover:underline">Partner Terms of Service</a> and <a href="#" className="text-purple-500 hover:underline">Commission Guidelines</a>
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={loading || !formData.agreeTerms}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Submit Application
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Already a partner?{' '}
                    <Link href="/brand" className="text-purple-500 hover:underline">
                        Sign in to your dashboard
                    </Link>
                </p>
            </div>
        </div>
    )
}
