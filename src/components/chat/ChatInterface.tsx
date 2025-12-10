'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { ActionCards } from './ActionCards'
import { ChatStateMachine } from '@/lib/chat/state-machine'
import { ChatSession } from '@/lib/chat/types'

const SESSION_STORAGE_KEY = 'foodfriend_session'

function loadSessionFromStorage(): ChatSession | null {
    if (typeof window === 'undefined') return null
    try {
        const stored = localStorage.getItem(SESSION_STORAGE_KEY)
        if (stored) {
            const parsed = JSON.parse(stored)
            // Validate the session has required fields
            if (parsed.state && parsed.messages && parsed.userProfile) {
                return parsed as ChatSession
            }
        }
    } catch (e) {
        console.warn('Failed to load session from storage:', e)
    }
    return null
}

function saveSessionToStorage(session: ChatSession): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    } catch (e) {
        console.warn('Failed to save session to storage:', e)
    }
}

export function ChatInterface() {
    const [session, setSession] = useState<ChatSession>(() => {
        // Try to restore from localStorage, otherwise start fresh
        return loadSessionFromStorage() || ChatStateMachine.getInitialSession()
    })
    const [inputValue, setInputValue] = useState('')
    const [processing, setProcessing] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Save session to localStorage whenever it changes
    useEffect(() => {
        saveSessionToStorage(session)
    }, [session])

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [session.messages])

    const handleSend = async () => {
        if (!inputValue.trim() || processing) return

        const userInput = inputValue
        setInputValue('')
        setProcessing(true)

        // Simulate network/thinking delay
        await new Promise(resolve => setTimeout(resolve, 600))

        try {
            const nextSession = await ChatStateMachine.handleInput(session, userInput)
            setSession(nextSession)
        } catch (error) {
            console.error("Chat error", error)
        } finally {
            setProcessing(false)
        }
    }

    const handleAction = async (value: string) => {
        // Treat action clicks as user input
        setInputValue(value) // Optional: visualise what they clicked? Or just process it hidden?
        // Let's process it as if they typed it for now to feed the state machine

        setProcessing(true)
        await new Promise(resolve => setTimeout(resolve, 400))

        const nextSession = await ChatStateMachine.handleInput(session, value)
        setSession(nextSession)
        setProcessing(false)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[600px] w-full max-w-2xl mx-auto bg-background rounded-2xl shadow-xl border overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b bg-muted/30">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="font-semibold">FoodFriend</h2>
                    <p className="text-xs text-muted-foreground">Your AI Food Concierge</p>
                </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
                {session.messages.map((msg) => (
                    <div key={msg.id} className="w-full">
                        <MessageBubble message={msg} />
                        <ActionCards
                            actions={msg.actions}
                            type={msg.type}
                            data={msg.data}
                            onAction={handleAction}
                        />
                    </div>
                ))}
                {processing && (
                    <div className="flex items-center gap-2 ml-11 text-muted-foreground text-sm animate-pulse">
                        <span>FoodFriend is thinking...</span>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-background border-t">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex items-center gap-2 rounded-full border bg-secondary/50 px-4 py-2 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all"
                >
                    <input
                        className="flex-1 bg-transparent border-none focus:outline-none placeholder:text-muted-foreground"
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                        disabled={processing}
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || processing}
                        className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground transition-all"
                    >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </button>
                </form>
            </div>
        </div>
    )
}
