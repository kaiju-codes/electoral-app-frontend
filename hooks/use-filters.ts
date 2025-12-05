/**
 * Simplified filter state management hook
 */
import { useState, useCallback } from "react"

export function useFilters<T extends Record<string, any>>(initialFilters: T) {
  const [filters, setFilters] = useState<T>(initialFilters)

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const updateFilters = useCallback((updates: Partial<T>) => {
    setFilters(prev => ({ ...prev, ...updates }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const clearFilter = useCallback((key: string) => {
    setFilters(prev => ({ ...prev, [key]: (initialFilters as any)[key] }))
  }, [initialFilters])

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    clearFilter,
    setFilters
  }
}
