import { ChatSession, Message, ChatState } from './types'

export class ChatStateMachine {

    static getInitialSession(): ChatSession {
        return {
            id: crypto.randomUUID(),
            messages: [{
                id: crypto.randomUUID(),
                role: 'assistant',
                content: "Hi! I'm FoodFriend. I help you eat better and stay on budget. Let's set you up. First, what should I call you?",
                timestamp: Date.now()
            }],
            state: 'ONBOARDING_NAME',
            userProfile: {
                connected_stores: [],
                permissions: []
            },
            cart: []
        }
    }

    static async handleInput(session: ChatSession, input: string): Promise<ChatSession> {
        const nextSession = { ...session }

        // Add user message
        nextSession.messages = [
            ...session.messages,
            {
                id: crypto.randomUUID(),
                role: 'user',
                content: input,
                timestamp: Date.now()
            }
        ]

        // Process State
        switch (session.state) {
            case 'ONBOARDING_NAME':
                nextSession.userProfile.name = input
                nextSession.state = 'ONBOARDING_LOCATION'
                nextSession.messages.push({
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: `Nice to meet you, ${input}. Where are you located? (City or Area)`,
                    timestamp: Date.now() + 100
                })
                break

            case 'ONBOARDING_LOCATION':
                nextSession.userProfile.city = input
                nextSession.state = 'ONBOARDING_CURRENCY'
                nextSession.messages.push({
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: "Got it. What's your preferred currency? (e.g. ZAR, USD)",
                    actions: [
                        { id: '1', label: 'ZAR', value: 'ZAR', type: 'button' },
                        { id: '2', label: 'USD', value: 'USD', type: 'button' },
                    ],
                    timestamp: Date.now() + 100
                })
                break

            case 'ONBOARDING_CURRENCY':
                nextSession.userProfile.currency = input
                nextSession.state = 'CONNECT_ACCOUNTS'
                nextSession.messages.push({
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: "Now let's connect the apps you already use so I can find you the best deals.",
                    type: 'store_grid',
                    // In a real app we'd fetch these from registry
                    data: {
                        stores: [
                            { key: 'checkers', name: 'Checkers Sixty60', connected: false },
                            { key: 'pnp', name: 'Pick n Pay', connected: false },
                            { key: 'uber_eats', name: 'Uber Eats', connected: false },
                            { key: 'mr_d', name: 'Mr D', connected: false },
                        ]
                    },
                    actions: [
                        { id: 'done', label: 'Done connecting', value: 'done', type: 'button' }
                    ],
                    timestamp: Date.now() + 100
                })
                break

            case 'CONNECT_ACCOUNTS':
                // If input is "done", move on. If it's a store key, toggle it.
                if (input.toLowerCase() === 'done') {
                    nextSession.state = 'HISTORY_PERMISSION'
                    nextSession.messages.push({
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: `Great! You've connected ${nextSession.userProfile.connected_stores.length} app(s). If you allow it, I'll scan your past orders to learn what you like and how you spend.`,
                        actions: [
                            { id: 'allow', label: 'Allow History Access', value: 'allow', type: 'button' },
                            { id: 'skip', label: 'Skip for now', value: 'skip', type: 'button' }
                        ],
                        timestamp: Date.now() + 100
                    })
                } else {
                    // Toggle store connection
                    const storeKey = input.toLowerCase()
                    const validStores = ['checkers', 'pnp', 'uber_eats', 'mr_d', 'woolworths', 'mcdonalds']

                    if (validStores.includes(storeKey)) {
                        const idx = nextSession.userProfile.connected_stores.indexOf(storeKey)
                        if (idx === -1) {
                            nextSession.userProfile.connected_stores.push(storeKey)
                        } else {
                            nextSession.userProfile.connected_stores.splice(idx, 1)
                        }

                        // Update the store grid message with new connected states
                        const lastGridIdx = nextSession.messages.findLastIndex(m => m.type === 'store_grid')
                        if (lastGridIdx !== -1) {
                            const allStores = [
                                { key: 'checkers', name: 'Checkers Sixty60' },
                                { key: 'pnp', name: 'Pick n Pay' },
                                { key: 'uber_eats', name: 'Uber Eats' },
                                { key: 'mr_d', name: 'Mr D' },
                            ]
                            nextSession.messages[lastGridIdx].data = {
                                stores: allStores.map(s => ({
                                    ...s,
                                    connected: nextSession.userProfile.connected_stores.includes(s.key)
                                }))
                            }
                        }
                    }
                }
                break

            case 'HISTORY_PERMISSION':
                if (input === 'allow') {
                    nextSession.userProfile.permissions.push('read_history')
                    nextSession.messages.push({
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: "Thanks! Reading your history... (Scanning past orders)",
                        timestamp: Date.now() + 100
                    })
                    nextSession.messages.push({
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: "I see you like burgers on Fridays! 🍔",
                        timestamp: Date.now() + 1000
                    })
                }

                nextSession.state = 'CONFIGURE_TOOLS'
                nextSession.messages.push({
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: "One more thing - what would you like help with?",
                    actions: [
                        { id: 'planning', label: '📅 Meal Planning', value: 'enable_planning', type: 'button' },
                        { id: 'budgets', label: '💰 Budget Tracking', value: 'enable_budgets', type: 'button' },
                        { id: 'skip_tools', label: 'Just order food', value: 'skip_tools', type: 'button' }
                    ],
                    timestamp: Date.now() + 1200
                })
                break

            case 'CONFIGURE_TOOLS':
                if (input === 'enable_planning') {
                    nextSession.userProfile.planningEnabled = true
                    nextSession.messages.push({
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: "Meal planning enabled! 📅 Any dietary preferences?",
                        actions: [
                            { id: 'veg', label: '🥬 Vegetarian', value: 'diet_vegetarian', type: 'button' },
                            { id: 'vegan', label: '🌱 Vegan', value: 'diet_vegan', type: 'button' },
                            { id: 'keto', label: '🥩 Keto', value: 'diet_keto', type: 'button' },
                            { id: 'halal', label: '🍖 Halal', value: 'diet_halal', type: 'button' },
                            { id: 'none', label: 'No restrictions', value: 'diet_none', type: 'button' }
                        ],
                        timestamp: Date.now() + 300
                    })
                } else if (input.startsWith('diet_')) {
                    const dietType = input.replace('diet_', '')
                    nextSession.userProfile.diet = { type: dietType, restrictions: [] }
                    nextSession.state = 'READY'
                    nextSession.messages.push({
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: `Got it! ${dietType !== 'none' ? `I'll keep your ${dietType} diet in mind.` : ''} All set! 🎉\n\nYou can ask me:\n• "I want a burger for R100"\n• "Plan my weekly groceries for R800"\n• "What's cheap to eat tonight?"`,
                        timestamp: Date.now() + 300
                    })
                } else if (input === 'enable_budgets') {
                    nextSession.messages.push({
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: "What's your weekly food budget? (You can always change this later)",
                        actions: [
                            { id: 'b500', label: 'R500/week', value: 'budget_500', type: 'button' },
                            { id: 'b1000', label: 'R1000/week', value: 'budget_1000', type: 'button' },
                            { id: 'b1500', label: 'R1500/week', value: 'budget_1500', type: 'button' },
                            { id: 'custom', label: 'Custom', value: 'budget_custom', type: 'button' }
                        ],
                        timestamp: Date.now() + 300
                    })
                } else if (input.startsWith('budget_')) {
                    const budgetValue = input.replace('budget_', '')
                    const weekly = budgetValue === 'custom' ? undefined : parseInt(budgetValue)
                    nextSession.userProfile.budget = { weekly }
                    nextSession.state = 'READY'
                    nextSession.messages.push({
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: `Budget set${weekly ? ` to R${weekly}/week` : ''}! 💰\n\nI'll help you stay on track. Ready to help!\n\n• "I want a burger for R100"\n• "Plan my weekly groceries"`,
                        timestamp: Date.now() + 300
                    })
                } else if (input === 'skip_tools') {
                    nextSession.state = 'READY'
                    nextSession.messages.push({
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: "All set! I'm ready to help. 🎉\n\nAsk me for:\n• Takeout: 'I want a burger for R100'\n• Groceries: 'I need groceries for R500'",
                        timestamp: Date.now() + 300
                    })
                } else {
                    // Unknown input in configure tools, just move to ready
                    nextSession.state = 'READY'
                    nextSession.messages.push({
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: "Got it! I'm ready to help whenever you need food. 🍔🥗",
                        timestamp: Date.now() + 300
                    })
                }
                break

            case 'READY':
                // Intent Classifier - handle actions and natural language
                const inputLower = input.toLowerCase()

                // Handle ORDER action from product list "+" button
                if (input.startsWith('order_')) {
                    const productId = input.replace('order_', '')
                    // Find the product in the last product_list message
                    const lastProductList = [...nextSession.messages].reverse().find(m => m.type === 'product_list')
                    if (lastProductList?.data?.products) {
                        const product = lastProductList.data.products.find((p: any) => p.id === productId)
                        if (product) {
                            // Add to cart
                            nextSession.cart.push({
                                id: productId,
                                name: product.name,
                                store: product.store,
                                price: product.price,
                                quantity: 1
                            })

                            const cartTotal = nextSession.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

                            nextSession.messages.push({
                                id: crypto.randomUUID(),
                                role: 'assistant',
                                content: `Added "${product.name}" to your cart! 🛒\n\nCart total: R${cartTotal}`,
                                type: 'checkout',
                                data: {
                                    items: nextSession.cart,
                                    total: cartTotal,
                                    store: product.store
                                },
                                actions: [
                                    { id: 'checkout', label: `Checkout (R${cartTotal})`, value: 'checkout', type: 'button' },
                                    { id: 'continue', label: 'Add more items', value: 'continue', type: 'button' }
                                ],
                                timestamp: Date.now() + 300
                            })
                        }
                    }
                }
                // Handle CHECKOUT action
                else if (input === 'checkout') {
                    const cartTotal = nextSession.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
                    const stores = [...new Set(nextSession.cart.map(item => item.store))]

                    nextSession.messages.push({
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: `Ready to checkout! Your order:\n\n${nextSession.cart.map(i => `• ${i.name} - R${i.price}`).join('\n')}\n\n**Total: R${cartTotal}**\n\nI'll open ${stores[0]} for you to complete payment.`,
                        actions: [
                            { id: 'open_app', label: `Open ${stores[0]}`, value: `open_${stores[0].toLowerCase().replace(' ', '_')}`, type: 'link', linkUrl: `https://www.google.com/search?q=${encodeURIComponent(stores[0])}` }
                        ],
                        timestamp: Date.now() + 300
                    })
                    // Clear cart after checkout
                    nextSession.cart = []
                }
                // Handle "continue shopping" after adding to cart
                else if (input === 'continue') {
                    nextSession.messages.push({
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: "Sure! What else would you like? You can search for food or ask for grocery suggestions.",
                        timestamp: Date.now() + 300
                    })
                }
                // Handle add all groceries (must be before grocery keyword check!)
                else if (input === 'add_all_groceries') {
                    const lastGroceryList = [...nextSession.messages].reverse().find(m => m.type === 'grocery_list')
                    if (lastGroceryList?.data?.items) {
                        lastGroceryList.data.items.forEach((item: any) => {
                            nextSession.cart.push({
                                id: crypto.randomUUID(),
                                name: item.name,
                                store: item.store,
                                price: item.price,
                                quantity: 1
                            })
                        })
                        const cartTotal = nextSession.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

                        nextSession.messages.push({
                            id: crypto.randomUUID(),
                            role: 'assistant',
                            content: `Added ${lastGroceryList.data.items.length} items to your cart! 🛒\n\n**Cart total: R${cartTotal}**`,
                            type: 'checkout',
                            data: { items: nextSession.cart, total: cartTotal },
                            actions: [
                                { id: 'checkout', label: `Checkout (R${cartTotal})`, value: 'checkout', type: 'button' },
                                { id: 'continue', label: 'Add more items', value: 'continue', type: 'button' }
                            ],
                            timestamp: Date.now() + 300
                        })
                    }
                }
                // Handle modify groceries
                else if (input === 'modify_groceries') {
                    nextSession.messages.push({
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: "What would you like to change? You can say things like 'remove chicken' or 'add tomatoes'.",
                        timestamp: Date.now() + 300
                    })
                }
                // Handle GROCERY intent with budget parsing
                else if (inputLower.includes('grocery') || inputLower.includes('groceries') || inputLower.includes('weekly') || inputLower.includes('shopping list')) {
                    // Try to extract budget from input - prioritize R-prefixed amounts
                    // First try to find "R1000" or "R 1000" format
                    const rPrefixMatch = input.match(/R\s?(\d+)/i)
                    // Fallback to "budget X" or just large numbers (100+)
                    const budgetWordMatch = input.match(/budget\s*R?\s*(\d+)/i)
                    // Get all numbers and take the largest one over 50
                    const allNumbers = input.match(/\d+/g)?.map(Number).filter(n => n >= 50) || []
                    const largestNumber = allNumbers.length > 0 ? Math.max(...allNumbers) : null

                    const budget = rPrefixMatch ? parseInt(rPrefixMatch[1])
                        : budgetWordMatch ? parseInt(budgetWordMatch[1])
                            : largestNumber

                    if (budget && budget >= 50) {
                        // Build grocery list scaled to budget - more items for larger budgets
                        const baseItems = [
                            { name: 'Milk (2L)', category: 'Dairy', price: 32, store: 'Checkers', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100&h=100&fit=crop' },
                            { name: 'Bread (White)', category: 'Bakery', price: 18, store: 'PnP', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=100&h=100&fit=crop' },
                            { name: 'Eggs (18 pack)', category: 'Dairy', price: 65, store: 'Checkers', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=100&h=100&fit=crop' },
                            { name: 'Chicken Breast (1kg)', category: 'Meat', price: 120, store: 'Checkers', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=100&h=100&fit=crop' },
                            { name: 'Rice (2kg)', category: 'Pantry', price: 45, store: 'PnP', image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=100&h=100&fit=crop' },
                            { name: 'Potatoes (2kg)', category: 'Vegetables', price: 35, store: 'Checkers', image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber8a?w=100&h=100&fit=crop' },
                            { name: 'Onions (1kg)', category: 'Vegetables', price: 25, store: 'PnP', image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=100&h=100&fit=crop' },
                            { name: 'Cooking Oil (2L)', category: 'Pantry', price: 85, store: 'Checkers', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100&h=100&fit=crop' },
                        ]

                        // Additional items for budgets R500+
                        const extraItems = [
                            { name: 'Beef Mince (500g)', category: 'Meat', price: 75, store: 'PnP', image: 'https://images.unsplash.com/photo-1602473812169-95bce60c79cb?w=100&h=100&fit=crop' },
                            { name: 'Pasta (500g)', category: 'Pantry', price: 28, store: 'Checkers', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=100&h=100&fit=crop' },
                            { name: 'Tomato Sauce (700g)', category: 'Pantry', price: 35, store: 'PnP', image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=100&h=100&fit=crop' },
                            { name: 'Cheese (400g)', category: 'Dairy', price: 85, store: 'Checkers', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=100&h=100&fit=crop' },
                            { name: 'Yoghurt (6 pack)', category: 'Dairy', price: 45, store: 'PnP', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100&h=100&fit=crop' },
                            { name: 'Apples (1.5kg)', category: 'Fruit', price: 40, store: 'Checkers', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop' },
                            { name: 'Bananas (1kg)', category: 'Fruit', price: 25, store: 'PnP', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100&h=100&fit=crop' },
                            { name: 'Carrots (1kg)', category: 'Vegetables', price: 22, store: 'Checkers', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=100&h=100&fit=crop' },
                        ]

                        // Premium items for budgets R800+
                        const premiumItems = [
                            { name: 'Lamb Chops (500g)', category: 'Meat', price: 110, store: 'Woolworths', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=100&h=100&fit=crop' },
                            { name: 'Salmon (250g)', category: 'Seafood', price: 95, store: 'Woolworths', image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=100&h=100&fit=crop' },
                            { name: 'Fresh Herbs Bundle', category: 'Vegetables', price: 35, store: 'Woolworths', image: 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=100&h=100&fit=crop' },
                            { name: 'Butter (500g)', category: 'Dairy', price: 75, store: 'PnP', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=100&h=100&fit=crop' },
                        ]

                        // Build list based on budget
                        let groceryItems = [...baseItems]
                        if (budget >= 500) groceryItems = [...groceryItems, ...extraItems]
                        if (budget >= 800) groceryItems = [...groceryItems, ...premiumItems]

                        const total = groceryItems.reduce((sum, i) => sum + i.price, 0)
                        const withinBudget = total <= budget
                        const savings = budget - total

                        nextSession.messages.push({
                            id: crypto.randomUUID(),
                            role: 'assistant',
                            content: `Here's your weekly grocery list for R${budget}:\n\n**${groceryItems.length} items • Total: R${total}** ${withinBudget ? `✅ R${savings} under budget!` : '⚠️ Slightly over budget'}`,
                            type: 'grocery_list',
                            data: {
                                items: groceryItems,
                                total: total,
                                budget: budget
                            },
                            actions: [
                                { id: 'add_all', label: 'Add All to Cart', value: 'add_all_groceries', type: 'button' },
                                { id: 'modify', label: 'Modify List', value: 'modify_groceries', type: 'button' }
                            ],
                            timestamp: Date.now() + 500
                        })
                    } else {
                        nextSession.messages.push({
                            id: crypto.randomUUID(),
                            role: 'assistant',
                            content: "I can help with groceries! What's your budget for this run? (e.g., 'R500' or 'R1000')",
                            timestamp: Date.now() + 300
                        })
                    }
                }
                // Handle FOOD CRAVING intent (burger, pizza, etc.)
                else if (inputLower.includes('burger') || inputLower.includes('pizza') || inputLower.includes('chicken') || inputLower.includes('food') || inputLower.includes('hungry') || inputLower.includes('eat')) {
                    // Extract food type and budget
                    let foodType = 'food'
                    if (inputLower.includes('burger')) foodType = 'burger'
                    else if (inputLower.includes('pizza')) foodType = 'pizza'
                    else if (inputLower.includes('chicken')) foodType = 'chicken'

                    const budgetMatch = input.match(/R?(\d+)/i)
                    const budget = budgetMatch ? parseInt(budgetMatch[1]) : 100

                    // Product images from Unsplash (free to use)
                    const productImages: Record<string, string[]> = {
                        burger: [
                            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
                            'https://images.unsplash.com/photo-1550317138-10000687a72b?w=200&h=200&fit=crop',
                            'https://images.unsplash.com/photo-1586816001966-79b736744398?w=200&h=200&fit=crop'
                        ],
                        pizza: [
                            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
                            'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop',
                            'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop'
                        ],
                        chicken: [
                            'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200&h=200&fit=crop',
                            'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop',
                            'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=200&h=200&fit=crop'
                        ],
                        food: [
                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
                            'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop',
                            'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200&h=200&fit=crop'
                        ]
                    }

                    const images = productImages[foodType] || productImages.food

                    // More product options for carousel scrolling
                    const foodName = foodType.charAt(0).toUpperCase() + foodType.slice(1)

                    nextSession.messages.push({
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: `Found ${foodType} options under R${budget}! Swipe to see all →`,
                        type: 'product_list',
                        data: {
                            query: foodType,
                            products: [
                                { name: `Classic ${foodName}`, store: 'Uber Eats', price: Math.min(85, budget - 10), eta: '25m', id: 'p1', image: images[0] },
                                { name: `Premium ${foodName}`, store: 'Mr D', price: Math.min(95, budget), eta: '30m', id: 'p2', image: images[1] },
                                { name: `Budget ${foodName}`, store: 'Checkers', price: Math.min(45, budget - 20), eta: '45m', id: 'p3', image: images[2] },
                                { name: `Gourmet ${foodName}`, store: 'Pick n Pay', price: Math.min(110, budget + 10), eta: '35m', id: 'p4', image: images[0] },
                                { name: `Family ${foodName}`, store: 'Uber Eats', price: Math.min(140, budget + 30), eta: '40m', id: 'p5', image: images[1] },
                                { name: `Combo ${foodName}`, store: 'Mr D', price: Math.min(120, budget + 20), eta: '30m', id: 'p6', image: images[2] },
                            ]
                        },
                        timestamp: Date.now() + 500
                    })
                }
                // Default fallback
                else {
                    nextSession.messages.push({
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: "I can help with:\n• **Takeout**: 'I want a burger for R100'\n• **Groceries**: 'I need groceries for R500'\n• **Cart**: 'What's in my cart?'\n\nWhat would you like?",
                        timestamp: Date.now() + 300
                    })
                }
                break
        }

        return nextSession
    }
}
