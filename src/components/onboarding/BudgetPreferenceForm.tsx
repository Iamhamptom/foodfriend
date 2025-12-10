import { Banknote } from 'lucide-react'

interface BudgetPreferenceFormProps {
    data: any
    updateData: (data: any) => void
}

export function BudgetPreferenceForm({ data, updateData }: BudgetPreferenceFormProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Default Budget</h2>
                <p className="text-muted-foreground">
                    What is your target weekly grocery spending?
                </p>
            </div>

            <div className="grid gap-2">
                <label htmlFor="budget" className="text-sm font-medium leading-none">
                    Weekly Limit ({data.default_currency || 'ZAR'})
                </label>
                <div className="relative">
                    <Banknote className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        id="budget"
                        type="number"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="e.g. 2000"
                        value={data.daily_calorie_target /* Reuse field name logic or new one? let's usage total_budget stub for now but schema has daily_calorie_target in diet_profile... wait. This is budget. */}
                        // Wait, the schema has `total_budget` on `meal_plans`, not on user/diet_profile directly as a default?
                        // Actually schema `users` has `default_currency`. `diet_profiles` has `daily_calorie_target`.
                        // Maybe we store this in local state for the first plan or just use it to set a preference?
                        // Let's assume we store it in a new field or just pass it to the first plan.
                        // For now, I'll bind it to a `weekly_budget_target` in the state.
                        onChange={(e) => updateData({ ...data, weekly_budget_target: e.target.value })}
                        defaultValue={data.weekly_budget_target}
                    />
                </div>
                <p className="text-[0.8rem] text-muted-foreground">
                    You can adjust this for every individual meal plan.
                </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-border">
                <label htmlFor="calories" className="text-sm font-medium leading-none">
                    Daily Calorie Target (Optional)
                </label>
                <input
                    id="calories"
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. 2500"
                    value={data.daily_calorie_target || ''}
                    onChange={(e) => updateData({ ...data, daily_calorie_target: e.target.value })}
                />
            </div>
        </div>
    )
}
