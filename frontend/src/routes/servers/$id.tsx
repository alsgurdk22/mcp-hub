import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowLeft,
  Star,
  Download,
  Shield,
  CheckCircle,
  Plus,
  Check,
  Copy,
  ExternalLink,
  Calendar,
} from 'lucide-react'
import { toast } from 'sonner'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToolboxStore } from '@/stores/toolbox'
import { mockServers } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/servers/$id')({
  component: ServerDetail,
})

function ServerDetail() {
  const { id } = Route.useParams()
  const server = mockServers.find((s) => s.id === id)
  const [activeTab, setActiveTab] = useState('overview')
  const { addServer, removeServer, isInToolbox } = useToolboxStore()

  if (!server) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">서버를 찾을 수 없습니다</h1>
          <Link to="/servers" className="text-primary hover:underline">
            서버 목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  const inToolbox = isInToolbox(server.id)

  const handleToggleToolbox = () => {
    if (inToolbox) {
      removeServer(server.id)
      toast.success(`${server.name} 도구함에서 제거되었습니다`)
    } else {
      addServer(server)
      toast.success(`${server.name} 도구함에 추가되었습니다`)
    }
  }

  const copyEndpoint = () => {
    navigator.clipboard.writeText(`https://api.mcphub.io/mcp/${server.id}`)
    toast.success('엔드포인트가 클립보드에 복사되었습니다')
  }

  const getStatusColor = () => {
    switch (server.status) {
      case 'online':
        return 'bg-success'
      case 'degraded':
        return 'bg-warning'
      case 'offline':
        return 'bg-error'
    }
  }

  const getSecurityVariant = () => {
    switch (server.securityGrade) {
      case 'A':
        return 'success'
      case 'B':
        return 'warning'
      case 'C':
        return 'error'
    }
  }

  const relatedServers = mockServers
    .filter((s) => s.id !== server.id && s.category === server.category)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/servers"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>서버 목록으로 돌아가기</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <div className="border-l-4 border-primary pl-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{server.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-3xl font-bold">{server.name}</h1>
                      {server.verified && (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">
                      {server.publisher}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1 text-warning">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-medium">{server.rating}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Download className="w-4 h-4" />
                        <span>{server.downloads.toLocaleString()} downloads</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn('w-2 h-2 rounded-full', getStatusColor())}
                        />
                        <span className="text-sm text-muted-foreground capitalize">
                          {server.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="lime">{server.license}</Badge>
                <Badge variant={getSecurityVariant()}>
                  <Shield className="w-4 h-4 mr-1" />
                  Security Grade {server.securityGrade}
                </Badge>
                <Badge variant="info">
                  {server.authMethod === 'oauth'
                    ? 'OAuth'
                    : server.authMethod === 'apikey'
                      ? 'API Key'
                      : 'No Auth'}
                </Badge>
                <Badge>{server.category}</Badge>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tools">
                  Tools ({server.toolsCount})
                </TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">설명</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {server.description}
                  </p>

                  <h3 className="text-lg font-semibold mb-3">주요 기능</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>실시간 데이터 동기화</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>자동 오류 복구 및 재시도 메커니즘</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>상세한 로깅 및 모니터링</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">서버 엔드포인트</h2>
                  <div className="flex items-center gap-2 bg-input px-4 py-3 rounded-md">
                    <code className="flex-1 text-sm text-primary font-mono">
                      https://api.mcphub.io/mcp/{server.id}
                    </code>
                    <button
                      onClick={copyEndpoint}
                      className="p-2 hover:bg-border-hover rounded transition-colors"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tools" className="space-y-4">
                {server.tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="bg-card border border-border rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          {tool.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {tool.description}
                        </p>
                      </div>
                      <Badge variant="primary">Tool</Badge>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                        Parameters
                      </h4>
                      <div className="bg-input p-3 rounded-md font-mono text-sm">
                        <pre className="text-muted-foreground">
                          {JSON.stringify(tool.parameters, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="resources">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="space-y-4">
                    <a
                      href="#"
                      className="flex items-center justify-between p-4 bg-input rounded-lg hover:bg-border-hover transition-colors group"
                    >
                      <div>
                        <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                          공식 문서
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          상세한 API 레퍼런스 및 가이드
                        </p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-placeholder group-hover:text-primary transition-colors" />
                    </a>

                    <a
                      href="#"
                      className="flex items-center justify-between p-4 bg-input rounded-lg hover:bg-border-hover transition-colors group"
                    >
                      <div>
                        <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                          GitHub Repository
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          소스 코드 및 이슈 트래커
                        </p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-placeholder group-hover:text-primary transition-colors" />
                    </a>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <Button
                variant={inToolbox ? 'secondary' : 'primary'}
                className="w-full mb-3"
                onClick={handleToggleToolbox}
              >
                {inToolbox ? (
                  <>
                    <Check className="w-5 h-5" />
                    도구함에 추가됨
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    도구함에 추가
                  </>
                )}
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link to="/chat">AI 채팅에 적용</Link>
              </Button>
            </div>

            {/* Stats Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">서버 통계</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">이번 달 호출:</span>
                  <span className="font-medium">12,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">가동률:</span>
                  <span className="font-medium text-success">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">평균 응답시간:</span>
                  <span className="font-medium">245ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">마지막 업데이트:</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="font-medium">{server.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Servers */}
            {relatedServers.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4">관련 서버</h3>
                <div className="space-y-3">
                  {relatedServers.map((relatedServer) => (
                    <Link
                      key={relatedServer.id}
                      to="/servers/$id"
                      params={{ id: relatedServer.id }}
                      className="flex items-center gap-3 p-3 bg-input rounded-lg hover:bg-border-hover transition-colors"
                    >
                      <div className="text-2xl">{relatedServer.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {relatedServer.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {relatedServer.toolsCount} tools
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
