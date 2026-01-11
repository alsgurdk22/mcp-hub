import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { serverApi, type ServerFilters, type PaginationParams } from '@/lib/api'
import type { MCPServer } from '@/types'

// Query Keys
export const serverKeys = {
  all: ['servers'] as const,
  lists: () => [...serverKeys.all, 'list'] as const,
  list: (filters: ServerFilters, pagination: PaginationParams) =>
    [...serverKeys.lists(), filters, pagination] as const,
  details: () => [...serverKeys.all, 'detail'] as const,
  detail: (id: string) => [...serverKeys.details(), id] as const,
}

// Hooks
export function useServers(
  filters: ServerFilters = {},
  pagination: PaginationParams = {}
) {
  return useQuery({
    queryKey: serverKeys.list(filters, pagination),
    queryFn: () => serverApi.list(filters, pagination),
  })
}

export function useServer(id: string) {
  return useQuery({
    queryKey: serverKeys.detail(id),
    queryFn: () => serverApi.get(id),
    enabled: !!id,
  })
}

export function useCreateServer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<MCPServer>) => serverApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serverKeys.lists() })
    },
  })
}

export function useVerifyServer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => serverApi.verify(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: serverKeys.lists() })
      queryClient.invalidateQueries({ queryKey: serverKeys.detail(id) })
    },
  })
}

export function useRejectServer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => serverApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serverKeys.lists() })
    },
  })
}
