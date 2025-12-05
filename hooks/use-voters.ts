// Custom hooks for voters API using React Query

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { VotersQueryParams } from "@/lib/types"

// Query keys
export const votersKeys = {
  all: ["voters"] as const,
  lists: () => [...votersKeys.all, "list"] as const,
  list: (params: VotersQueryParams) => [...votersKeys.lists(), params] as const,
}

// Hook to list voters
export function useVoters(params: VotersQueryParams) {
  return useQuery({
    queryKey: votersKeys.list(params),
    queryFn: () => api.voters.list(params),
    // Only enable the query if required params are provided
    enabled: !!(params.state && params.assembly_constituency_number),
  })
}
