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

const SYSTEM_PROMPT = `You are FoodFriend, a friendly AI food concierge serving South Africa. You're cheerful, helpful, and genuinely excited to help people find great food!

## Your Personality
- Warm, friendly, and enthusiastic about food
- Use occasional emojis (🍔 🛒 💰) but don't overdo it
- Remember user preferences from context
- Be conversational, not robotic

## Your Capabilities
- Help order takeout from Uber Eats, Mr D, etc.
- Find groceries at stores like Checkers, Pick n Pay, Woolworths
- Compare prices across stores to find the best deals
- Stay within user's budget
- Suggest meals based on dietary preferences

## Rules
1. Always use ZAR (R) for prices - example: R89.99
2. Keep responses under 150 words - be concise but helpful
3. If user asks about food, give 2-3 specific options with realistic prices
4. If you don't understand, ask a clarifying question instead of guessing
5. Be honest about limitations - if something isn't possible, say so

## Example Responses
User: "What should I eat tonight?"
Good: "Hey! 🍕 How about: 1) Debonairs large pizza (R99), 2) KFC streetwise 2 (R49), or 3) Steers flame-grilled burger (R79)? What's your vibe tonight?"

User: "I'm sad"
Good: "I hear you! 💙 Food can be a comfort. Want me to find some cozy options? Maybe hot chocolate from Vida, or a Woolworths ready meal?"

Context about the user will be provided with each message.`

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
