export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    name: string | null
                    location_city: string | null
                    location_lat: number | null
                    location_lng: number | null
                    default_currency: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    name?: string | null
                    location_city?: string | null
                    location_lat?: number | null
                    location_lng?: number | null
                    default_currency?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string | null
                    location_city?: string | null
                    location_lat?: number | null
                    location_lng?: number | null
                    default_currency?: string
                    created_at?: string
                }
            }
            diet_profiles: {
                Row: {
                    id: string
                    user_id: string
                    diet_type: string | null
                    allergies: Json | null // string[]
                    dislikes: Json | null // string[]
                    daily_calorie_target: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    diet_type?: string | null
                    allergies?: Json | null
                    dislikes?: Json | null
                    daily_calorie_target?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    diet_type?: string | null
                    allergies?: Json | null
                    dislikes?: Json | null
                    daily_calorie_target?: number | null
                    created_at?: string
                }
            }
            ai_model_connections: {
                Row: {
                    id: string
                    user_id: string
                    provider: string
                    api_key_encrypted: string | null
                    base_url: string | null
                    is_default: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    provider: string
                    api_key_encrypted?: string | null
                    base_url?: string | null
                    is_default?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    provider?: string
                    api_key_encrypted?: string | null
                    base_url?: string | null
                    is_default?: boolean
                    created_at?: string
                }
            }
            store_connections: {
                Row: {
                    id: string
                    user_id: string
                    store_key: string
                    auth_type: string | null
                    credentials_encrypted: Json | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    store_key: string
                    auth_type?: string | null
                    credentials_encrypted?: Json | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    store_key?: string
                    auth_type?: string | null
                    credentials_encrypted?: Json | null
                    is_active?: boolean
                    created_at?: string
                }
            }
            meal_plans: {
                Row: {
                    id: string
                    user_id: string
                    title: string | null
                    start_date: string
                    end_date: string
                    total_budget: number | null
                    currency: string
                    status: string | null
                    model_used: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title?: string | null
                    start_date: string
                    end_date: string
                    total_budget?: number | null
                    currency?: string
                    status?: string | null
                    model_used?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string | null
                    start_date?: string
                    end_date?: string
                    total_budget?: number | null
                    currency?: string
                    status?: string | null
                    model_used?: string | null
                    created_at?: string
                }
            }
            meals: {
                Row: {
                    id: string
                    meal_plan_id: string
                    date: string
                    meal_type: string
                    recipe_id: string
                }
                Insert: {
                    id?: string
                    meal_plan_id: string
                    date: string
                    meal_type: string
                    recipe_id: string
                }
                Update: {
                    id?: string
                    meal_plan_id?: string
                    date?: string
                    meal_type?: string
                    recipe_id?: string
                }
            }
            recipes: {
                Row: {
                    id: string
                    user_id: string | null
                    title: string
                    description: string | null
                    instructions: Json | null // string[]
                    estimated_cals: number | null
                    metadata: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    title: string
                    description?: string | null
                    instructions?: Json | null
                    estimated_cals?: number | null
                    metadata?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    title?: string
                    description?: string | null
                    instructions?: Json | null
                    estimated_cals?: number | null
                    metadata?: Json | null
                    created_at?: string
                }
            }
            recipe_ingredients: {
                Row: {
                    id: string
                    recipe_id: string
                    name: string
                    quantity: number | null
                    unit: string | null
                }
                Insert: {
                    id?: string
                    recipe_id: string
                    name: string
                    quantity?: number | null
                    unit?: string | null
                }
                Update: {
                    id?: string
                    recipe_id?: string
                    name?: string
                    quantity?: number | null
                    unit?: string | null
                }
            }
            shopping_lists: {
                Row: {
                    id: string
                    meal_plan_id: string
                    total_estimated_cost: number | null
                    currency: string
                    status: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    meal_plan_id: string
                    total_estimated_cost?: number | null
                    currency?: string
                    status?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    meal_plan_id?: string
                    total_estimated_cost?: number | null
                    currency?: string
                    status?: string | null
                    created_at?: string
                }
            }
            shopping_list_items: {
                Row: {
                    id: string
                    shopping_list_id: string
                    ingredient_name: string
                    quantity: number | null
                    unit: string | null
                    chosen_store: string | null
                    store_product_id: string | null
                    estimated_price: number | null
                    estimated_currency: string | null
                }
                Insert: {
                    id?: string
                    shopping_list_id: string
                    ingredient_name: string
                    quantity?: number | null
                    unit?: string | null
                    chosen_store?: string | null
                    store_product_id?: string | null
                    estimated_price?: number | null
                    estimated_currency?: string | null
                }
                Update: {
                    id?: string
                    shopping_list_id?: string
                    ingredient_name?: string
                    quantity?: number | null
                    unit?: string | null
                    chosen_store?: string | null
                    store_product_id?: string | null
                    estimated_price?: number | null
                    estimated_currency?: string | null
                }
            }
            store_products: {
                Row: {
                    id: string
                    store_key: string
                    external_sku: string
                    name: string
                    description: string | null
                    size_description: string | null
                    price: number | null
                    currency: string | null
                    last_checked_at: string | null
                    raw_payload: Json | null
                }
                Insert: {
                    id?: string
                    store_key: string
                    external_sku: string
                    name: string
                    description?: string | null
                    size_description?: string | null
                    price?: number | null
                    currency?: string | null
                    last_checked_at?: string | null
                    raw_payload?: Json | null
                }
                Update: {
                    id?: string
                    store_key?: string
                    external_sku?: string
                    name?: string
                    description?: string | null
                    size_description?: string | null
                    price?: number | null
                    currency?: string | null
                    last_checked_at?: string | null
                    raw_payload?: Json | null
                }
            }
            carts: {
                Row: {
                    id: string
                    user_id: string
                    shopping_list_id: string
                    store_key: string
                    status: string | null
                    checkout_url: string | null
                    external_cart_id: string | null
                    raw_payload: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    shopping_list_id: string
                    store_key: string
                    status?: string | null
                    checkout_url?: string | null
                    external_cart_id?: string | null
                    raw_payload?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    shopping_list_id?: string
                    store_key?: string
                    status?: string | null
                    checkout_url?: string | null
                    external_cart_id?: string | null
                    raw_payload?: Json | null
                    created_at?: string
                }
            }
        }
    }
}
