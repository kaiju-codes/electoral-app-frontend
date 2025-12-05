// Custom hooks for location APIs using React Query

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

// Query keys
export const locationKeys = {
  all: ["location"] as const,
  states: () => [...locationKeys.all, "states"] as const,
  constituencies: () => [...locationKeys.all, "constituencies"] as const,
  constituenciesByState: (state: string) => [...locationKeys.constituencies(), state] as const,
}

// Hook to get all states
export function useStates() {
  return useQuery({
    queryKey: locationKeys.states(),
    queryFn: () => api.location.getStates(),
    // Cache states for a long time since they don't change often
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  })
}

// Hook to get constituencies for a specific state
export function useConstituencies(state: string) {
  return useQuery({
    queryKey: locationKeys.constituenciesByState(state),
    queryFn: () => api.location.getConstituencies(state),
    enabled: !!state, // Only run query if state is provided
    // Cache constituencies for a reasonable time
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}
