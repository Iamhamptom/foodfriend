import { NextResponse } from 'next/server'
import { AIPlannerService } from '@/lib/ai/planner'

// Mock database interactions for now
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { days, people, budget, dietProfile, modelConfig } = body

        if (!modelConfig) {
            return NextResponse.json({ error: 'No AI model configured' }, { status: 400 })
        }

        const planner = new AIPlannerService(modelConfig.provider, modelConfig.apiKey)

        // In a real app, we would fetch User preferences from DB if not passed
        const planJson = await planner.generatePlan({
            days,
            people,
            budget: { amount: budget, currency: 'ZAR' },
            dietProfile: dietProfile || { type: 'none', allergies: [], dislikes: [] }
        })

        // Mock parsing and saving
        // const parsed = JSON.parse(planJson)
        // await supabase.from('meal_plans').insert(...)

        return NextResponse.json({
            status: 'success',
            message: 'Plan generated',
            // Return raw for debug/MVP
            raw_plan: planJson
        })

    } catch (error) {
        console.error('Meal Plan API Error:', error)
        return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 })
    }
}
