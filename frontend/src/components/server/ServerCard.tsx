import { Link } from '@tanstack/react-router'
import { Star, Download, Shield, CheckCircle, Plus, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useToolboxStore } from '@/stores/toolbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { MCPServer } from '@/types'

interface ServerCardProps {
  server: MCPServer
  className?: string
}

export function ServerCard({ server, className }: ServerCardProps) {
  const { addServer, removeServer, isInToolbox } = useToolboxStore()
  const inToolbox = isInToolbox(server.id)

  const handleToggleToolbox = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inToolbox) {
      removeServer(server.id)
      toast.success(`${server.name} 도구함에서 제거되었습니다`)
    } else {
      addServer(server)
      toast.success(`${server.name} 도구함에 추가되었습니다`)
    }
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

  return (
    <Link
      to="/servers/$id"
      params={{ id: server.id }}
      className={cn(
        'block bg-card border border-border rounded-lg p-4 transition-all hover:border-border-hover group',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="text-3xl flex-shrink-0">{server.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {server.name}
              </h3>
              {server.verified && (
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">{server.publisher}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-warning flex-shrink-0 ml-2">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium">{server.rating}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {server.description}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-3 text-xs text-placeholder">
        <div className="flex items-center gap-1">
          <span>🛠</span>
          <span>{server.toolsCount} Tools</span>
        </div>
        <div className="flex items-center gap-1">
          <Download className="w-3 h-3" />
          <span>{server.downloads.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={cn('w-2 h-2 rounded-full', getStatusColor())} />
          <span className="capitalize">{server.status}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Badge variant="lime">{server.license}</Badge>
        <Badge variant={getSecurityVariant()}>
          <Shield className="w-3 h-3 mr-1" />
          Grade {server.securityGrade}
        </Badge>
        <Badge variant="info">
          {server.authMethod === 'oauth'
            ? 'OAuth'
            : server.authMethod === 'apikey'
              ? 'API Key'
              : 'No Auth'}
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant={inToolbox ? 'secondary' : 'primary'}
          size="sm"
          className="flex-1"
          onClick={handleToggleToolbox}
        >
          {inToolbox ? (
            <>
              <Check className="w-4 h-4" />
              도구함에 추가됨
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              도구함에 추가
            </>
          )}
        </Button>
        <Button variant="secondary" size="sm">
          상세보기
        </Button>
      </div>
    </Link>
  )
}
