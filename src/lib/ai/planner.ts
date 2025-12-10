import { AIModelRouter } from './router'

export interface MealPlanParams {
    days: number
    people: number
    dietProfile: {
        type: string
        allergies: string[]
        dislikes: string[]
        calorieTarget?: number
    }
    budget: {
        amount: number
        currency: string
    }
}

export class AIPlannerService {
    private router: AIModelRouter

    constructor(provider: 'gemini' | 'openai', apiKey: string) {
        this.router = new AIModelRouter(provider, apiKey)
    }

    generateSystemPrompt(): string {
        return `You are an expert personal chef and nutritionist. 
Your goal is to create a detailed, healthy, and budget-conscious meal plan.
Output MUST be valid JSON matching the specified schema.
Do not include markdown formatting like \`\`\`json.`
    }

    generateUserPrompt(params: MealPlanParams): string {
        return `Create a ${params.days}-day meal plan for ${params.people} people.
Diet: ${params.dietProfile.type}
Allergies: ${params.dietProfile.allergies.join(', ')}
Budget Target: ${params.budget.currency} ${params.budget.amount}

Provide 3 meals (Breakfast, Lunch, Dinner) per day.

Response Schema:
{
  "title": "Strategy for the plan",
  "meals": [
    {
       "day": 1,
       "type": "breakfast",
       "title": "Meal Name",
       "description": "Short description",
       "ingredients": [{ "name": "item", "quantity": 1, "unit": "kg" }]
    }
  ]
}`
    }

    async generatePlan(params: MealPlanParams) {
        const system = this.generateSystemPrompt()
        const user = this.generateUserPrompt(params)

        // In a real implementation with Gemini, we would use the system instruction
        // For now, we concatenate
        const response = await this.router.generateCompletion(`${system}\n\n${user}`, {
            jsonMode: true
        })

        return response.content
    }
}
