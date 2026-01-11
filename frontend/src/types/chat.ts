export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  toolCalls?: ToolCall[]
}

export interface ToolCall {
  id: string
  serverId: string
  serverName: string
  toolName: string
  status: ToolCallStatus
  executionTime?: number
  input?: unknown
  output?: unknown
  error?: string
}

export type ToolCallStatus = 'pending' | 'success' | 'error'
