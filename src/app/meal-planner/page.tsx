'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, ChefHat, Clock, Users, ShoppingCart, RefreshCw, ArrowRight } from 'lucide-react'
import { cn } from '@/components/ui/utils'

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Sample meal plans - in production, these would come from AI
const sampleMeals = {
    breakfast: [
        { name: 'Scrambled Eggs & Toast', time: '15 min', servings: 4, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&h=150&fit=crop' },
        { name: 'Oatmeal with Fruit', time: '10 min', servings: 4, image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=200&h=150&fit=crop' },
        { name: 'Pancakes', time: '25 min', servings: 4, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=150&fit=crop' },
    ],
    lunch: [
        { name: 'Chicken Wraps', time: '20 min', servings: 4, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200&h=150&fit=crop' },
        { name: 'Pasta Salad', time: '25 min', servings: 4, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=200&h=150&fit=crop' },
        { name: 'Grilled Cheese & Soup', time: '15 min', servings: 4, image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=200&h=150&fit=crop' },
    ],
    dinner: [
        { name: 'Spaghetti Bolognese', time: '45 min', servings: 4, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=150&fit=crop' },
        { name: 'Grilled Chicken & Veggies', time: '35 min', servings: 4, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=200&h=150&fit=crop' },
        { name: 'Fish & Chips', time: '40 min', servings: 4, image: 'https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=200&h=150&fit=crop' },
        { name: 'Beef Stir Fry', time: '30 min', servings: 4, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&h=150&fit=crop' },
        { name: 'Lamb Curry', time: '50 min', servings: 4, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=150&fit=crop' },
        { name: 'Pizza Night', time: '25 min', servings: 4, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=150&fit=crop' },
        { name: "Nando's Style Chicken", time: '45 min', servings: 4, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=150&fit=crop' },
    ]
}

interface MealPlan {
    [day: string]: {
        breakfast: typeof sampleMeals.breakfast[0]
        lunch: typeof sampleMeals.lunch[0]
        dinner: typeof sampleMeals.dinner[0]
    }
}

function generateMealPlan(): MealPlan {
    const plan: MealPlan = {}
    weekDays.forEach((day, idx) => {
        plan[day] = {
            breakfast: sampleMeals.breakfast[idx % sampleMeals.breakfast.length],
            lunch: sampleMeals.lunch[idx % sampleMeals.lunch.length],
            dinner: sampleMeals.dinner[idx % sampleMeals.dinner.length],
        }
    })
    return plan
}

export default function MealPlannerPage() {
    const [mealPlan, setMealPlan] = useState<MealPlan>(generateMealPlan())
    const [selectedDay, setSelectedDay] = useState('Monday')
    const [familySize, setFamilySize] = useState(4)
    const [budget, setBudget] = useState(1000)

    const regeneratePlan = () => {
        // Shuffle and regenerate
        const newPlan: MealPlan = {}
        weekDays.forEach((day) => {
            newPlan[day] = {
                breakfast: sampleMeals.breakfast[Math.floor(Math.random() * sampleMeals.breakfast.length)],
                lunch: sampleMeals.lunch[Math.floor(Math.random() * sampleMeals.lunch.length)],
                dinner: sampleMeals.dinner[Math.floor(Math.random() * sampleMeals.dinner.length)],
            }
        })
        setMealPlan(newPlan)
    }

    const todaysMeals = mealPlan[selectedDay]

    return (
        <div className="py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                            <Calendar className="h-8 w-8 text-primary" />
                            Weekly Meal Planner
                        </h1>
                        <p className="text-muted-foreground">Plan your family's meals for the entire week</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <select
                                value={familySize}
                                onChange={(e) => setFamilySize(Number(e.target.value))}
                                className="bg-transparent text-sm font-medium"
                            >
                                <option value={2}>2 people</option>
                                <option value={3}>3 people</option>
                                <option value={4}>4 people</option>
                                <option value={5}>5 people</option>
                                <option value={6}>6 people</option>
                            </select>
                        </div>
                        <button
                            onClick={regeneratePlan}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Regenerate
                        </button>
                    </div>
                </div>

                {/* Week Navigation */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                    {weekDays.map((day) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={cn(
                                "flex-shrink-0 px-4 py-3 rounded-xl font-medium transition-all min-w-[100px]",
                                selectedDay === day
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                    : "bg-card border hover:bg-muted"
                            )}
                        >
                            <div className="text-xs opacity-70">{day.slice(0, 3)}</div>
                            <div className="text-sm">{weekDays.indexOf(day) + 1}</div>
                        </button>
                    ))}
                </div>

                {/* Day's Meals */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">{selectedDay}'s Meals</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                            const meal = todaysMeals[mealType]
                            return (
                                <div key={mealType} className="rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all">
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        <img
                                            src={meal.image}
                                            alt={meal.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 left-3 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium capitalize">
                                            {mealType}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2">{meal.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {meal.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                {familySize} servings
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Week Overview */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Week at a Glance</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Day</th>
                                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Breakfast</th>
                                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Lunch</th>
                                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Dinner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {weekDays.map((day) => (
                                    <tr key={day} className={cn(
                                        "border-b hover:bg-muted/50 cursor-pointer transition-colors",
                                        selectedDay === day && "bg-primary/5"
                                    )} onClick={() => setSelectedDay(day)}>
                                        <td className="p-3 font-medium">{day}</td>
                                        <td className="p-3 text-sm">{mealPlan[day].breakfast.name}</td>
                                        <td className="p-3 text-sm">{mealPlan[day].lunch.name}</td>
                                        <td className="p-3 text-sm">{mealPlan[day].dinner.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/chat"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        Generate Shopping List
                    </Link>
                    <Link
                        href="/deals"
                        className="flex items-center justify-center gap-2 px-6 py-4 border rounded-xl font-semibold hover:bg-muted transition-colors"
                    >
                        Find Deals
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
