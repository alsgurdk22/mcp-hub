import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-primary mb-4">404</div>
        <h1 className="text-3xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          URL을 확인하시거나 아래 버튼을 눌러 홈으로 이동하세요.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button variant="secondary" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로 가기
          </Button>
          <Link to="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              홈으로 이동
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
