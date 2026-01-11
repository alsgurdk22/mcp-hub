# MCP Hub - Frontend Development Guide

## Project Overview

MCP Hub는 Model Context Protocol 서버를 발견, 테스트, 관리할 수 있는 플랫폼입니다.

### Core Features
- **서버 레지스트리**: MCP 서버 검색, 필터링, 상세 정보 확인
- **AI 채팅**: MCP 도구를 활용한 AI 대화 인터페이스
- **서버 등록**: 새로운 MCP 서버 등록 및 관리
- **관리자 대시보드**: 서버 승인, 모니터링, 사용자 관리

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Core | React | 19 |
| Build | Vite | 6.x |
| Language | TypeScript | 5.x |
| Package Manager | pnpm | 9.x |
| Routing | TanStack Router | 1.95 |
| Server State | TanStack Query | 5.62 |
| Client State | Zustand | 5.0 |
| Styling | Tailwind CSS | 4.0 |
| UI Components | shadcn/ui | - |
| Optimization | React Compiler | 19.0.0 |

## Project Structure

```
src/
├── app/                    # App entry point
│   ├── main.tsx
│   └── App.tsx
├── routes/                 # TanStack Router 파일 기반 라우팅
│   ├── __root.tsx
│   ├── index.tsx           # Landing (/)
│   ├── servers/
│   │   ├── index.tsx       # ServerList (/servers)
│   │   └── $id.tsx         # ServerDetail (/servers/:id)
│   ├── register.tsx        # ServerRegistration (/register)
│   ├── chat.tsx            # ChatInterface (/chat)
│   └── admin/
│       ├── index.tsx       # AdminDashboard (/admin)
│       ├── servers.tsx     # AdminServers (/admin/servers)
│       ├── review.$id.tsx  # AdminReview (/admin/review/:id)
│       ├── monitoring.tsx  # AdminMonitoring (/admin/monitoring)
│       ├── users.tsx       # AdminUsers (/admin/users)
│       └── verification.tsx # AdminVerification (/admin/verification)
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트
│   │   ├── Navbar.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── Footer.tsx
│   ├── server/             # 서버 관련 컴포넌트
│   │   ├── ServerCard.tsx
│   │   ├── ServerList.tsx
│   │   └── ServerFilters.tsx
│   └── chat/               # 채팅 관련 컴포넌트
│       ├── ChatArea.tsx
│       ├── ToolboxPanel.tsx
│       ├── ExecutionPanel.tsx
│       └── ServerBrowserModal.tsx
├── stores/                 # Zustand 스토어
│   ├── toolbox.ts          # 도구함 상태
│   └── ui.ts               # UI 상태 (모달, 사이드바 등)
├── hooks/                  # Custom hooks
│   ├── queries/            # TanStack Query hooks
│   │   ├── useServers.ts
│   │   └── useStats.ts
│   └── useMobile.ts
├── lib/                    # 유틸리티
│   ├── api.ts              # API 클라이언트
│   └── utils.ts            # 공통 유틸리티
├── types/                  # TypeScript 타입
│   ├── server.ts
│   ├── user.ts
│   └── chat.ts
└── styles/
    └── globals.css         # 글로벌 스타일, CSS 변수
```

## Design System

### Color Palette

다크 테마 전용. CSS 변수 사용 권장.

```css
/* Background */
--background: #09090B          /* 메인 배경 */
--card: #18181B                /* 카드, 헤더, 푸터 */
--input: #27272A               /* 입력 필드, 버튼 배경 */

/* Text */
--foreground: #FAFAFA          /* 기본 텍스트 */
--muted-foreground: #A1A1AA    /* 보조 텍스트 */
--placeholder: #71717A         /* 플레이스홀더 */

/* Border */
--border: #27272A              /* 기본 보더 */
--border-hover: #3F3F46        /* 호버 보더 */

/* Primary (Green) */
--primary: #4ADE80             /* 메인 액션 */
--primary-hover: #22C55E       /* 호버 */
--primary-foreground: #09090B  /* 버튼 텍스트 */

/* Status */
--success: #22C55E
--warning: #F59E0B
--error: #EF4444
--info: #3B82F6

/* Accent */
--lime: #A3E635                /* 라이선스 배지 등 */
```

### Tailwind 사용 규칙

하드코딩 금지. CSS 변수 또는 Tailwind 클래스 사용:

```tsx
// BAD - 하드코딩
<div className="bg-[#18181B] text-[#FAFAFA]">

// GOOD - CSS 변수 사용
<div className="bg-card text-foreground">

// GOOD - Tailwind 클래스
<div className="bg-zinc-900 text-zinc-50">
```

### Component Styling Patterns

```tsx
// Button variants
const buttonVariants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "bg-input border border-border text-foreground hover:border-primary",
  ghost: "hover:bg-input text-muted-foreground hover:text-foreground",
}

// Card pattern
const cardClass = "bg-card border border-border rounded-lg p-6 hover:border-border-hover transition-colors"

// Status indicator
const statusColors = {
  online: "bg-success",
  degraded: "bg-warning",
  offline: "bg-error",
}

// Security grade
const gradeColors = {
  A: "bg-success/10 text-success border-success/20",
  B: "bg-warning/10 text-warning border-warning/20",
  C: "bg-error/10 text-error border-error/20",
}
```

## State Management

### Zustand Store Pattern

