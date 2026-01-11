# Legacy 코드 분석 (Figma Make 생성)

## 프로젝트 개요

**MCP Hub** - Model Context Protocol 서버 레지스트리/마켓플레이스

AI 도구(MCP 서버)를 발견하고, 테스트하고, 관리할 수 있는 플랫폼

## 페이지 구조

### Public Routes
| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | Landing | 랜딩 페이지 (히어로, 통계, 기능 소개, 인기 서버) |
| `/servers` | ServerList | MCP 서버 목록 (검색, 필터링) |
| `/servers/:id` | ServerDetail | 서버 상세 정보 |
| `/register` | ServerRegistration | 새 서버 등록 |
| `/chat` | ChatInterface | AI 채팅 인터페이스 (MCP 서버 테스트) |

### Admin Routes
| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/admin` | AdminDashboard | 관리자 대시보드 |
| `/admin/servers` | AdminServers | 서버 관리 |
| `/admin/review/:id` | AdminReview | 서버 리뷰 |
| `/admin/monitoring` | AdminMonitoring | 모니터링 |
| `/admin/users` | AdminUsers | 사용자 관리 |
| `/admin/verification` | AdminVerification | 검증 관리 |

## 컴포넌트 구조

### UI 컴포넌트 (shadcn/ui 기반)
- 40+ 기본 UI 컴포넌트 (Button, Card, Dialog, Table 등)
- `components/ui/` 폴더에 위치

### 비즈니스 컴포넌트
| 컴포넌트 | 위치 | 설명 |
|----------|------|------|
| Navbar | `components/Navbar.tsx` | 네비게이션 바 |
| ServerCard | `components/ServerCard.tsx` | 서버 카드 |
| AdminSidebar | `components/AdminSidebar.tsx` | 관리자 사이드바 |

### 채팅 컴포넌트
| 컴포넌트 | 설명 |
|----------|------|
| ChatArea | 채팅 메시지 영역 |
| ToolboxPanel | 활성화된 MCP 서버 목록 (좌측 사이드바) |
| ExecutionPanel | 도구 실행 결과 (우측 사이드바) |
| ServerBrowserModal | 서버 추가 모달 |

## 데이터 모델

### MCPServer
```typescript
interface MCPServer {
  id: string;
  name: string;
  icon: string;
  publisher: string;
  description: string;
  toolsCount: number;
  category: string;
  status: 'online' | 'offline' | 'degraded';
  verified: boolean;
  rating: number;
  downloads: number;
  securityGrade: 'A' | 'B' | 'C';
  license: string;
  lastUpdated: string;
  authMethod: 'oauth' | 'apikey' | 'none';
  tools: Tool[];
}
```

### Tool
```typescript
interface Tool {
  id: string;
  name: string;
  description: string;
  parameters: any;
}
```

### Message / ToolCall (채팅용)
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}

interface ToolCall {
  id: string;
  serverId: string;
  serverName: string;
  toolName: string;
  status: 'pending' | 'success' | 'error';
  executionTime?: number;
  input?: any;
  output?: any;
  error?: string;
}
```

## 카테고리
- Developer Tools
- Maps & Location
- Weather & Environment
- News & Media
- Productivity
- Communication
- Database
- E-Commerce
- AI & ML
- Language & Translation
- Finance
- Social Media

## 마이그레이션 필요사항

### 라우팅
- `react-router-dom` → `TanStack Router`
- 파일 기반 라우팅으로 전환

### 상태 관리
- `ToolboxContext` (Context API) → `Zustand` 스토어
- 서버 상태 → `TanStack Query`

### 스타일링
- 하드코딩된 색상값 → Tailwind CSS 변수
  - `#09090B` → `bg-background`
  - `#FAFAFA` → `text-foreground`
  - `#4ADE80` → `text-primary`
  - `#27272A` → `border-border`
  - `#A1A1AA` → `text-muted-foreground`

### 기타
- `sonner@2.0.3` 임포트 수정 필요
- 목업 데이터 → API 연동

## 디자인 시스템

### 색상 팔레트
| 용도 | Hex | 변환 |
|------|-----|------|
| Background | `#09090B` | `--background` |
| Foreground | `#FAFAFA` | `--foreground` |
| Primary | `#4ADE80` | `--primary` |
| Primary Hover | `#22C55E` | `--primary-hover` |
| Muted | `#A1A1AA` | `--muted-foreground` |
| Border | `#27272A` | `--border` |
| Card | `#18181B` | `--card` |

### 테마
- 다크 모드 전용
