import { NextResponse } from 'next/server'
import { ShoppingListService } from '@/lib/shopping-list/service'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { meal_plan_id } = body

        if (!meal_plan_id) {
            return NextResponse.json({ error: 'Missing meal_plan_id' }, { status: 400 })
        }

        // Fetch plan from DB (mocked)
        const plan = { id: meal_plan_id, meals: [] }

        const service = new ShoppingListService()
        const items = await service.generateListFromPlan(plan)

        // Calculate total estimated cost
        const totalCost = items.reduce((sum, item) => sum + (item.best_price || 0) * item.quantity, 0)

        return NextResponse.json({
            status: 'success',
            shopping_list: {
                id: crypto.randomUUID(),
                plan_id: meal_plan_id,
                items: items,
                estimated_total: totalCost,
                currency: 'ZAR'
            }
        })

    } catch (error) {
        console.error('Shopping List API Error:', error)
        return NextResponse.json({ error: 'Failed to generate list' }, { status: 500 })
    }
}
