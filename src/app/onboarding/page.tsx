'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { LocationForm } from '@/components/onboarding/LocationForm'
import { DietPreferencesForm } from '@/components/onboarding/DietPreferencesForm'
import { BudgetPreferenceForm } from '@/components/onboarding/BudgetPreferenceForm'
import { supabase } from '@/lib/supabase/client' // Direct import for now, or use context? Client component so import is fine.

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        location_city: '',
        diet_type: 'none',
        allergies_input: '',
        daily_calorie_target: '',
        weekly_budget_target: '',
        default_currency: 'ZAR'
    })

    // Total steps
    const totalSteps = 3

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1)
        } else {
            finishOnboarding()
        }
    }

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    const finishOnboarding = async () => {
        setLoading(true)
        try {
            // 1. Create or Update User (Anonymous/Guest or Auth?)
            // For now, let's assume we just store this in localStorage if no auth, OR
            // we insert into Supabase if we have a session.
            // Since specific auth requirements weren't detailed in the "User Request" (it says SupabaseAuthOrNextAuth),
            // but we haven't implemented Auth UI yet.
            // I will save to localStorage for MVP continuity, and try to upsert if user exists.

            localStorage.setItem('autocart_onboarding_data', JSON.stringify(data))

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800))

            // Navigate to next screen
            router.push('/models')

        } catch (error) {
            console.error('Error saving onboarding data', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
            <div className="w-full max-w-lg space-y-8">

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                        <span>Step {step} of {totalSteps}</span>
                        <span>{step === 1 ? 'Location' : step === 2 ? 'Preferences' : 'Budget'}</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-in-out"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Card */}
                <div className="bg-card border border-border rounded-xl shadow-lg p-6 min-h-[400px] flex flex-col justify-between">
                    <div>
                        {step === 1 && <LocationForm data={data} updateData={setData} />}
                        {step === 2 && <DietPreferencesForm data={data} updateData={setData} />}
                        {step === 3 && <BudgetPreferenceForm data={data} updateData={setData} />}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between pt-8">
                        <button
                            onClick={handleBack}
                            disabled={step === 1 || loading}
                            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-0 transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={loading}
                            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {loading ? (
                                'Saving...'
                            ) : step === totalSteps ? (
                                <>Finish <Check className="ml-2 h-4 w-4" /></>
                            ) : (
                                <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
