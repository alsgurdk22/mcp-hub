import { create } from 'zustand'
import type { MCPServer } from '@/types'

interface ToolboxState {
  servers: MCPServer[]
  activeServerIds: Set<string>
  addServer: (server: MCPServer) => void
  removeServer: (id: string) => void
  toggleActive: (id: string) => void
  isInToolbox: (id: string) => boolean
  isActive: (id: string) => boolean
  getActiveServers: () => MCPServer[]
  getTotalToolsCount: () => number
  getActiveToolsCount: () => number
}

export const useToolboxStore = create<ToolboxState>((set, get) => ({
  servers: [],
  activeServerIds: new Set(),

  addServer: (server) =>
    set((state) => {
      if (state.servers.some((s) => s.id === server.id)) {
        return state
      }
      return {
        servers: [...state.servers, server],
        activeServerIds: new Set([...state.activeServerIds, server.id]),
      }
    }),

  removeServer: (id) =>
    set((state) => {
      const newActiveIds = new Set(state.activeServerIds)
      newActiveIds.delete(id)
      return {
        servers: state.servers.filter((s) => s.id !== id),
        activeServerIds: newActiveIds,
      }
    }),

  toggleActive: (id) =>
    set((state) => {
      const newActiveIds = new Set(state.activeServerIds)
      if (newActiveIds.has(id)) {
        newActiveIds.delete(id)
      } else {
        newActiveIds.add(id)
      }
      return { activeServerIds: newActiveIds }
    }),

  isInToolbox: (id) => get().servers.some((s) => s.id === id),

  isActive: (id) => get().activeServerIds.has(id),

  getActiveServers: () => {
    const { servers, activeServerIds } = get()
    return servers.filter((s) => activeServerIds.has(s.id))
  },

  getTotalToolsCount: () => {
    return get().servers.reduce((acc, s) => acc + s.toolsCount, 0)
  },

  getActiveToolsCount: () => {
    return get()
      .getActiveServers()
      .reduce((acc, s) => acc + s.toolsCount, 0)
  },
}))
