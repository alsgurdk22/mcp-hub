import { Trash2, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ToolCall } from '@/types'
import { cn } from '@/lib/utils'

interface ExecutionPanelProps {
  toolCalls: ToolCall[]
  onClear: () => void
}

export function ExecutionPanel({ toolCalls, onClear }: ExecutionPanelProps) {
  if (toolCalls.length === 0) {
    return (
      <div className="w-80 bg-card border-l border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-lg">실행 결과</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="font-semibold mb-2">실행 기록이 없습니다</h3>
          <p className="text-sm text-muted-foreground">
            AI가 도구를 사용하면 여기에 결과가 표시됩니다
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-lg">실행 결과</h2>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {toolCalls.map((call) => (
          <div
            key={call.id}
            className={cn(
              'p-3 rounded-lg border',
              call.status === 'success' && 'border-success/30 bg-success/5',
              call.status === 'error' && 'border-error/30 bg-error/5',
              call.status === 'pending' && 'border-warning/30 bg-warning/5'
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {call.status === 'success' && (
                  <CheckCircle className="w-4 h-4 text-success" />
                )}
                {call.status === 'error' && (
                  <XCircle className="w-4 h-4 text-error" />
                )}
                {call.status === 'pending' && (
                  <Clock className="w-4 h-4 text-warning animate-pulse" />
                )}
                <span className="font-medium text-sm">{call.toolName}</span>
              </div>
              {call.executionTime && (
                <span className="text-xs text-muted-foreground">
                  {call.executionTime}s
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-2">
              {call.serverName}
            </p>

            {call.input !== undefined && (
              <div className="mb-2">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Input:
                </p>
                <pre className="text-xs bg-input p-2 rounded overflow-x-auto">
                  {JSON.stringify(call.input, null, 2)}
                </pre>
              </div>
            )}

            {call.output !== undefined && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Output:
                </p>
                <pre className="text-xs bg-input p-2 rounded overflow-x-auto">
                  {JSON.stringify(call.output, null, 2)}
                </pre>
              </div>
            )}

            {call.error && (
              <div className="mt-2 p-2 bg-error/10 border border-error/20 rounded text-xs text-error">
                {call.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
