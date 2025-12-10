'use client'

import { useState } from 'react'
import { Calendar, Users, Calculator, Wand2 } from 'lucide-react'
import { cn } from '@/components/ui/utils'

export function CreatePlanForm({ onSubmit }: { onSubmit: (data: any) => void }) {
    const [formData, setFormData] = useState({
        startDate: new Date().toISOString().split('T')[0],
        days: 7,
        people: 2,
        budget: 2000
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Start Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="date"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Duration (Days)</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={formData.days}
                            onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                        >
                            {[3, 5, 7, 14, 28].map(d => (
                                <option key={d} value={d}>{d} Days</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">People</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="number"
                                min={1}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm"
                                value={formData.people}
                                onChange={(e) => setFormData({ ...formData, people: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Budget Target</label>
                        <div className="relative">
                            <Calculator className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="number"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Plan
            </button>
        </div>
    )
}
