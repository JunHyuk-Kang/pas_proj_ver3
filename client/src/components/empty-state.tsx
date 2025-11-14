import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquarePlus, Globe, Calendar, Users } from "lucide-react";

interface EmptyStateProps {
  onSuggestedPrompt: (prompt: string) => void;
}

const suggestedPrompts = [
  {
    icon: Globe,
    title: "국가 선택하기",
    prompt: "해외교육봉사를 진행하기 좋은 국가를 추천해주세요. 우리 팀은 초등학생 교육에 관심이 많습니다.",
  },
  {
    icon: Calendar,
    title: "일정 계획하기",
    prompt: "2주간의 해외교육봉사 일정을 구성하는데 도움을 주세요. 효과적인 프로그램 구성 방법을 알려주세요.",
  },
  {
    icon: Users,
    title: "팀 구성하기",
    prompt: "6명의 팀원으로 해외교육봉사를 준비하려고 합니다. 역할 분담과 준비사항을 알려주세요.",
  },
];

export function EmptyState({ onSuggestedPrompt }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <MessageSquarePlus className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">PAS 해외교육봉사 프로그램 기획</h1>
          <p className="text-lg text-muted-foreground">
            AI와 함께 해외교육봉사 프로그램을 설계하고 기획해보세요.
            <br />
            아래 주제를 선택하거나 직접 질문을 입력하세요.
          </p>
        </div>

        <div className="grid gap-4">
          {suggestedPrompts.map((item, index) => (
            <Card
              key={index}
              className="p-4 hover-elevate active-elevate-2 cursor-pointer transition-all"
              onClick={() => onSuggestedPrompt(item.prompt)}
              data-testid={`button-suggested-prompt-${index}`}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3 shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.prompt}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
