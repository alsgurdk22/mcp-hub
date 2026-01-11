import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, MoreVertical, Mail } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockUsers } from '@/lib/mock-data'

export const Route = createFileRoute('/admin/users')({
  component: AdminUsers,
})

function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filteredUsers = mockUsers.filter((user) => {
    if (roleFilter !== 'all' && user.role !== roleFilter) return false
    if (
      searchQuery &&
      !user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false
    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success">Active</Badge>
      case 'Suspended':
        return <Badge variant="error">Suspended</Badge>
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Badge variant="primary">Admin</Badge>
      case 'Developer':
        return <Badge variant="info">Developer</Badge>
      default:
        return <Badge>{role}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">
              플랫폼 사용자를 관리하세요
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="text-2xl font-bold">{mockUsers.length}</div>
              <div className="text-sm text-muted-foreground">전체 사용자</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-success">
                {mockUsers.filter((u) => u.status === 'Active').length}
              </div>
              <div className="text-sm text-muted-foreground">활성 사용자</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-info">
                {mockUsers.filter((u) => u.role === 'Developer').length}
              </div>
              <div className="text-sm text-muted-foreground">개발자</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-error">
                {mockUsers.filter((u) => u.status === 'Suspended').length}
              </div>
              <div className="text-sm text-muted-foreground">정지됨</div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-placeholder" />
                <Input
                  placeholder="사용자 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">모든 역할</option>
                <option value="Admin">Admin</option>
                <option value="Developer">Developer</option>
                <option value="User">User</option>
              </Select>
            </div>
          </Card>

          {/* User Table */}
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-input/50">
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                      사용자
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                      이메일
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                      역할
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                      서버 수
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                      상태
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                      마지막 활동
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border hover:bg-input/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{user.username}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="py-4 px-6">{getRoleBadge(user.role)}</td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {user.serversCount}
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(user.status)}</td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {user.lastActive}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Mail className="w-4 h-4" />
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
