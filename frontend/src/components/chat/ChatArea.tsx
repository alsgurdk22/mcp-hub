import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Wrench } from 'lucide-react'
import { useToolboxStore } from '@/stores/toolbox'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Message, ToolCall } from '@/types'
import { cn } from '@/lib/utils'

interface ChatAreaProps {
  messages: Message[]
  onSendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  onToolCall: (toolCall: Omit<ToolCall, 'id'>) => void
}

export function ChatArea({ messages, onSendMessage, onToolCall }: ChatAreaProps) {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { getActiveServers, getActiveToolsCount } = useToolboxStore()

  const activeServersList = getActiveServers()
  const activeToolsCount = getActiveToolsCount()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput('')

    onSendMessage({
      role: 'user',
      content: userMessage,
    })

    setIsTyping(true)

    setTimeout(() => {
      const randomServer =
        activeServersList[Math.floor(Math.random() * activeServersList.length)]
      if (randomServer) {
        const randomTool =
          randomServer.tools[
            Math.floor(Math.random() * randomServer.tools.length)
          ]

        onToolCall({
          serverId: randomServer.id,
          serverName: randomServer.name,
          toolName: randomTool.name,
          status: 'pending',
        })

        setTimeout(() => {
          onToolCall({
            serverId: randomServer.id,
            serverName: randomServer.name,
            toolName: randomTool.name,
            status: 'success',
            executionTime: 0.8,
            input: { query: userMessage },
            output: { result: '성공적으로 실행되었습니다' },
          })

          onSendMessage({
            role: 'assistant',
            content: `${randomTool.name} 도구를 사용하여 요청을 처리했습니다. 결과를 확인해보세요!`,
            toolCalls: [
              {
                id: Date.now().toString(),
                serverId: randomServer.id,
                serverName: randomServer.name,
                toolName: randomTool.name,
                status: 'success',
                executionTime: 0.8,
              },
            ],
          })

          setIsTyping(false)
        }, 1500)
      } else {
        onSendMessage({
          role: 'assistant',
          content:
            '도구함에 활성화된 서버가 없습니다. 먼저 MCP 서버를 추가하고 활성화해주세요.',
        })
        setIsTyping(false)
      }
    }, 500)
  }

  const getSuggestedPrompts = () => {
    if (activeServersList.length === 0) return []

    return [
      '카카오맵에서 강남역 주변 맛집 찾아줘',
      '오늘 날씨 알려줘',
      'GitHub에서 MCP 관련 저장소 검색해줘',
    ]
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">AI 채팅</h2>
            {activeToolsCount > 0 && (
              <p className="text-sm text-muted-foreground">
                🛠 <span className="text-primary">{activeToolsCount}</span> tools
                active
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">대화를 시작하세요</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              {activeToolsCount > 0
                ? 'MCP 도구를 활용하여 AI와 대화할 수 있습니다'
                : '먼저 도구함에 MCP 서버를 추가하고 활성화하세요'}
            </p>

            {getSuggestedPrompts().length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center mb-3">
                  추천 프롬프트:
                </p>
                {getSuggestedPrompts().map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(prompt)}
                    className="block w-full px-4 py-2 bg-card border border-border rounded-lg text-left hover:border-primary transition-colors text-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg p-4',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>

                  {message.toolCalls && message.toolCalls.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.toolCalls.map((toolCall) => (
                        <div
                          key={toolCall.id}
                          className="p-3 bg-input border-l-2 border-primary rounded"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Wrench className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">
                              Tool Called: {toolCall.toolName}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Server: {toolCall.serverName}
                          </div>
                          <div className="text-xs mt-1">
                            {toolCall.status === 'success' && (
                              <span className="text-success">
                                ✅ Success ({toolCall.executionTime}s)
                              </span>
                            )}
                            {toolCall.status === 'pending' && (
                              <span className="text-warning">⏳ Pending...</span>
                            )}
                            {toolCall.status === 'error' && (
                              <span className="text-error">❌ Error</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs mt-2 opacity-60">
                    {message.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="메시지를 입력하세요..."
            className="flex-1 min-h-[44px] max-h-32"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-6"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-placeholder mt-2">
          Enter로 전송, Shift+Enter로 줄바꿈
        </p>
      </div>
    </div>
  )
}
