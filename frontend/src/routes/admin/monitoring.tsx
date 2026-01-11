import { createFileRoute } from '@tanstack/react-router'
import { Activity, Server, Zap, Clock } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockStats, mockServers } from '@/lib/mock-data'

export const Route = createFileRoute('/admin/monitoring')({
  component: AdminMonitoring,
})

function AdminMonitoring() {
  const onlineServers = mockServers.filter((s) => s.status === 'online')
  const degradedServers = mockServers.filter((s) => s.status === 'degraded')

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">System Monitoring</h1>
            <p className="text-muted-foreground">
              실시간 시스템 상태를 모니터링하세요
            </p>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-info" />
                </div>
                <div>
                  <div className="text-2xl font-bold">245ms</div>
                  <div className="text-sm text-muted-foreground">Avg Response</div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Server className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{mockStats.healthyServers}</div>
                  <div className="text-sm text-muted-foreground">Healthy</div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{mockStats.degradedServers}</div>
                  <div className="text-sm text-muted-foreground">Issues</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Healthy Servers */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">정상 서버</h2>
                <Badge variant="success">{onlineServers.length}</Badge>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {onlineServers.slice(0, 8).map((server) => (
                  <div
                    key={server.id}
                    className="flex items-center justify-between p-3 bg-input rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{server.icon}</span>
                      <div>
                        <div className="font-medium">{server.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {server.publisher}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-success">Online</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 100 + 150)}ms
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Degraded Servers */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">주의 필요</h2>
                <Badge variant="warning">{degradedServers.length}</Badge>
              </div>
              <div className="space-y-3">
                {degradedServers.map((server) => (
                  <div
                    key={server.id}
                    className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{server.icon}</span>
                      <div>
                        <div className="font-medium">{server.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {server.publisher}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-warning">
                        Degraded
                      </div>
                      <div className="text-xs text-muted-foreground">
                        High latency
                      </div>
                    </div>
                  </div>
                ))}
                {degradedServers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    모든 서버가 정상 작동 중입니다
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
