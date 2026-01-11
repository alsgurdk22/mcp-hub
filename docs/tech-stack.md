# Frontend Tech Stack

## Core

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19 | UI 라이브러리 |
| Vite | 6.x | 빌드 도구 & 개발 서버 |
| TypeScript | 5.x | 타입 시스템 |
| pnpm | 9.x | 패키지 매니저 |

## 라우팅

| 기술 | 버전 | 용도 |
|------|------|------|
| TanStack Router | v1.95 | 타입 안전 라우팅 |

## 상태 관리 & 데이터 페칭

| 기술 | 버전 | 용도 |
|------|------|------|
| TanStack Query | v5.62 | 서버 상태 관리, 데이터 페칭, 캐싱 |
| Zustand | v5.0 | 클라이언트 상태 관리 |

## UI Flow

| 기술 | 버전 | 용도 |
|------|------|------|
| @use-funnel/browser | v0.0.16 | 퍼널(단계별 UI) 구현 |

## 스타일링

| 기술 | 버전 | 용도 |
|------|------|------|
| Tailwind CSS | v4.0 | 유틸리티 기반 CSS 프레임워크 |
| shadcn/ui | - | UI 컴포넌트 라이브러리 |

## 최적화

| 기술 | 버전 | 용도 |
|------|------|------|
| React Compiler | 19.0.0 (babel-plugin-react-compiler) | 자동 메모이제이션, 성능 최적화 |

## 선택 이유

### React 19 + React Compiler
- 자동 메모이제이션으로 `useMemo`, `useCallback` 수동 최적화 불필요
- 더 나은 성능과 개발자 경험

### Vite
- 빠른 HMR (Hot Module Replacement)
- ES 모듈 기반의 빠른 개발 서버
- 최적화된 프로덕션 빌드

### TanStack Router
- 100% 타입 안전한 라우팅
- 파일 기반 라우팅 지원
- TanStack Query와 완벽한 통합
- 빌트인 데이터 로딩 및 캐싱

### TanStack Query
- 서버 상태와 클라이언트 상태 분리
- 자동 캐싱, 백그라운드 리페칭
- 로딩/에러 상태 관리 간소화

### Zustand
- 최소한의 보일러플레이트
- React 외부에서도 사용 가능
- 작은 번들 사이즈

### Tailwind CSS
- 빠른 스타일링 워크플로우
- 일관된 디자인 시스템
- 사용하지 않는 CSS 자동 제거

### @use-funnel
- 타입 안전한 퍼널(단계별 UI) 구현
- 히스토리 기반 상태 관리
- 서버 등록, 회원가입 등 멀티스텝 폼에 사용