```tsx
// stores/toolbox.ts
import { create } from 'zustand'

interface MCPServer {
  id: string
  name: string
  // ...
}

interface ToolboxState {
  servers: MCPServer[]
  activeServerIds: Set<string>
  addServer: (server: MCPServer) => void
  removeServer: (id: string) => void
  toggleActive: (id: string) => void
  isInToolbox: (id: string) => boolean
}

export const useToolboxStore = create<ToolboxState>((set, get) => ({
  servers: [],
  activeServerIds: new Set(),

  addServer: (server) => set((state) => ({
    servers: [...state.servers, server],
    activeServerIds: new Set([...state.activeServerIds, server.id])
  })),

  removeServer: (id) => set((state) => ({
    servers: state.servers.filter(s => s.id !== id),
    activeServerIds: new Set([...state.activeServerIds].filter(sid => sid !== id))
  })),

  toggleActive: (id) => set((state) => {
    const newSet = new Set(state.activeServerIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    return { activeServerIds: newSet }
  }),

  isInToolbox: (id) => get().servers.some(s => s.id === id)
}))
```

### TanStack Query Pattern

```tsx
// hooks/queries/useServers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const serverKeys = {
  all: ['servers'] as const,
  lists: () => [...serverKeys.all, 'list'] as const,
  list: (filters: ServerFilters) => [...serverKeys.lists(), filters] as const,
  details: () => [...serverKeys.all, 'detail'] as const,
  detail: (id: string) => [...serverKeys.details(), id] as const,
}

export function useServers(filters: ServerFilters) {
  return useQuery({
    queryKey: serverKeys.list(filters),
    queryFn: () => api.servers.list(filters),
  })
}

export function useServer(id: string) {
  return useQuery({
    queryKey: serverKeys.detail(id),
    queryFn: () => api.servers.get(id),
  })
}
```

## Routing (TanStack Router)

### File-based Routing

```tsx
// routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  ),
})

// routes/servers/$id.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/servers/$id')({
  loader: ({ params }) => fetchServer(params.id),
  component: ServerDetail,
})

function ServerDetail() {
  const { id } = Route.useParams()
  const server = Route.useLoaderData()
  // ...
}
```

## Component Guidelines

### Component Structure

```tsx
// components/server/ServerCard.tsx
import { Link } from '@tanstack/react-router'
import { Star, Download, Shield, CheckCircle } from 'lucide-react'
import { useToolboxStore } from '@/stores/toolbox'
import { cn } from '@/lib/utils'
import type { MCPServer } from '@/types/server'

interface ServerCardProps {
  server: MCPServer
  className?: string
}

export function ServerCard({ server, className }: ServerCardProps) {
  const { addServer, removeServer, isInToolbox } = useToolboxStore()
  const inToolbox = isInToolbox(server.id)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    inToolbox ? removeServer(server.id) : addServer(server)
  }

  return (
    <Link
      to="/servers/$id"
      params={{ id: server.id }}
      className={cn(
        "block bg-card border border-border rounded-lg p-4",
        "hover:border-border-hover transition-colors",
        className
      )}
    >
      {/* ... */}
    </Link>
  )
}
```

### Naming Conventions

- **Components**: PascalCase (`ServerCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useServers.ts`)
- **Stores**: camelCase (`toolbox.ts`)
- **Utils**: camelCase (`utils.ts`)
- **Types**: PascalCase (`MCPServer`, `ToolCall`)

## Data Types

```tsx
// types/server.ts
export interface MCPServer {
  id: string
  name: string
  icon: string
  publisher: string
  description: string
  toolsCount: number
  category: ServerCategory
  status: 'online' | 'offline' | 'degraded'
  verified: boolean
  rating: number
  downloads: number
  securityGrade: 'A' | 'B' | 'C'
  license: string
  lastUpdated: string
  authMethod: 'oauth' | 'apikey' | 'none'
  tools: Tool[]
}

export interface Tool {
  id: string
  name: string
  description: string
  parameters: Record<string, string>
}

export type ServerCategory =
  | 'Developer Tools'
  | 'Maps & Location'
  | 'Weather & Environment'
  | 'News & Media'
  | 'Productivity'
  | 'Communication'
  | 'Database'
  | 'E-Commerce'
  | 'AI & ML'
  | 'Language & Translation'
  | 'Finance'
  | 'Social Media'

// types/chat.ts
export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  toolCalls?: ToolCall[]
}

export interface ToolCall {
  id: string
  serverId: string
  serverName: string
  toolName: string
  status: 'pending' | 'success' | 'error'
  executionTime?: number
  input?: unknown
  output?: unknown
  error?: string
}
```

## Import Order

```tsx
// 1. React/Framework
import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'

// 2. External libraries
import { useQuery } from '@tanstack/react-query'
import { Star, Download } from 'lucide-react'

// 3. Internal: UI components
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// 4. Internal: Business components
import { ServerCard } from '@/components/server/ServerCard'

// 5. Stores/Hooks
import { useToolboxStore } from '@/stores/toolbox'
import { useServers } from '@/hooks/queries/useServers'

// 6. Utils/Types
import { cn } from '@/lib/utils'
import type { MCPServer } from '@/types/server'
```

## Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format
pnpm format
```

## Notes

### Legacy Code Migration

- `react-router-dom` → TanStack Router 마이그레이션 필요
- Context API (`ToolboxContext`) → Zustand 스토어로 변환
- 하드코딩된 색상값 → CSS 변수/Tailwind 클래스로 변환
- Mock 데이터 → TanStack Query + API 연동

### shadcn/ui

shadcn/ui 컴포넌트는 `components/ui/`에 위치. 필요시 `npx shadcn@latest add [component]`로 추가.
