import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi, type PaginationParams } from '@/lib/api'
import type { UserStatus } from '@/types'

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: { role?: string; search?: string }, pagination: PaginationParams) =>
    [...userKeys.lists(), filters, pagination] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

// Hooks
export function useUsers(
  filters: { role?: string; search?: string } = {},
  pagination: PaginationParams = {}
) {
  return useQuery({
    queryKey: userKeys.list(filters, pagination),
    queryFn: () => userApi.list(filters, pagination),
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.get(id),
    enabled: !!id,
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      userApi.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
    },
  })
}
