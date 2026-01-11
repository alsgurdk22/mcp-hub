import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { ToolboxPanel } from '@/components/chat/ToolboxPanel'
import { ChatArea } from '@/components/chat/ChatArea'
import { ExecutionPanel } from '@/components/chat/ExecutionPanel'
import { ServerBrowserModal } from '@/components/chat/ServerBrowserModal'
import type { Message, ToolCall } from '@/types'

export const Route = createFileRoute('/chat')({
  component: ChatInterface,
})

function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([])
  const [isServerBrowserOpen, setIsServerBrowserOpen] = useState(false)

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const addToolCall = (toolCall: Omit<ToolCall, 'id'>) => {
    const newToolCall: ToolCall = {
      ...toolCall,
      id: Date.now().toString(),
    }
    setToolCalls((prev) => {
      // Update existing or add new
      const existingIndex = prev.findIndex(
        (tc) =>
          tc.serverId === toolCall.serverId &&
          tc.toolName === toolCall.toolName &&
          tc.status === 'pending'
      )
      if (existingIndex >= 0 && toolCall.status !== 'pending') {
        const updated = [...prev]
        updated[existingIndex] = newToolCall
        return updated
      }
      return [...prev, newToolCall]
    })
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Toolbox */}
        <ToolboxPanel onAddServers={() => setIsServerBrowserOpen(true)} />

        {/* Center - Chat Area */}
        <ChatArea
          messages={messages}
          onSendMessage={addMessage}
          onToolCall={addToolCall}
        />

        {/* Right Sidebar - Execution Results */}
        <ExecutionPanel toolCalls={toolCalls} onClear={() => setToolCalls([])} />
      </div>

      {/* Server Browser Modal */}
      {isServerBrowserOpen && (
        <ServerBrowserModal onClose={() => setIsServerBrowserOpen(false)} />
      )}
    </div>
  )
}
