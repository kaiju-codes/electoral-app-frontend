// TypeScript interfaces matching the FastAPI schemas

export type ExtractionRunStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "PARTIAL" | "SKIPPED"

export type SegmentType = "HEADER" | "LIST_CHUNK"

export type SegmentStatus = "PENDING" | "RUNNING" | "DONE" | "FAILED" | "SKIPPED"

export interface Document {
  id: number
  original_filename: string
  upload_file_uri: string | null
  mime_type: string | null
  page_count: number | null
  page_size_kb: number | null
  created_at: string
  updated_at: string
}

export interface DocumentHeaderSummary {
  state: string | null
  part_number: string | null
  language: string | null
  assembly_constituency_number_local: string | null
  assembly_constituency_number_english: string | null
  assembly_constituency_name_local: string | null
  assembly_constituency_name_english: string | null
  polling_station_number_local: string | null
  polling_station_number_english: string | null
  polling_station_name_local: string | null
  polling_station_name_english: string | null
  polling_station_building_and_address_local: string | null
  polling_station_building_and_address_english: string | null
}

export interface DocumentDetail extends Document {
  header: DocumentHeaderSummary | null
  voter_count: number
  // Latest extraction run information
  latest_run_status: string | null
  latest_run_error_message: string | null
}

export interface DocumentListResponse {
  items: DocumentDetail[]
  total: number
  page: number
  page_size: number
}

export interface DocumentSection {
  id: number
  document_id: number
  section_id: number
  section_name_local: string | null
  section_name_english: string | null
  start_serial_number: number | null
}

export interface Voter {
  id: number
  document_id: number
  serial_number: string | null
  house_number: string | null
  voter_name_local: string | null
  voter_name_english: string | null
  relation_type: string | null
  relation_name_local: string | null
  relation_name_english: string | null
  gender: string | null
  age: string | null
  photo_id: string | null
  state: string | null
  assembly_constituency_number_english: string | null
  assembly_constituency_name_english: string | null
  part_number: string | null
  document_section: DocumentSection | null
  created_at: string
  updated_at: string
}

export interface VoterListResponse {
  items: Voter[]
  total: number
  page: number
  page_size: number
}

export interface ExtractionSegment {
  id: number
  segment_type: SegmentType
  page_start: number
  page_end: number
  status: SegmentStatus
  created_at: string
  updated_at: string
}

export interface ExtractionRun {
  id: number
  document_id: number
  status: ExtractionRunStatus
  started_at: string | null
  finished_at: string | null
  error_message: string | null
  segments: ExtractionSegment[]
}

export interface ExtractionRunListResponse {
  items: ExtractionRun[]
  total: number
  page: number
  page_size: number
}

export interface MetricsSummary {
  total_documents: number
  total_extraction_runs: number
  completed_runs: number
  partial_runs: number
  failed_runs: number
  total_voters: number
  avg_voters_per_document: number
  total_segments: number
  failed_segments: number
  gemini_error_rate: number
  avg_extraction_time_seconds: number | null
  total_extraction_time_seconds: number | null
}

// Location Data
export interface Constituency {
  number_english: string
  number_local: string | null
  name_english: string | null
  name_local: string | null
  display_name: string
}

export interface StatesResponse {
  states: string[]
}

export interface ConstituenciesResponse {
  constituencies: Constituency[]
}

// API Query Parameters
export interface DocumentsQueryParams {
  // Filter parameters
  state?: string
  assembly_constituency?: string
  part_number?: string
  // Search parameters
  search?: string
  // Sort parameters
  sort_by?: string
  sort_order?: string
  // Pagination
  page?: number
  page_size?: number
}

export interface VotersQueryParams {
  state: string
  assembly_constituency_number: string
  // Search parameters
  search?: string
  search_type?: string
  // Filter parameters
  part_number?: string
  polling_station?: string
  gender?: string
  // Sort parameters
  sort_by?: string
  sort_order?: string
  // Pagination
  page?: number
  page_size?: number
}

export interface ExtractionRunsQueryParams {
  document_id?: number
  status?: ExtractionRunStatus
  page?: number
  page_size?: number
}

// Retry API Types
export interface SegmentRetryResponse {
  message: string
  segment_id: number
  document_id: number
  extraction_run_id: number
}

export interface NonRetryableSegment {
  segment_id: number
  reason: string
}

export interface BulkRetryResponse {
  message: string
  document_id: number
  failed_segments_count: number
  retryable_segments_count: number
  non_retryable_segments_count: number
  retryable_segment_ids?: number[]
  non_retryable_reasons?: NonRetryableSegment[]
}

export interface SegmentRetryStatusResponse {
  segment_id: number
  status: SegmentStatus
  can_retry: boolean
  reason: string
  last_updated: string
  hours_since_failure: number
  hours_remaining_for_retry: number
  retry_deadline: string
}

// Settings API Types
export type ApiKeyProvider = "GEMINI" | "GPT"

export interface ApiKeySettings {
  id: number
  provider_type: ApiKeyProvider
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export interface ApiKeySettingsResponse {
  id: number
  provider_type: ApiKeyProvider
  is_active: boolean
  created_at: string | null
  updated_at: string | null
  has_key: boolean
  masked_key: string | null
  key_generation_url: string | null
}

export interface ApiKeySettingsCreate {
  provider_type: ApiKeyProvider
  api_key: string
  is_active?: boolean
}

export interface ApiKeySettingsUpdate {
  api_key?: string
  is_active?: boolean
}
