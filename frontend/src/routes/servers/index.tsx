import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, Grid, List, SlidersHorizontal } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { ServerCard } from '@/components/server/ServerCard'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { mockServers } from '@/lib/mock-data'
import { SERVER_CATEGORIES } from '@/types'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/servers/')({
  component: ServerList,
})

function ServerList() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [securityFilter, setSecurityFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating' | 'tools'>(
    'popular'
  )
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredServers = mockServers
    .filter((server) => {
      if (selectedCategory !== 'All' && server.category !== selectedCategory)
        return false
      if (
        searchQuery &&
        !server.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !server.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      if (statusFilter !== 'all' && server.status !== statusFilter) return false
      if (securityFilter !== 'all' && server.securityGrade !== securityFilter)
        return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.downloads - a.downloads
        case 'rating':
          return b.rating - a.rating
        case 'tools':
          return b.toolsCount - a.toolsCount
        case 'recent':
          return 0
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">MCP 서버 둘러보기</h1>
          <p className="text-muted-foreground">
            {mockServers.length}개의 검증된 MCP 서버를 탐색하고 도구함에 추가하세요
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-placeholder" />
              <Input
                type="text"
                placeholder="서버 이름 또는 설명 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">모든 상태</option>
              <option value="online">온라인</option>
              <option value="degraded">제한적</option>
              <option value="offline">오프라인</option>
            </Select>

            {/* Security Filter */}
            <Select
              value={securityFilter}
              onChange={(e) => setSecurityFilter(e.target.value)}
            >
              <option value="all">모든 보안등급</option>
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
              <option value="C">Grade C</option>
            </Select>

            {/* Sort */}
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            >
              <option value="popular">인기순</option>
              <option value="recent">최신순</option>
              <option value="rating">평점순</option>
              <option value="tools">도구수순</option>
            </Select>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-input text-muted-foreground hover:text-foreground'
                )}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-input text-muted-foreground hover:text-foreground'
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-all',
              selectedCategory === 'All'
                ? 'bg-primary text-primary-foreground'
                : 'bg-input text-muted-foreground hover:text-foreground hover:bg-border-hover'
            )}
          >
            All
          </button>
          {SERVER_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-input text-muted-foreground hover:text-foreground hover:bg-border-hover'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-muted-foreground">
          {filteredServers.length}개의 서버 발견
        </div>

        {/* Server Grid/List */}
        {filteredServers.length > 0 ? (
          <div
            className={cn(
              'grid gap-6',
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            )}
          >
            {filteredServers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <SlidersHorizontal className="w-16 h-16 text-placeholder mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">검색 결과 없음</h3>
            <p className="text-muted-foreground">다른 필터를 시도해보세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
