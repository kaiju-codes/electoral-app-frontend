// Custom hooks for documents API using React Query

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { DocumentsQueryParams } from "@/lib/types"

// Query keys
export const documentsKeys = {
  all: ["documents"] as const,
  lists: () => [...documentsKeys.all, "list"] as const,
  list: (params: DocumentsQueryParams) => [...documentsKeys.lists(), params] as const,
  details: () => [...documentsKeys.all, "detail"] as const,
  detail: (id: number) => [...documentsKeys.details(), id] as const,
}

// Hook to list documents
export function useDocuments(params: DocumentsQueryParams = {}) {
  return useQuery({
    queryKey: documentsKeys.list(params),
    queryFn: () => api.documents.list(params),
  })
}

// Hook to get a single document
export function useDocument(documentId: number) {
  return useQuery({
    queryKey: documentsKeys.detail(documentId),
    queryFn: () => api.documents.get(documentId),
    enabled: !!documentId,
  })
}

// Hook to upload a document
export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.documents.upload,
    onSuccess: (data) => {
      // Invalidate and refetch documents list
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() })
      // Also invalidate metrics to update dashboard stats
      queryClient.invalidateQueries({ queryKey: ["metrics"] })
    },
    onError: (error) => {
      console.error("Upload failed:", error)
    },
  })
}
