import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ChatMessage, TypingIndicator } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";
import { EmptyState } from "@/components/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import type { Message, Conversation } from "@shared/schema";

interface ChatPageProps {
  conversationId: string | null;
  onConversationCreated: (id: string) => void;
}

export default function ChatPage({ conversationId, onConversationCreated }: ChatPageProps) {
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: ["/api/messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const res = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return await res.json();
    },
    enabled: !!conversationId,
  });

  const { data: conversation } = useQuery<Conversation>({
    queryKey: ["/api/conversations", conversationId],
    enabled: !!conversationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId) {
        const res = await apiRequest("POST", "/api/conversations", {
          title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
        });
        const newConversation = await res.json();
        onConversationCreated(newConversation.id);
        return { conversationId: newConversation.id, content };
      }
      return { conversationId, content };
    },
    onSuccess: async ({ conversationId: convId, content }) => {
      setIsTyping(true);
      try {
        const res = await apiRequest(
          "POST",
          "/api/chat",
          {
            conversationId: convId,
            message: content,
          }
        );
        
        await res.json();
        
        await Promise.all([
          queryClient.refetchQueries({ queryKey: ["/api/messages", convId] }),
          queryClient.refetchQueries({ queryKey: ["/api/conversations"] }),
          queryClient.refetchQueries({ queryKey: ["/api/conversations", convId] }),
        ]);
      } catch (error: any) {
        toast({
          title: "오류가 발생했습니다",
          description: error.message || "메시지를 전송하는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } finally {
        setIsTyping(false);
      }
    },
  });

  const generateSummaryMutation = useMutation({
    mutationFn: async () => {
      if (!conversationId) throw new Error("대화를 먼저 시작해주세요");
      const res = await apiRequest("POST", "/api/summary", {
        conversationId,
      });
      return await res.json();
    },
    onSuccess: (data) => {
      const blob = new Blob([data.summary], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${conversation?.title || "프로그램기획안"}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "프로그램 기획안 다운로드 완료",
        description: "프로그램 요약이 다운로드되었습니다.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "요약 생성 실패",
        description: error.message || "프로그램 요약을 생성하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (content: string) => {
    sendMessageMutation.mutate(content);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessageMutation.mutate(prompt);
  };

  if (!conversationId) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto">
          <EmptyState onSuggestedPrompt={handleSuggestedPrompt} />
        </div>
        <div className="shrink-0">
          <ChatInput
            onSend={handleSendMessage}
            disabled={sendMessageMutation.isPending || isTyping}
            placeholder="프로그램 기획을 시작하려면 메시지를 입력하세요..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 border-b px-4 py-3 flex items-center justify-between bg-background">
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-lg truncate" data-testid="text-conversation-title">
            {conversation?.title || "로딩 중..."}
          </h2>
          <p className="text-xs text-muted-foreground">
            PAS 해외교육봉사 프로그램 기획
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => generateSummaryMutation.mutate()}
          disabled={messages.length === 0 || generateSummaryMutation.isPending || isLoadingMessages || isTyping}
          data-testid="button-download-summary"
        >
          <Download className="h-4 w-4 mr-2" />
          기획안 다운로드
        </Button>
      </div>

      <div className="flex-1 overflow-auto" ref={scrollRef}>
        {isLoadingMessages ? (
          <div className="space-y-6 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-20 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center space-y-4 max-w-md">
              <p className="text-muted-foreground">
                대화를 시작하려면 아래에 메시지를 입력하세요.
                <br />
                AI가 프로그램 기획을 도와드립니다.
              </p>
            </div>
          </div>
        ) : (
          <div className="pb-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        )}
      </div>

      <div className="shrink-0">
        <ChatInput
          onSend={handleSendMessage}
          disabled={sendMessageMutation.isPending || isTyping}
        />
      </div>
    </div>
  );
}
