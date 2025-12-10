'use client'

import { useState, useEffect } from 'react'
import { AddModelForm } from '@/components/models/AddModelForm'
import { ModelList } from '@/components/models/ModelList'

export default function ModelsPage() {
    const [models, setModels] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Load from local storage on mount (simulating DB)
    useEffect(() => {
        const saved = localStorage.getItem('autocart_models')
        if (saved) {
            setModels(JSON.parse(saved))
        } else {
            // Seed default placeholder?
            setModels([])
        }
        setLoading(false)
    }, [])

    // Save to local storage whenever models change
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('autocart_models', JSON.stringify(models))
        }
    }, [models, loading])

    const handleAdd = (newModel: any) => {
        // If it's the first model, make it default
        if (models.length === 0) {
            newModel.is_default = true
        }
        setModels([...models, newModel])
    }

    const handleDelete = (id: string) => {
        setModels(models.filter(m => m.id !== id))
    }

    const handleSetDefault = (id: string) => {
        setModels(models.map(m => ({
            ...m,
            is_default: m.id === id
        })))
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">AI Models</h1>
                <p className="text-muted-foreground">
                    Manage your AI connections. AutoCart uses these to generate meal plans and recipes.
                </p>
            </div>

            <div className="grid gap-6">
                <ModelList
                    models={models}
                    onDelete={handleDelete}
                    onSetDefault={handleSetDefault}
                />

                <div className="max-w-md">
                    <AddModelForm onAdd={handleAdd} />
                </div>
            </div>
        </div>
    )
}
