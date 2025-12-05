// FastAPI client for the electoral data extraction backend

import type {
  Document,
  DocumentDetail,
  DocumentListResponse,
  DocumentsQueryParams,
  ExtractionRun,
  ExtractionRunListResponse,
  ExtractionRunsQueryParams,
  MetricsSummary,
  Voter,
  VoterListResponse,
  VotersQueryParams,
  StatesResponse,
  ConstituenciesResponse,
  SegmentRetryResponse,
  BulkRetryResponse,
  SegmentRetryStatusResponse,
  ApiKeyProvider,
  ApiKeySettings,
  ApiKeySettingsResponse,
  ApiKeySettingsCreate,
  ApiKeySettingsUpdate,
} from "./types"

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response,
  ) {
    super(message)
    this.name = "APIError"
  }
}

// Generic API request function with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      
      try {
        const errorData = await response.json()
        if (errorData.detail) {
          errorMessage = errorData.detail
        }
      } catch {
        // If we can't parse the error response, use the default message
      }

      throw new APIError(errorMessage, response.status, response)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    
    // Network or other errors
    throw new APIError(
      error instanceof Error ? error.message : "Network error occurred",
      0,
    )
  }
}

// Helper function to build query string
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value))
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ""
}

// Documents API
export const documentsAPI = {
  list: async (params: DocumentsQueryParams = {}): Promise<DocumentListResponse> => {
    const queryString = buildQueryString(params)
    return apiRequest<DocumentListResponse>(`/documents${queryString}`)
  },

  get: async (documentId: number): Promise<DocumentDetail> => {
    return apiRequest<DocumentDetail>(`/documents/${documentId}`)
  },

  upload: async (file: File): Promise<Document> => {
    const formData = new FormData()
    formData.append("file", file)

    return apiRequest<Document>("/documents/upload", {
      method: "POST",
      headers: {}, // Remove Content-Type to let browser set it with boundary
      body: formData,
    })
  },
}

// Voters API
export const votersAPI = {
  list: async (params: VotersQueryParams): Promise<VoterListResponse> => {
    const queryString = buildQueryString(params)
    return apiRequest<VoterListResponse>(`/voters${queryString}`)
  },

  export: async (params: VotersQueryParams): Promise<void> => {
    const queryString = buildQueryString(params)
    const response = await fetch(`${API_BASE_URL}/voters/export${queryString}`)
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`)
    }
    
    // Get filename from Content-Disposition header or use default
    const contentDisposition = response.headers.get('Content-Disposition')
    let filename = 'voters_export.csv'
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename=(.+)/)
      if (filenameMatch) {
        filename = filenameMatch[1].replace(/"/g, '')
      }
    }
    
    // Create blob and download
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  },
}

// Extraction Runs API
export const extractionRunsAPI = {
  list: async (params: ExtractionRunsQueryParams = {}): Promise<ExtractionRunListResponse> => {
    const queryString = buildQueryString(params)
    return apiRequest<ExtractionRunListResponse>(`/extraction-runs${queryString}`)
  },

  get: async (runId: number): Promise<ExtractionRun> => {
    return apiRequest<ExtractionRun>(`/extraction-runs/${runId}`)
  },
}

// Metrics API
export const metricsAPI = {
  get: async (): Promise<MetricsSummary> => {
    return apiRequest<MetricsSummary>("/metrics")
  },
}

// Location APIs
export const locationAPI = {
  getStates: async (): Promise<StatesResponse> => {
    return apiRequest<StatesResponse>("/states")
  },

  getConstituencies: async (state: string): Promise<ConstituenciesResponse> => {
    const queryString = buildQueryString({ state })
    return apiRequest<ConstituenciesResponse>(`/constituencies${queryString}`)
  },
}

// Retry APIs
export const retryAPI = {
  retrySegment: async (segmentId: number): Promise<SegmentRetryResponse> => {
    return apiRequest<SegmentRetryResponse>(`/segments/${segmentId}/retry`, {
      method: "POST",
    })
  },

  retryFailedSegmentsForDocument: async (documentId: number): Promise<BulkRetryResponse> => {
    return apiRequest<BulkRetryResponse>(`/documents/${documentId}/retry-failed-segments`, {
      method: "POST",
    })
  },

  getSegmentRetryStatus: async (segmentId: number): Promise<SegmentRetryStatusResponse> => {
    return apiRequest<SegmentRetryStatusResponse>(`/segments/${segmentId}/retry-status`)
  },
}

// Health check
export const healthAPI = {
  check: async (): Promise<{ status: string }> => {
    return apiRequest<{ status: string }>("/health")
  },
}

// Settings API
export const settingsAPI = {
  getApiKeys: async (): Promise<ApiKeySettingsResponse[]> => {
    return apiRequest<ApiKeySettingsResponse[]>("/settings/api-keys")
  },

  getApiKey: async (provider: ApiKeyProvider): Promise<ApiKeySettingsResponse> => {
    return apiRequest<ApiKeySettingsResponse>(`/settings/api-keys/${provider}`)
  },

  createOrUpdateApiKey: async (
    data: ApiKeySettingsCreate,
  ): Promise<ApiKeySettings> => {
    return apiRequest<ApiKeySettings>("/settings/api-keys", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateApiKey: async (
    provider: ApiKeyProvider,
    data: ApiKeySettingsUpdate,
  ): Promise<ApiKeySettings> => {
    return apiRequest<ApiKeySettings>(`/settings/api-keys/${provider}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  activateProvider: async (provider: ApiKeyProvider): Promise<ApiKeySettings> => {
    return apiRequest<ApiKeySettings>(`/settings/api-keys/${provider}/activate`, {
      method: "PUT",
    })
  },

  deleteApiKey: async (provider: ApiKeyProvider): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/settings/api-keys/${provider}`, {
      method: "DELETE",
    })
  },
}

// Export all APIs as a single object
export const api = {
  documents: documentsAPI,
  voters: votersAPI,
  extractionRuns: extractionRunsAPI,
  metrics: metricsAPI,
  location: locationAPI,
  retry: retryAPI,
  health: healthAPI,
  settings: settingsAPI,
}

export default api
