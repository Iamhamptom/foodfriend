'use client'

import { Check, Trash2, Cpu } from 'lucide-react'
import { cn } from '@/components/ui/utils'

interface ModelListProps {
    models: any[]
    onDelete: (id: string) => void
    onSetDefault: (id: string) => void
}

export function ModelList({ models, onDelete, onSetDefault }: ModelListProps) {
    if (models.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                <Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No models connected yet.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
                <div
                    key={model.id}
                    className={cn(
                        "relative flex flex-col justify-between rounded-xl border p-6 shadow-sm transition-all hover:shadow-md bg-card",
                        model.is_default && "ring-2 ring-primary border-primary bg-primary/5"
                    )}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg bg-secondary", model.provider === 'gemini' ? 'text-blue-500' : 'text-green-500')}>
                                <Cpu className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold capitalize">{model.provider}</h4>
                                <p className="text-xs text-muted-foreground font-mono">
                                    {model.api_key_encrypted ? '••••••••' + model.api_key_encrypted.slice(-4) : 'No Key'}
                                </p>
                            </div>
                        </div>
                        {model.is_default && (
                            <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                                Default
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                        {!model.is_default && (
                            <button
                                onClick={() => onSetDefault(model.id)}
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                Make Default
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(model.id)}
                            className="ml-auto text-xs font-medium text-destructive hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
