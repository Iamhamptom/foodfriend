import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface ChatRequest {
    message: string
    context?: {
        userProfile?: any
        cart?: any[]
        state?: string
    }
}

const SYSTEM_PROMPT = `You are FoodFriend, a helpful AI food concierge assistant for South Africa.

Your role:
- Help users order takeout and groceries
- Find the best prices across stores like Checkers, Pick n Pay, Uber Eats, Mr D
- Stay within their budget
- Remember their dietary preferences

Rules:
1. Be friendly, concise, and helpful
2. Always mention prices in ZAR (R)
3. If user asks for food, suggest options with prices
4. If user seems confused, offer clear options
5. Keep responses under 100 words

Current context will be provided with each message.`

export async function POST(request: NextRequest) {
    try {
        const body: ChatRequest = await request.json()
        const { message, context } = body

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                response: "I'm running in demo mode. For full AI features, add your Gemini API key!",
                intent: 'fallback'
            })
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

        // Build context-aware prompt
        const contextInfo = context ? `
User Profile: ${JSON.stringify(context.userProfile || {})}
Cart Items: ${context.cart?.length || 0} items
Current State: ${context.state || 'READY'}
` : ''

        const prompt = `${SYSTEM_PROMPT}

${contextInfo}

User says: "${message}"

Respond naturally as FoodFriend. If the user is asking about food, include specific product suggestions with realistic South African prices. If they mention a budget, stay within it.

Your response:`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // Simple intent detection based on the original message
        let intent = 'general'
        const msgLower = message.toLowerCase()
        if (msgLower.includes('burger') || msgLower.includes('pizza') || msgLower.includes('chicken') || msgLower.includes('food') || msgLower.includes('hungry')) {
            intent = 'takeout'
        } else if (msgLower.includes('grocery') || msgLower.includes('groceries') || msgLower.includes('shopping')) {
            intent = 'grocery'
        } else if (msgLower.includes('cart') || msgLower.includes('checkout')) {
            intent = 'cart'
        } else if (msgLower.includes('budget') || msgLower.includes('spend')) {
            intent = 'budget'
        }

        return NextResponse.json({
            response: text,
            intent: intent
        })

    } catch (error) {
        console.error('Chat API error:', error)
        return NextResponse.json({
            response: "Sorry, I had a hiccup! Try again in a moment.",
            intent: 'error'
        }, { status: 500 })
    }
}
