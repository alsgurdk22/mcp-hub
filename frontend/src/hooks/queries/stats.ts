import { useQuery } from '@tanstack/react-query'
import { statsApi } from '@/lib/api'

// Query Keys
export const statsKeys = {
  all: ['stats'] as const,
}

// Hooks
export function useStats() {
  return useQuery({
    queryKey: statsKeys.all,
    queryFn: () => statsApi.get(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
