'use client'

import Link from 'next/link'
import { CalendarDays, ChevronRight, Utensils } from 'lucide-react'
import { cn } from '@/components/ui/utils'

interface MealPlan {
    id: string
    title: string
    start_date: string
    end_date: string
    status: string
    total_budget: number
}

interface PlannerHistoryListProps {
    plans: MealPlan[]
}

export function PlannerHistoryList({ plans }: PlannerHistoryListProps) {
    if (plans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-xl bg-secondary/20">
                <Utensils className="h-12 w-12 mb-4 opacity-50" />
                <p className="font-medium">No meal plans yet.</p>
                <p className="text-sm">Create your first one to get started.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Plans</h3>
            <div className="grid gap-4">
                {plans.map((plan) => (
                    <Link
                        href={`/plan/${plan.id}`}
                        key={plan.id}
                        className="group flex items-center justify-between rounded-xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                                <CalendarDays className="h-6 w-6 text-foreground group-hover:text-primary" />
                            </div>
                            <div>
                                <h4 className="font-semibold group-hover:text-primary transition-colors">{plan.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="font-medium">R {plan.total_budget}</p>
                                <span className={cn(
                                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                                    plan.status === 'final' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"
                                )}>
                                    {plan.status}
                                </span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
