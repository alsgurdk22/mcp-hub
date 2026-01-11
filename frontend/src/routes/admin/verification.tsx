import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockServers } from '@/lib/mock-data'

export const Route = createFileRoute('/admin/verification')({
  component: AdminVerification,
})

function AdminVerification() {
  const unverifiedServers = mockServers.filter((s) => !s.verified)
  const verifiedServers = mockServers.filter((s) => s.verified)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Server Verification</h1>
            <p className="text-muted-foreground">
              서버 인증 요청을 검토하고 관리하세요
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{unverifiedServers.length}</div>
                  <div className="text-sm text-muted-foreground">인증 대기</div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{verifiedServers.length}</div>
                  <div className="text-sm text-muted-foreground">인증 완료</div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {Math.round((verifiedServers.length / mockServers.length) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">인증률</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Pending Verification */}
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">인증 대기 서버</h2>
              <Badge variant="warning">{unverifiedServers.length} pending</Badge>
            </div>
            <div className="space-y-4">
              {unverifiedServers.map((server) => (
                <div
                  key={server.id}
                  className="flex items-center justify-between p-4 bg-input rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{server.icon}</span>
                    <div>
                      <div className="font-semibold">{server.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {server.publisher} • {server.category}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            server.securityGrade === 'A'
                              ? 'success'
                              : server.securityGrade === 'B'
                                ? 'warning'
                                : 'error'
                          }
                        >
                          Grade {server.securityGrade}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {server.toolsCount} tools • {server.downloads.toLocaleString()} downloads
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm">
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button size="sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verify
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recently Verified */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">최근 인증된 서버</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {verifiedServers.slice(0, 6).map((server) => (
                <div
                  key={server.id}
                  className="flex items-center gap-3 p-3 bg-success/5 border border-success/20 rounded-lg"
                >
                  <span className="text-2xl">{server.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{server.name}</span>
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {server.publisher}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
