'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, ArrowLeft, Ticket, Clock, CheckCircle } from 'lucide-react'
import { cn } from '@/components/ui/utils'

export default function SupportPage() {
    const [subject, setSubject] = useState('')
    const [category, setCategory] = useState('order')
    const [description, setDescription] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In production, this would submit to the database
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <div className="py-16 px-4">
                <div className="max-w-md mx-auto text-center">
                    <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Ticket Submitted!</h1>
                    <p className="text-muted-foreground mb-6">
                        We've received your support request. Our team will respond within 24 hours.
                    </p>
                    <p className="text-sm text-muted-foreground mb-8">
                        Ticket ID: <span className="font-mono font-bold">TKT-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/support/tickets"
                            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                        >
                            View My Tickets
                        </Link>
                        <Link
                            href="/chat"
                            className="px-6 py-3 rounded-lg border font-semibold hover:bg-muted transition-colors"
                        >
                            Back to Chat
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Back link */}
                <Link href="/chat" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Chat
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        <Ticket className="h-8 w-8 text-primary" />
                        Get Support
                    </h1>
                    <p className="text-muted-foreground">
                        Having an issue? Submit a ticket and our team will help you out.
                    </p>
                </div>

                {/* Quick Help */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { emoji: '📦', label: 'Order Issues', desc: 'Track, cancel, or report problems' },
                        { emoji: '💳', label: 'Payments', desc: 'Refunds and billing questions' },
                        { emoji: '👤', label: 'Account', desc: 'Login and profile help' },
                    ].map((item) => (
                        <div key={item.label} className="p-4 rounded-xl bg-card border">
                            <div className="text-2xl mb-2">{item.emoji}</div>
                            <div className="font-medium text-sm">{item.label}</div>
                            <div className="text-xs text-muted-foreground">{item.desc}</div>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-card border">
                    <h2 className="text-lg font-semibold mb-4">Submit a Ticket</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-background border focus:ring-2 focus:ring-primary"
                            >
                                <option value="order">Order Issue</option>
                                <option value="payment">Payment / Refund</option>
                                <option value="account">Account Access</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-background border focus:ring-2 focus:ring-primary"
                                placeholder="Brief description of your issue"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-background border focus:ring-2 focus:ring-primary min-h-[150px]"
                                placeholder="Please provide as much detail as possible..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                        >
                            <Send className="h-5 w-5" />
                            Submit Ticket
                        </button>
                    </div>
                </form>

                {/* Response time */}
                <div className="mt-6 p-4 rounded-xl bg-muted/50 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                        Average response time: <span className="font-medium text-foreground">2-4 hours</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
