import { GoogleGenerativeAI } from '@google/generative-ai'

export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'custom_http_endpoint'

export interface AIModelResponse {
    content: string
    usage?: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
}

export interface AICompletionOptions {
    model?: string
    temperature?: number
    max_tokens?: number
    jsonMode?: boolean
}

export class AIModelRouter {
    private genAI: GoogleGenerativeAI | null = null

    constructor(private provider: AIProvider, private apiKey: string, private baseUrl?: string) {
        if (provider === 'gemini' && apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey)
        }
    }

    async generateCompletion(prompt: string, options?: AICompletionOptions): Promise<AIModelResponse> {
        switch (this.provider) {
            case 'gemini':
                return this.callGemini(prompt, options)
            case 'openai':
                return this.callOpenAI(prompt, options)
            default:
                throw new Error(`Provider ${this.provider} not implemented yet`)
        }
    }

    private async callGemini(prompt: string, options?: AICompletionOptions): Promise<AIModelResponse> {
        if (!this.genAI) {
            console.warn('Gemini API not initialized, returning mock response')
            return {
                content: 'AI not configured',
                usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
            }
        }

        try {
            const model = this.genAI.getGenerativeModel({
                model: options?.model || 'gemini-2.0-flash-exp'
            })

            const result = await model.generateContent(prompt)
            const response = await result.response
            const text = response.text()

            return {
                content: text,
                usage: {
                    prompt_tokens: 0,
                    completion_tokens: 0,
                    total_tokens: 0
                }
            }
        } catch (error) {
            console.error('Gemini API error:', error)
            return {
                content: 'Sorry, I had trouble processing that. Try again!',
                usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
            }
        }
    }

    private async callOpenAI(prompt: string, options?: AICompletionOptions): Promise<AIModelResponse> {
        console.log('Calling OpenAI with prompt:', prompt)
        return {
            content: 'Mock OpenAI Response',
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
        }
    }
}

// Singleton instance for convenience
let routerInstance: AIModelRouter | null = null

export function getAIRouter(): AIModelRouter {
    if (!routerInstance) {
        const apiKey = process.env.GEMINI_API_KEY || ''
        routerInstance = new AIModelRouter('gemini', apiKey)
    }
    return routerInstance
}

