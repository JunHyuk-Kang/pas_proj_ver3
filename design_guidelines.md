# PAS 해외교육봉사 AI 챗봇 서비스 - Design Guidelines

## Design Approach

**Selected Approach**: Hybrid Design System + Reference
- **Primary Reference**: Linear (clean, modern productivity tool aesthetic) + Notion (collaborative planning feel)
- **Supporting System**: Material Design 3 principles for chat components and interaction patterns
- **Rationale**: This is a utility-focused planning tool requiring clarity and efficiency, while maintaining an approachable, collaborative feel for university students

## Core Design Principles

1. **Conversation-First**: The chat interface is the hero - minimize distractions
2. **Progressive Planning**: Guide users through structured program planning stages
3. **Bilingual Ready**: All layouts accommodate Korean text (larger character spacing considerations)
4. **Trust & Professionalism**: Reflects PAS's organizational credibility while remaining student-friendly

## Typography

**Font Stack**:
- **Primary**: Pretendard (Korean) / Inter (Latin) - Modern, highly legible for UI
- **Secondary**: Noto Sans KR fallback for broader compatibility

**Hierarchy**:
- **Page Headers**: text-3xl font-bold (30px) - Section titles
- **Chat Messages - AI**: text-base font-medium (16px) - Clear distinction
- **Chat Messages - User**: text-base font-normal (16px) - Conversational
- **Form Labels**: text-sm font-semibold (14px) - Structured inputs
- **Metadata/Timestamps**: text-xs font-normal (12px) - Subtle context
- **Button Text**: text-sm font-semibold (14px) - Action-oriented

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 20** for consistent rhythm
- **Micro spacing** (p-2, gap-2): Between related elements
- **Standard spacing** (p-4, gap-4, m-6): Component internal padding, card gaps
- **Section spacing** (p-8, py-12): Between major UI sections
- **Page margins** (px-16, py-20): Container edges

**Grid System**:
- **Main Layout**: Two-column split (sidebar + chat area)
  - Sidebar: fixed w-64 or w-80 (navigation, conversation history)
  - Chat Area: flex-1 (fluid, responsive)
- **Mobile**: Single column, collapsible sidebar

**Container Max-widths**:
- Chat messages: max-w-3xl (optimal reading width for conversations)
- Form sections: max-w-2xl (focused planning inputs)
- Full-width dashboard: w-full with inner constraints

## Component Library

### Navigation & Structure

**Sidebar (Left)**:
- Fixed navigation with logo at top
- Conversation history list (scrollable)
- New conversation button (prominent CTA)
- User profile/settings at bottom
- Use subtle dividers (border-gray-200) between sections

**Top Bar**:
- Current conversation title (editable on click)
- Export/share program summary button
- Settings/help icon menu

### Chat Interface

**Message Containers**:
- **AI Messages**: Left-aligned, subtle background fill (bg-gray-50), rounded-2xl
- **User Messages**: Right-aligned, primary color background, rounded-2xl
- Both: p-4, max-w-3xl, clear spacing between (gap-4)

**Message Metadata**:
- Timestamp below each message (text-xs, text-gray-500)
- AI avatar/icon for AI messages (left side)
- User avatar for user messages (right side)

**Input Area**:
- Fixed bottom position
- Multi-line textarea (rounded-xl, border, p-4)
- Send button (icon only, absolute positioned right side)
- Suggestion chips above input when conversation starts (e.g., "프로그램 목표 설정하기", "국가 선택하기")

### Program Planning Components

**Planning Stages Card**:
- Horizontal progress indicator showing stages: 목표 설정 → 국가/지역 선택 → 활동 내용 → 일정 계획 → 예산 계획
- Visual progress dots/line connecting stages
- Current stage highlighted

**Information Cards** (within chat):
- Bordered cards (border, rounded-lg) displaying structured program info
- Icon + label + value layout
- Grid of 2-3 columns for stats (team size, duration, budget estimates)

**Form Inputs** (inline with chat):
- Text inputs: rounded-lg, border, p-3
- Dropdowns: Custom select with rounded-lg styling
- Date pickers: Inline calendar widget
- All inputs include helpful placeholder text in Korean

### Action Elements

**Primary Button**:
- Rounded-lg, px-6, py-3, font-semibold
- Use for: "새 프로그램 시작하기", "프로그램 요약 생성하기"

**Secondary Button**:
- Rounded-lg, px-6, py-3, border
- Use for: "이전 대화 불러오기", "내보내기"

**Icon Buttons**:
- rounded-full, p-2
- Use for: Settings, edit, delete, share icons

### Data Display

**Conversation History List**:
- List items with: program title, last message preview, timestamp
- Each item: p-4, rounded-lg, hover state
- Active conversation: background highlight

**Program Summary Card**:
- Large card displaying complete program plan
- Sections with headings: 프로그램 개요, 목표, 활동 내용, 일정, 예산, 팀 구성
- Download/export buttons at bottom

### Feedback & States

**Loading States**:
- Typing indicator for AI (three animated dots)
- Skeleton loaders for conversation history

**Empty States**:
- Welcome screen with illustration
- Suggested starter prompts as large clickable cards

**Error Messages**:
- Inline within chat flow
- Rounded border, warning icon, clear Korean text

## Images

**Hero/Welcome Screen**:
- Illustration or abstract graphic representing global education/volunteering
- Placement: Center of empty state before first conversation
- Style: Friendly, vibrant, international feel (showing diverse students, maps, books)
- Size: w-64 to w-80, centered

**Avatar Icons**:
- AI Assistant: Custom icon representing PAS or education theme
- User: Profile photo or default avatar
- Size: w-8 h-8 to w-10 h-10, rounded-full

**Empty State Illustrations**:
- Small supportive graphics for "no conversations yet" state
- Style: Line art or simple illustrations, not photographic

## Accessibility & Interaction

- All interactive elements have clear focus states (ring-2)
- Minimum touch target size: 44x44px for mobile
- Chat input supports keyboard shortcuts (Enter to send, Shift+Enter for new line)
- Screen reader labels for all icon-only buttons
- High contrast ratios maintained throughout

## Responsive Behavior

**Desktop (lg+)**: Full sidebar + chat area side-by-side
**Tablet (md)**: Collapsible sidebar, toggle button in header
**Mobile (base)**: Sidebar hidden by default, hamburger menu to access, chat area takes full width