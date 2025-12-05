"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { ExtractionRunStatus } from "@/lib/types"

interface RunsFiltersProps {
  statusFilter: ExtractionRunStatus | "ALL"
  onStatusFilterChange: (status: ExtractionRunStatus | "ALL") => void
  documentIdFilter: string
  onDocumentIdFilterChange: (documentId: string) => void
  onRefresh: () => void
}

export function RunsFilters({ 
  statusFilter, 
  onStatusFilterChange, 
  documentIdFilter,
  onDocumentIdFilterChange,
  onRefresh 
}: RunsFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="RUNNING">Running</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="PARTIAL">Partial</SelectItem>
          <SelectItem value="FAILED">Failed</SelectItem>
        </SelectContent>
      </Select>

      <Input 
        placeholder="Filter by document ID" 
        className="w-[200px]"
        value={documentIdFilter}
        onChange={(e) => onDocumentIdFilterChange(e.target.value)}
      />

      <Button variant="outline" onClick={onRefresh}>
        <RefreshCw className="mr-2 size-4" />
        Refresh
      </Button>
    </div>
  )
}
