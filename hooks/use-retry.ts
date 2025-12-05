import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { SegmentRetryStatusResponse } from "@/lib/types"

export function useRetrySegment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (segmentId: number) => api.retry.retrySegment(segmentId),
    onSuccess: () => {
      // Invalidate extraction runs to refresh the data
      queryClient.invalidateQueries({ queryKey: ["extraction-runs"] })
      queryClient.invalidateQueries({ queryKey: ["documents"] })
    },
  })
}

export function useRetryFailedSegmentsForDocument() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (documentId: number) => api.retry.retryFailedSegmentsForDocument(documentId),
    onSuccess: () => {
      // Invalidate extraction runs to refresh the data
      queryClient.invalidateQueries({ queryKey: ["extraction-runs"] })
      queryClient.invalidateQueries({ queryKey: ["documents"] })
    },
  })
}

export function useSegmentRetryStatus(segmentId: number | null) {
  return useQuery<SegmentRetryStatusResponse>({
    queryKey: ["segment-retry-status", segmentId],
    queryFn: () => api.retry.getSegmentRetryStatus(segmentId!),
    enabled: !!segmentId,
    refetchInterval: 30000, // Refetch every 30 seconds to update time remaining
  })
}
