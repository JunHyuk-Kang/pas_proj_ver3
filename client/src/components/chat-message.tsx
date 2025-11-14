import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@shared/schema";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={cn(
        "flex gap-4 px-4 py-6",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}
      data-testid={`message-${message.role}`}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn(
          isAssistant ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
        )}>
          {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex flex-col gap-2 max-w-3xl",
          isAssistant ? "items-start" : "items-end"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isAssistant
              ? "bg-card border border-card-border"
              : "bg-primary text-primary-foreground"
          )}
        >
          <div className="text-base whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
        <span className="text-xs text-muted-foreground px-2">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-4 px-4 py-6">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2 max-w-3xl">
        <div className="rounded-2xl px-4 py-3 bg-card border border-card-border">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-pulse-subtle" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-pulse-subtle" style={{ animationDelay: "200ms" }} />
            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-pulse-subtle" style={{ animationDelay: "400ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
