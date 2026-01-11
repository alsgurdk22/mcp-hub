export interface MCPServer {
  id: string
  name: string
  icon: string
  publisher: string
  description: string
  toolsCount: number
  category: ServerCategory
  status: ServerStatus
  verified: boolean
  rating: number
  downloads: number
  securityGrade: SecurityGrade
  license: string
  lastUpdated: string
  authMethod: AuthMethod
  tools: Tool[]
}

export interface Tool {
  id: string
  name: string
  description: string
  parameters: Record<string, string>
}

export type ServerStatus = 'online' | 'offline' | 'degraded'

export type SecurityGrade = 'A' | 'B' | 'C'

export type AuthMethod = 'oauth' | 'apikey' | 'none'

export type ServerCategory =
  | 'Developer Tools'
  | 'Maps & Location'
  | 'Weather & Environment'
  | 'News & Media'
  | 'Productivity'
  | 'Communication'
  | 'Database'
  | 'E-Commerce'
  | 'AI & ML'
  | 'Language & Translation'
  | 'Finance'
  | 'Social Media'

export const SERVER_CATEGORIES: ServerCategory[] = [
  'Developer Tools',
  'Maps & Location',
  'Weather & Environment',
  'News & Media',
  'Productivity',
  'Communication',
  'Database',
  'E-Commerce',
  'AI & ML',
  'Language & Translation',
  'Finance',
  'Social Media',
]
