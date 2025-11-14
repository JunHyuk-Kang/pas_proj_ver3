import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Conversation } from "@shared/schema";

interface AppSidebarProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isLoading: boolean;
}

export function AppSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isLoading,
}: AppSidebarProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "오늘";
    if (days === 1) return "어제";
    if (days < 7) return `${days}일 전`;
    
    return new Date(date).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">PAS 프로그램 기획</h2>
          <Button
            size="icon"
            onClick={onNewConversation}
            data-testid="button-new-conversation"
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>대화 목록</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-180px)]">
              {isLoading ? (
                <div className="space-y-2 p-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  아직 대화가 없습니다.
                  <br />
                  새 프로그램을 시작해보세요!
                </div>
              ) : (
                <SidebarMenu>
                  {conversations.map((conversation) => (
                    <SidebarMenuItem key={conversation.id}>
                      <div className="group relative">
                        <SidebarMenuButton
                          onClick={() => onSelectConversation(conversation.id)}
                          isActive={currentConversationId === conversation.id}
                          className="w-full justify-start pr-10"
                          data-testid={`button-conversation-${conversation.id}`}
                        >
                          <MessageSquare className="h-4 w-4 shrink-0" />
                          <div className="flex flex-col items-start gap-1 overflow-hidden flex-1 min-w-0">
                            <span className="truncate text-sm font-medium w-full">
                              {conversation.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(conversation.updatedAt)}
                            </span>
                          </div>
                        </SidebarMenuButton>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conversation.id);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-delete-${conversation.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
