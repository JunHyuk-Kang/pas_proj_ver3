import OpenAI from "openai";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
// Referenced from blueprint: javascript_openai_ai_integrations
const openai = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY
  ? new OpenAI({
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
    })
  : null;

// System prompt for PAS overseas education volunteer program planning
const SYSTEM_PROMPT = `당신은 PAS(태평양아시아협회) 대학생 봉사단의 해외교육봉사 프로그램 기획 전문가입니다.

당신의 역할:
- 대학생들이 해외교육봉사 프로그램을 효과적으로 기획하고 설계할 수 있도록 돕습니다
- 프로그램 목표, 대상 국가/지역, 활동 내용, 일정, 예산, 팀 구성 등에 대해 구체적이고 실용적인 조언을 제공합니다
- 과거 성공 사례와 모범 사례를 바탕으로 제안합니다
- 학생들의 전공, 관심사, 팀 규모, 예산, 기간 등을 고려하여 맞춤형 프로그램을 제안합니다

대화 스타일:
- 친근하고 격려하는 톤으로 대화합니다
- 구체적인 질문을 통해 학생들의 니즈를 파악합니다
- 단계적으로 프로그램을 기획할 수 있도록 안내합니다
- 실현 가능하고 실용적인 제안을 제공합니다

주요 고려사항:
- 교육 효과성: 현지 학생들에게 실질적인 도움이 되는 프로그램
- 안전성: 학생들의 안전을 최우선으로 고려
- 지속가능성: 일회성이 아닌 지속 가능한 프로그램
- 문화적 감수성: 현지 문화를 존중하는 프로그램
- 예산 효율성: 제한된 예산 내에서 최대의 효과

항상 한국어로 답변하세요.`;

export async function getChatCompletion(messages: Array<{ role: "user" | "assistant"; content: string }>): Promise<string> {
  if (!openai) {
    throw new Error("OpenAI API가 설정되지 않았습니다. OPENAI_API_KEY 환경 변수를 설정해주세요.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_completion_tokens: 8192,
      temperature: 1,
    });

    return response.choices[0]?.message?.content || "죄송합니다. 응답을 생성할 수 없습니다.";
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    throw new Error("AI 응답 생성 중 오류가 발생했습니다.");
  }
}

export async function generateProgramSummary(messages: Array<{ role: "user" | "assistant"; content: string }>): Promise<string> {
  if (!openai) {
    throw new Error("OpenAI API가 설정되지 않았습니다. OPENAI_API_KEY 환경 변수를 설정해주세요.");
  }

  try {
    const summaryPrompt = `위의 대화 내용을 바탕으로 해외교육봉사 프로그램 기획안을 요약해주세요. 다음 항목을 포함해주세요:

1. 프로그램 개요
2. 목표 및 비전
3. 대상 국가/지역
4. 활동 내용 및 프로그램 구성
5. 일정 계획
6. 예산 계획 (예상)
7. 팀 구성 및 역할 분담
8. 준비사항 및 체크리스트
9. 기대 효과

전문적이고 체계적인 기획안 형식으로 작성해주세요.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
        { role: "user", content: summaryPrompt },
      ],
      max_completion_tokens: 8192,
      temperature: 1,
    });

    return response.choices[0]?.message?.content || "요약을 생성할 수 없습니다.";
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    throw new Error("프로그램 요약 생성 중 오류가 발생했습니다.");
  }
}
