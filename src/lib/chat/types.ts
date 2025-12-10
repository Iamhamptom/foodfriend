export type MessageRole = 'user' | 'assistant' | 'system'

export type MessageType = 'text' | 'action_card' | 'store_grid' | 'product_list' | 'checkout' | 'grocery_list'

export interface Action {
    id: string
    label: string
    value: string
    type: 'button' | 'link'
    linkUrl?: string
}

export interface Message {
    id: string
    role: MessageRole
    content: string
    type?: MessageType
    actions?: Action[] // For simple quick replies like "Yes/No" or "Checkers/PnP"
    data?: any // For complex payloads like Product[] or Store[]
    timestamp: number
}

export type ChatState =
    | 'WELCOME'
    | 'ONBOARDING_NAME'
    | 'ONBOARDING_LOCATION'
    | 'ONBOARDING_CURRENCY'
    | 'CONNECT_ACCOUNTS'
    | 'HISTORY_PERMISSION'
    | 'CONFIGURE_TOOLS'
    | 'READY' // The main "concierge" mode

export interface UserProfile {
    name?: string
    city?: string
    currency?: string
    connected_stores: string[]
    permissions: string[]
    preferred_store?: string
    // Phase E additions
    diet?: {
        type: string  // 'none' | 'vegetarian' | 'vegan' | 'keto' | 'halal'
        restrictions: string[]
    }
    budget?: {
        weekly?: number
        monthly?: number
    }
    planningEnabled?: boolean
}

export interface CartItem {
    id: string
    name: string
    store: string
    price: number
    quantity: number
}

export interface ChatSession {
    id: string
    messages: Message[]
    state: ChatState
    userProfile: UserProfile
    cart: CartItem[]
}

