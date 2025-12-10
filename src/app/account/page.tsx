'use client'

import { useState, useEffect } from 'react'
import { User, MapPin, DollarSign, Utensils, Store, Bell, Shield, Trash2, Save, Check } from 'lucide-react'
import { cn } from '@/components/ui/utils'

interface UserProfile {
    name?: string
    city?: string
    currency?: string
    diet?: { type: string }
    budget?: { weekly?: number }
    connected_stores: string[]
}

const dietOptions = ['None', 'Vegetarian', 'Vegan', 'Keto', 'Halal', 'Kosher']
const stores = [
    { key: 'checkers', name: 'Checkers Sixty60' },
    { key: 'pnp', name: 'Pick n Pay' },
    { key: 'uber_eats', name: 'Uber Eats' },
    { key: 'mr_d', name: 'Mr D' },
]

export default function AccountPage() {
    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        city: '',
        currency: 'ZAR',
        connected_stores: []
    })
    const [saved, setSaved] = useState(false)

    // Load from localStorage
    useEffect(() => {
        const storedSession = localStorage.getItem('foodfriend_session')
        if (storedSession) {
            try {
                const session = JSON.parse(storedSession)
                if (session.userProfile) {
                    setProfile(session.userProfile)
                }
            } catch (e) {
                console.warn('Could not load profile')
            }
        }
    }, [])

    const handleSave = () => {
        const storedSession = localStorage.getItem('foodfriend_session')
        if (storedSession) {
            try {
                const session = JSON.parse(storedSession)
                session.userProfile = profile
                localStorage.setItem('foodfriend_session', JSON.stringify(session))
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
            } catch (e) {
                console.warn('Could not save profile')
            }
        }
    }

    const toggleStore = (key: string) => {
        setProfile(prev => ({
            ...prev,
            connected_stores: prev.connected_stores.includes(key)
                ? prev.connected_stores.filter(s => s !== key)
                : [...prev.connected_stores, key]
        }))
    }

    const clearData = () => {
        if (confirm('Are you sure you want to clear all data? This will reset your conversation and preferences.')) {
            localStorage.removeItem('foodfriend_session')
            window.location.href = '/chat'
        }
    }

    return (
        <div className="py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your profile and preferences</p>
                </div>

                {/* Profile Section */}
                <section className="mb-8 p-6 rounded-2xl bg-card border">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Profile
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                value={profile.name || ''}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-background border focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                Location
                            </label>
                            <input
                                type="text"
                                value={profile.city || ''}
                                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-background border focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Your city"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                Currency
                            </label>
                            <select
                                value={profile.currency || 'ZAR'}
                                onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-background border focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="ZAR">ZAR (R)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Diet Preferences */}
                <section className="mb-8 p-6 rounded-2xl bg-card border">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Utensils className="h-5 w-5 text-primary" />
                        Diet Preferences
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {dietOptions.map((diet) => (
                            <button
                                key={diet}
                                onClick={() => setProfile({ ...profile, diet: { type: diet.toLowerCase() } })}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                    profile.diet?.type === diet.toLowerCase()
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted hover:bg-muted/80"
                                )}
                            >
                                {diet}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Connected Stores */}
                <section className="mb-8 p-6 rounded-2xl bg-card border">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Store className="h-5 w-5 text-primary" />
                        Connected Stores
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {stores.map((store) => (
                            <button
                                key={store.key}
                                onClick={() => toggleStore(store.key)}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-xl border transition-all",
                                    profile.connected_stores.includes(store.key)
                                        ? "bg-primary/10 border-primary"
                                        : "bg-background hover:bg-muted"
                                )}
                            >
                                <span className="font-medium text-sm">{store.name}</span>
                                {profile.connected_stores.includes(store.key) && (
                                    <Check className="h-5 w-5 text-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Budget */}
                <section className="mb-8 p-6 rounded-2xl bg-card border">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        Weekly Budget
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">R</span>
                        <input
                            type="number"
                            value={profile.budget?.weekly || ''}
                            onChange={(e) => setProfile({ ...profile, budget: { weekly: parseInt(e.target.value) || undefined } })}
                            className="w-full px-4 py-2 rounded-lg bg-background border focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="e.g. 1000"
                        />
                        <span className="text-muted-foreground">/week</span>
                    </div>
                </section>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                    >
                        {saved ? <Check className="h-5 w-5" /> : <Save className="h-5 w-5" />}
                        {saved ? 'Saved!' : 'Save Changes'}
                    </button>
                    <button
                        onClick={clearData}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-red-500/50 text-red-500 font-semibold hover:bg-red-500/10 transition-colors"
                    >
                        <Trash2 className="h-5 w-5" />
                        Clear All Data
                    </button>
                </div>
            </div>
        </div>
    )
}
