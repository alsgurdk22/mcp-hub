import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, MoreVertical, CheckCircle, Eye } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockServers } from '@/lib/mock-data'

export const Route = createFileRoute('/admin/servers')({
  component: AdminServers,
})

function AdminServers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredServers = mockServers.filter((server) => {
    if (statusFilter !== 'all' && server.status !== statusFilter) return false
    if (
      searchQuery &&
      !server.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false
    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge variant="success">Online</Badge>
      case 'degraded':
        return <Badge variant="warning">Degraded</Badge>
      case 'offline':
        return <Badge variant="error">Offline</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Server Management</h1>
            <p className="text-muted-foreground">
              등록된 모든 MCP 서버를 관리하세요
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-placeholder" />
                <Input
                  placeholder="서버 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">모든 상태</option>
                <option value="online">Online</option>
                <option value="degraded">Degraded</option>
                <option value="offline">Offline</option>
              </Select>
            </div>
          </Card>

          {/* Server Table */}
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-input/50">
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                      서버
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                      Publisher
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                      카테고리
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                      상태
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                      보안등급
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                      Downloads
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServers.map((server) => (
                    <tr
                      key={server.id}
                      className="border-b border-border hover:bg-input/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{server.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{server.name}</span>
                              {server.verified && (
                                <CheckCircle className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {server.toolsCount} tools
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {server.publisher}
                      </td>
                      <td className="py-4 px-6">
                        <Badge>{server.category}</Badge>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(server.status)}</td>
                      <td className="py-4 px-6">
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
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {server.downloads.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
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
