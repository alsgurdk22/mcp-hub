import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Search, Zap, Shield, Globe } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { ServerCard } from '@/components/server/ServerCard'
import { mockServers, mockStats } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: Landing,
})

function Landing() {
  const featuredServers = mockServers.slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              MCP 서버의 모든 것
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Model Context Protocol을 활용하여 AI를 더 강력하게 만드세요.
              검증된 서버를 발견하고, 즉시 테스트하고, 안전하게 배포하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/servers">
                  서버 둘러보기
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/register">서버 등록하기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {mockStats.totalServers.toLocaleString()}
              </div>
              <div className="text-muted-foreground">등록된 MCP 서버</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {mockStats.totalUsers.toLocaleString()}
              </div>
              <div className="text-muted-foreground">활성 사용자</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {(mockStats.apiCalls / 1000000).toFixed(1)}M
              </div>
              <div className="text-muted-foreground">API 호출 수</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          왜 MCP Hub를 선택해야 할까요?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-lg p-6 hover:border-border-hover transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">쉬운 발견</h3>
            <p className="text-muted-foreground">
              카테고리별로 분류된 수천 개의 MCP 서버를 탐색하고, 필요한 도구를
              빠르게 찾으세요.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:border-border-hover transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">즉시 테스트</h3>
            <p className="text-muted-foreground">
              웹 기반 AI 채팅 인터페이스로 클라이언트 설치 없이 서버를 바로
              테스트할 수 있습니다.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:border-border-hover transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">검증된 보안</h3>
            <p className="text-muted-foreground">
              모든 서버는 보안 등급 평가를 거치며, 신뢰할 수 있는 퍼블리셔만 인증
              배지를 받습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Servers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">인기 MCP 서버</h2>
          <Link
            to="/servers"
            className="text-primary hover:text-primary-hover font-medium flex items-center gap-1"
          >
            모두 보기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 to-lime/10 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            나만의 MCP 서버를 공유하세요
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            전 세계 개발자들과 함께 AI 생태계를 확장하세요. 간단한 등록
            프로세스로 몇 분 안에 배포할 수 있습니다.
          </p>
          <Button asChild size="lg">
            <Link to="/register">
              지금 서버 등록하기
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-placeholder">
            <p>&copy; 2025 MCP Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
