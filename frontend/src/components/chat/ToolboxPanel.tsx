import { Plus, ChevronDown, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'
import { useToolboxStore } from '@/stores/toolbox'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ToolboxPanelProps {
  onAddServers: () => void
}

export function ToolboxPanel({ onAddServers }: ToolboxPanelProps) {
  const {
    servers,
    isActive,
    toggleActive,
    removeServer,
    getTotalToolsCount,
    getActiveToolsCount,
  } = useToolboxStore()
  const [expandedServers, setExpandedServers] = useState<Set<string>>(new Set())

  const totalTools = getTotalToolsCount()
  const activeToolsCount = getActiveToolsCount()

  const toggleExpanded = (serverId: string) => {
    setExpandedServers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(serverId)) {
        newSet.delete(serverId)
      } else {
        newSet.add(serverId)
      }
      return newSet
    })
  }

  if (servers.length === 0) {
    return (
      <div className="w-80 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-lg">내 도구함</h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-6xl mb-4">🛠️</div>
          <h3 className="font-semibold mb-2">도구함이 비어있습니다</h3>
          <p className="text-sm text-muted-foreground mb-6">
            MCP 서버를 추가해서 AI와 대화를 시작하세요
          </p>
          <Button onClick={onAddServers}>
            <Plus className="w-4 h-4" />
            서버 추가하기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">내 도구함</h2>
          <div className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-xs font-medium text-primary">
            {activeToolsCount} / {totalTools} tools
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={onAddServers}
        >
          <Plus className="w-4 h-4" />
          서버 추가
        </Button>
      </div>

      {/* Server List */}
      <div className="flex-1 overflow-y-auto">
        {servers.map((server) => {
          const serverActive = isActive(server.id)
          const isExpanded = expandedServers.has(server.id)

          return (
            <div key={server.id} className="border-b border-border">
              <div className="p-3 flex items-center gap-3">
                <button
                  onClick={() => toggleExpanded(server.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                <div className="text-2xl">{server.icon}</div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{server.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {server.toolsCount} tools
                  </p>
                </div>

                <Switch
                  checked={serverActive}
                  onCheckedChange={() => toggleActive(server.id)}
                />

                <button
                  onClick={() => removeServer(server.id)}
                  className="p-1 text-muted-foreground hover:text-error rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Expanded Tools List */}
              {isExpanded && (
                <div className="px-3 pb-3 ml-7 space-y-1">
                  {server.tools.map((tool) => (
                    <div
                      key={tool.id}
                      className={cn(
                        'p-2 bg-input rounded text-xs',
                        !serverActive && 'opacity-50'
                      )}
                    >
                      <div className="font-medium text-foreground mb-0.5">
                        {tool.name}
                      </div>
                      <div className="text-placeholder">{tool.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
