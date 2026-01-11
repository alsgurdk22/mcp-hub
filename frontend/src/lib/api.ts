/**
 * Mock API Client
 * 실제 백엔드 없이 목데이터로 API 시뮬레이션
 */

import { mockServers, mockUsers, mockStats } from './mock-data'
import type { MCPServer, User } from '@/types'

// 네트워크 지연 시뮬레이션
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 랜덤 지연 (200~500ms)
const randomDelay = () => delay(200 + Math.random() * 300)

export interface ServerFilters {
  category?: string
  status?: string
  securityGrade?: string
  search?: string
  sortBy?: 'popular' | 'recent' | 'rating' | 'tools'
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Server API
export const serverApi = {
  async list(
    filters: ServerFilters = {},
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<MCPServer>> {
    await randomDelay()

    let filtered = [...mockServers]

    // 필터링
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter((s) => s.category === filters.category)
    }
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((s) => s.status === filters.status)
    }
    if (filters.securityGrade && filters.securityGrade !== 'all') {
      filtered = filtered.filter((s) => s.securityGrade === filters.securityGrade)
    }
    if (filters.search) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.publisher.toLowerCase().includes(query)
      )
    }

    // 정렬
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'popular':
            return b.downloads - a.downloads
          case 'rating':
            return b.rating - a.rating
          case 'tools':
            return b.toolsCount - a.toolsCount
          case 'recent':
            return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
          default:
            return 0
        }
      })
    }

    // 페이지네이션
    const page = pagination.page || 1
    const limit = pagination.limit || 12
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedData = filtered.slice(start, end)

    return {
      data: paginatedData,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    }
  },

  async get(id: string): Promise<MCPServer | null> {
    await randomDelay()
    return mockServers.find((s) => s.id === id) || null
  },

  async create(data: Partial<MCPServer>): Promise<MCPServer> {
    await randomDelay()
    const newServer: MCPServer = {
      id: `server-${Date.now()}`,
      name: data.name || 'New Server',
      icon: '🔧',
      publisher: data.publisher || 'Unknown',
      description: data.description || '',
      toolsCount: 0,
      category: data.category || 'Developer Tools',
      status: 'online',
      verified: false,
      rating: 0,
      downloads: 0,
      securityGrade: 'B',
      license: data.license || 'MIT',
      lastUpdated: new Date().toISOString().split('T')[0],
      authMethod: data.authMethod || 'none',
      tools: [],
    }
    mockServers.push(newServer)
    return newServer
  },

  async verify(id: string): Promise<MCPServer | null> {
    await randomDelay()
    const server = mockServers.find((s) => s.id === id)
    if (server) {
      server.verified = true
    }
    return server || null
  },

  async reject(id: string): Promise<boolean> {
    await randomDelay()
    const index = mockServers.findIndex((s) => s.id === id)
    if (index !== -1) {
      mockServers.splice(index, 1)
      return true
    }
    return false
  },
}

// User API
export const userApi = {
  async list(
    filters: { role?: string; search?: string } = {},
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<User>> {
    await randomDelay()

    let filtered = [...mockUsers]

    if (filters.role && filters.role !== 'all') {
      filtered = filtered.filter((u) => u.role === filters.role)
    }
    if (filters.search) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(
        (u) =>
          u.username.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      )
    }

    const page = pagination.page || 1
    const limit = pagination.limit || 20
    const start = (page - 1) * limit
    const end = start + limit

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    }
  },

  async get(id: string): Promise<User | null> {
    await randomDelay()
    return mockUsers.find((u) => u.id === id) || null
  },

  async updateStatus(id: string, status: User['status']): Promise<User | null> {
    await randomDelay()
    const user = mockUsers.find((u) => u.id === id)
    if (user) {
      user.status = status
    }
    return user || null
  },
}

// Stats API
export const statsApi = {
  async get() {
    await randomDelay()
    return mockStats
  },
}

