// Custom hooks for extraction runs API using React Query

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { ExtractionRunsQueryParams } from "@/lib/types"

// Query keys
export const extractionRunsKeys = {
  all: ["extraction-runs"] as const,
  lists: () => [...extractionRunsKeys.all, "list"] as const,
  list: (params: ExtractionRunsQueryParams) => [...extractionRunsKeys.lists(), params] as const,
  details: () => [...extractionRunsKeys.all, "detail"] as const,
  detail: (id: number) => [...extractionRunsKeys.details(), id] as const,
}

// Hook to list extraction runs
export function useExtractionRuns(params: ExtractionRunsQueryParams = {}) {
  return useQuery({
    queryKey: extractionRunsKeys.list(params),
    queryFn: () => api.extractionRuns.list(params),
  })
}

// Hook to get a single extraction run
export function useExtractionRun(runId: number) {
  return useQuery({
    queryKey: extractionRunsKeys.detail(runId),
    queryFn: () => api.extractionRuns.get(runId),
    enabled: !!runId,
  })
}
