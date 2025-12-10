import { Message } from '@/lib/chat/types'
import { cn } from '@/components/ui/utils'
import { User, Bot } from 'lucide-react'

interface MessageBubbleProps {
    message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user'

    return (
        <div className={cn("flex w-full gap-3 animate-in fade-in slide-in-from-bottom-2", isUser ? "flex-row-reverse" : "flex-row")}>
            <div className={cn(
                "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border shadow-sm",
                isUser ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border"
            )}>
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div className={cn(
                "relative max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                isUser
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-secondary text-secondary-foreground rounded-tl-none border border-border/50"
            )}>
                <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                </div>
                <span className="sr-only">{isUser ? 'You said:' : 'FoodFriend said:'}</span>
            </div>
        </div>
    )
}
