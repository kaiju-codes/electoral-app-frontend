// Custom hooks for metrics API using React Query

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

// Query keys
export const metricsKeys = {
  all: ["metrics"] as const,
  summary: () => [...metricsKeys.all, "summary"] as const,
}

// Hook to get metrics summary
export function useMetrics() {
  return useQuery({
    queryKey: metricsKeys.summary(),
    queryFn: () => api.metrics.get(),
    // Refetch every 30 seconds for real-time metrics
    refetchInterval: 30000,
  })
}
