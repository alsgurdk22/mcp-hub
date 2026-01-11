import { useState } from 'react'
import { X, Search, Plus, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useToolboxStore } from '@/stores/toolbox'
import { mockServers } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SERVER_CATEGORIES } from '@/types'

interface ServerBrowserModalProps {
  onClose: () => void
}

export function ServerBrowserModal({ onClose }: ServerBrowserModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const { addServer, isInToolbox } = useToolboxStore()

  const filteredServers = mockServers.filter((server) => {
    if (
      selectedCategory !== 'All' &&
      server.category !== selectedCategory
    ) {
      return false
    }
    if (
      searchQuery &&
      !server.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !server.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    return true
  })

  const handleAddServer = (server: (typeof mockServers)[0]) => {
    addServer(server)
    toast.success(`${server.name} 도구함에 추가되었습니다`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[80vh] bg-card border border-border rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold">MCP 서버 추가</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-input rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-placeholder" />
            <Input
              type="text"
              placeholder="서버 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="p-4 border-b border-border">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-input text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            {SERVER_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-input text-muted-foreground hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Server List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServers.map((server) => {
              const inToolbox = isInToolbox(server.id)
              return (
                <div
                  key={server.id}
                  className="p-4 bg-input border border-border rounded-lg hover:border-border-hover transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{server.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{server.name}</h3>
                        {server.verified && (
                          <Badge variant="primary" className="text-[10px] px-1.5 py-0">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {server.publisher}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {server.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-placeholder">
                          {server.toolsCount} tools
                        </span>
                        <Button
                          variant={inToolbox ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => handleAddServer(server)}
                          disabled={inToolbox}
                        >
                          {inToolbox ? (
                            <>
                              <Check className="w-4 h-4" />
                              추가됨
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              추가
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredServers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">검색 결과가 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
