import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import ChatPage from "@/pages/chat";
import { useToast } from "@/hooks/use-toast";
import type { Conversation } from "@shared/schema";

function ChatApp() {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/conversations/${id}`, undefined);
      return res;
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      if (currentConversationId === deletedId) {
        setCurrentConversationId(null);
      }
      toast({
        title: "대화가 삭제되었습니다",
      });
    },
    onError: () => {
      toast({
        title: "삭제 실패",
        description: "대화를 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleNewConversation = () => {
    setCurrentConversationId(null);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleConversationCreated = (id: string) => {
    setCurrentConversationId(id);
    queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
  };

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar
          conversations={conversations}
          currentConversationId={currentConversationId || undefined}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={(id) => deleteConversationMutation.mutate(id)}
          isLoading={isLoading}
        />
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <header className="flex items-center justify-between p-2 border-b shrink-0">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
          </header>
          <main className="flex-1 overflow-hidden">
            <ChatPage
              conversationId={currentConversationId}
              onConversationCreated={handleConversationCreated}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ChatApp />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
