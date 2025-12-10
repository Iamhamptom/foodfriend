import { Check } from 'lucide-react'
import { cn } from '@/components/ui/utils'

interface DietPreferencesFormProps {
    data: any
    updateData: (data: any) => void
}

const DIET_TYPES = [
    { id: 'none', label: 'No Preference', emoji: '🍽️' },
    { id: 'vegan', label: 'Vegan', emoji: '🌱' },
    { id: 'vegetarian', label: 'Vegetarian', emoji: '🥦' },
    { id: 'keto', label: 'Keto', emoji: '🥩' },
    { id: 'paleo', label: 'Paleo', emoji: '🍖' },
    { id: 'halal', label: 'Halal', emoji: '🕌' },
]

export function DietPreferencesForm({ data, updateData }: DietPreferencesFormProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Dietary Preferences</h2>
                <p className="text-muted-foreground">
                    Select a primary diet to help AI tailor your meals.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {DIET_TYPES.map((diet) => (
                    <div
                        key={diet.id}
                        className={cn(
                            "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center space-y-2 transition-all hover:border-primary/50 hover:bg-secondary/50",
                            data.diet_type === diet.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                        )}
                        onClick={() => updateData({ ...data, diet_type: diet.id })}
                    >
                        <span className="text-2xl">{diet.emoji}</span>
                        <span className="font-medium text-sm text-center">{diet.label}</span>
                        {data.diet_type === diet.id && (
                            <div className="absolute top-2 right-2">
                                {/* Could add check icon here if needed, but border is enough */}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Allergies / Dislikes (Optional)</label>
                <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. Peanuts, Shellfish, Mushrooms"
                    value={data.allergies_input || ''}
                    onChange={(e) => updateData({ ...data, allergies_input: e.target.value })}
                />
                <p className="text-[0.8rem] text-muted-foreground">
                    Separate multiples with commas.
                </p>
            </div>
        </div>
    )
}
