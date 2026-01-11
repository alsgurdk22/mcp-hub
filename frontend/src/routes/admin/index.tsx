import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Server,
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockStats, mockServers } from '@/lib/mock-data'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const pendingServers = mockServers.filter((s) => s.status === 'degraded').slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">플랫폼 전체 현황을 확인하세요</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-rose/10 rounded-lg flex items-center justify-center">
                  <Server className="w-6 h-6 text-rose" />
                </div>
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {mockStats.totalServers}
              </div>
              <div className="text-muted-foreground text-sm">총 등록 서버</div>
              <div className="mt-3 text-xs text-success">+12% from last month</div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-info" />
                </div>
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {mockStats.activeToday.toLocaleString()}
              </div>
              <div className="text-muted-foreground text-sm">오늘 활성 사용자</div>
              <div className="mt-3 text-xs text-success">+8% from yesterday</div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-success" />
                </div>
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {(mockStats.apiCalls / 1000000).toFixed(1)}M
              </div>
              <div className="text-muted-foreground text-sm">API 호출 수</div>
              <div className="mt-3 text-xs text-success">+24% from last week</div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
                <Badge variant="error">{mockStats.pendingApprovals}</Badge>
              </div>
              <div className="text-3xl font-bold mb-1">
                {mockStats.pendingApprovals}
              </div>
              <div className="text-muted-foreground text-sm">승인 대기 중</div>
              <Link
                to="/admin/servers"
                className="mt-3 text-xs text-error hover:underline block"
              >
                Review now →
              </Link>
            </Card>
          </div>

          {/* Server Health Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <h2 className="text-xl font-semibold mb-4">서버 상태 개요</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span className="text-muted-foreground">정상 작동</span>
                  </div>
                  <span className="font-semibold">{mockStats.healthyServers}</span>
                </div>
                <div className="w-full bg-input rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full"
                    style={{
                      width: `${(mockStats.healthyServers / mockStats.totalServers) * 100}%`,
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                    <span className="text-muted-foreground">제한적 작동</span>
                  </div>
                  <span className="font-semibold">{mockStats.degradedServers}</span>
                </div>
                <div className="w-full bg-input rounded-full h-2">
                  <div
                    className="bg-warning h-2 rounded-full"
                    style={{
                      width: `${(mockStats.degradedServers / mockStats.totalServers) * 100}%`,
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-error rounded-full"></div>
                    <span className="text-muted-foreground">오프라인</span>
                  </div>
                  <span className="font-semibold">{mockStats.offlineServers}</span>
                </div>
                <div className="w-full bg-input rounded-full h-2">
                  <div
                    className="bg-error h-2 rounded-full"
                    style={{
                      width: `${(mockStats.offlineServers / mockStats.totalServers) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold mb-4">최근 활동</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-input rounded-lg">
                  <div className="w-2 h-2 bg-success rounded-full mt-1.5"></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">새 서버 승인됨</div>
                    <div className="text-xs text-muted-foreground">
                      Kakao Map MCP가 승인되었습니다
                    </div>
                    <div className="text-xs text-placeholder mt-1">2시간 전</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-input rounded-lg">
                  <div className="w-2 h-2 bg-warning rounded-full mt-1.5"></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">보안 경고</div>
                    <div className="text-xs text-muted-foreground">
                      Database Query MCP의 응답 시간 증가
                    </div>
                    <div className="text-xs text-placeholder mt-1">4시간 전</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-input rounded-lg">
                  <div className="w-2 h-2 bg-info rounded-full mt-1.5"></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">새 사용자 등록</div>
                    <div className="text-xs text-muted-foreground">
                      developer1이 계정을 생성했습니다
                    </div>
                    <div className="text-xs text-placeholder mt-1">6시간 전</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Pending Approvals */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">승인 대기 서버</h2>
              <Link
                to="/admin/servers"
                className="text-primary hover:text-primary-hover text-sm"
              >
                모두 보기 →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      서버
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Publisher
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      등록일
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      상태
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingServers.map((server) => (
                    <tr
                      key={server.id}
                      className="border-b border-border hover:bg-input/50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{server.icon}</span>
                          <span className="font-medium">{server.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {server.publisher}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {server.lastUpdated}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="warning">Pending</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to="/admin/servers"
                          className="text-primary hover:text-primary-hover text-sm"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
