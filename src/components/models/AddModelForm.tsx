'use client'

import { useState } from 'react'
import { Plus, Key, Link as LinkIcon, Save } from 'lucide-react'
import { cn } from '@/components/ui/utils'

export function AddModelForm({ onAdd }: { onAdd: (model: any) => void }) {
    const [isOpen, setIsOpen] = useState(false)
    const [provider, setProvider] = useState('gemini')
    const [apiKey, setApiKey] = useState('')
    const [baseUrl, setBaseUrl] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAdd({
            id: crypto.randomUUID(),
            provider,
            api_key_encrypted: apiKey, // In real app, encrypt this server-side
            base_url: baseUrl,
            is_default: false,
            created_at: new Date().toISOString()
        })
        setIsOpen(false)
        setApiKey('')
        setBaseUrl('')
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex h-32 w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
            >
                <Plus className="h-8 w-8 mb-2" />
                <span className="font-medium">Connect New Model</span>
            </button>
        )
    }

    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Add Connection</h3>
                <button onClick={() => setIsOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">Cancel</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Provider</label>
                    <div className="flex gap-2">
                        {['gemini', 'openai', 'anthropic'].map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setProvider(p)}
                                className={cn(
                                    "px-4 py-2 rounded-md border text-sm capitalize transition-colors",
                                    provider === p ? "bg-primary/10 border-primary text-primary font-medium" : "bg-background border-input hover:bg-secondary"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium">API Key</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="password"
                            required
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="sk-..."
                        />
                    </div>
                </div>

                {provider === 'openai' && (
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Base URL (Optional)</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="url"
                                value={baseUrl}
                                onChange={(e) => setBaseUrl(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="https://api.openai.com/v1"
                            />
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    <Save className="mr-2 h-4 w-4" /> Save Connection
                </button>
            </form>
        </div>
    )
}
