'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { CreatePlanForm } from '@/components/planner/CreatePlanForm'
import { PlannerHistoryList } from '@/components/planner/PlannerHistoryList'

export default function PlannerPage() {
    const router = useRouter()
    const [plans, setPlans] = useState<any[]>([])
    const [showCreate, setShowCreate] = useState(false)

    // Load plans from local storage
    useEffect(() => {
        const saved = localStorage.getItem('autocart_plans')
        if (saved) {
            setPlans(JSON.parse(saved))
        }
    }, [])

    const handleCreate = async (formData: any) => {
        try {
            // Fetch default model (mocked for now)
            // In real app, we'd get this from the DB or context
            const modelConfig = { provider: 'gemini', apiKey: 'mock-key' }

            const response = await fetch('/api/meal-plan/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    days: formData.days,
                    people: formData.people,
                    budget: formData.budget,
                    startDate: formData.startDate,
                    modelConfig
                })
            })

            const data = await response.json()

            if (data.status === 'success') {
                // Parse the raw AI plan if needed, but for now we just use the params + ID
                // The API returned 'raw_plan', but we need to structure it into our list
                // This is a simplification for the prototype

                const end = new Date(formData.startDate)
                end.setDate(new Date(formData.startDate).getDate() + formData.days)

                const newPlan = {
                    id: crypto.randomUUID(), // or data.meal_plan_id if API returned it
                    title: `AI Plan: ${new Date(formData.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
                    start_date: formData.startDate,
                    end_date: end.toISOString().split('T')[0],
                    total_budget: formData.budget,
                    status: 'draft',
                    created_at: new Date().toISOString()
                }

                const updatedPlans = [newPlan, ...plans]
                setPlans(updatedPlans)
                localStorage.setItem('autocart_plans', JSON.stringify(updatedPlans))
                setShowCreate(false)
            } else {
                alert('Failed to generate plan: ' + (data.error || 'Unknown error'))
            }
        } catch (e) {
            console.error(e)
            alert('Error connecting to API')
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Meal Planner</h1>
                    <p className="text-muted-foreground">
                        Plan your meals, optimize your budget.
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Plan
                </button>
            </div>

            {showCreate && (
                <div className="rounded-xl border bg-card p-6 shadow-sm border-primary/20 bg-primary/5 animate-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Generate New Plan</h2>
                        <button onClick={() => setShowCreate(false)} className="text-sm text-muted-foreground hover:text-foreground">Close</button>
                    </div>
                    <CreatePlanForm onSubmit={handleCreate} />
                </div>
            )}

            <PlannerHistoryList plans={plans} />
        </div>
    )
}