// Auth API (Mock)
export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  username: string
  role: 'Admin' | 'Developer' | 'User'
  avatar?: string
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    await delay(500)

    // Mock login - any email/password works
    if (credentials.email && credentials.password) {
      const isAdmin = credentials.email.includes('admin')
      return {
        user: {
          id: 'user-1',
          email: credentials.email,
          username: credentials.email.split('@')[0],
          role: isAdmin ? 'Admin' : 'Developer',
        },
        token: 'mock-jwt-token-' + Date.now(),
      }
    }
    throw new Error('Invalid credentials')
  },

  async signup(data: {
    email: string
    password: string
    username: string
  }): Promise<{ user: AuthUser; token: string }> {
    await delay(500)

    return {
      user: {
        id: 'user-' + Date.now(),
        email: data.email,
        username: data.username,
        role: 'Developer',
      },
      token: 'mock-jwt-token-' + Date.now(),
    }
  },

  async me(): Promise<AuthUser | null> {
    await delay(200)
    const token = localStorage.getItem('auth_token')
    if (token) {
      const userData = localStorage.getItem('auth_user')
      return userData ? JSON.parse(userData) : null
    }
    return null
  },

  async logout(): Promise<void> {
    await delay(200)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  },
}

// Chat API (Mock AI)
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export const chatApi = {
  async sendMessage(
    messages: ChatMessage[],
    activeTools: { serverId: string; serverName: string; toolName: string }[]
  ): Promise<{
    response: string
    toolCalls?: {
      serverId: string
      serverName: string
      toolName: string
      input: Record<string, unknown>
      output: Record<string, unknown>
    }[]
  }> {
    await delay(1000 + Math.random() * 1000)

    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || ''

    // Mock AI responses based on keywords
    if (lastMessage.includes('날씨') || lastMessage.includes('weather')) {
      if (activeTools.some((t) => t.toolName.toLowerCase().includes('weather'))) {
        return {
          response:
            '현재 서울의 날씨를 확인했습니다. 맑은 날씨이며 기온은 22°C입니다. 오늘 하루 동안 비가 올 확률은 10%로 낮습니다.',
          toolCalls: [
            {
              serverId: 'weather-1',
              serverName: 'Weather API',
              toolName: 'get_current_weather',
              input: { location: 'Seoul, KR', units: 'metric' },
              output: {
                temperature: 22,
                condition: 'Clear',
                humidity: 45,
                wind_speed: 12,
              },
            },
          ],
        }
      }
    }

    if (lastMessage.includes('파일') || lastMessage.includes('file')) {
      if (activeTools.some((t) => t.serverName.toLowerCase().includes('file'))) {
        return {
          response:
            '파일 시스템을 확인했습니다. 현재 디렉토리에 15개의 파일이 있습니다.',
          toolCalls: [
            {
              serverId: 'filesystem-1',
              serverName: 'File System',
              toolName: 'list_directory',
              input: { path: './' },
              output: {
                files: ['index.ts', 'package.json', 'README.md'],
                count: 15,
              },
            },
          ],
        }
      }
    }

    if (lastMessage.includes('검색') || lastMessage.includes('search')) {
      return {
        response:
          '검색 결과를 찾았습니다. 관련된 정보를 정리해드리겠습니다.\n\n1. **React 19** - 새로운 기능 소개\n2. **TypeScript 5.x** - 타입 시스템 개선\n3. **Vite 6** - 빌드 도구 업데이트',
      }
    }

    // Default response
    const responses = [
      '안녕하세요! 무엇을 도와드릴까요? 도구함에 MCP 서버를 추가하면 더 많은 기능을 사용할 수 있습니다.',
      '네, 이해했습니다. 추가적인 정보가 필요하시면 말씀해주세요.',
      '흥미로운 질문이네요! 도구함의 서버들을 활용해서 더 정확한 답변을 드릴 수 있습니다.',
      '알겠습니다. 다른 궁금한 점이 있으시면 언제든 물어보세요.',
    ]

    return {
      response: responses[Math.floor(Math.random() * responses.length)],
    }
  },
}
