"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, RefreshCw, Eye, AlertCircle, Loader2, ChevronLeft } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { JSONViewer } from "@/components/json-viewer"
import { RetryButton } from "@/components/retry-button"
import { useExtractionRuns } from "@/hooks/use-extraction-runs"
import type { ExtractionRunStatus } from "@/lib/types"

interface RunsTableProps {
  statusFilter?: ExtractionRunStatus | "ALL"
  documentIdFilter?: string
}

export function RunsTable({ statusFilter = "ALL", documentIdFilter }: RunsTableProps) {
  const [expandedRuns, setExpandedRuns] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const pageSize = 20

  // Prepare query parameters
  const queryParams = {
    page: currentPage,
    page_size: pageSize,
    ...(statusFilter && statusFilter !== "ALL" && { status: statusFilter }),
    ...(documentIdFilter && { document_id: parseInt(documentIdFilter) }),
  }

  const { data, isLoading, error, refetch } = useExtractionRuns(queryParams)

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0

  const runs = data?.items || []

  // Check if any runs are in non-terminal states (PENDING or RUNNING)
  const hasNonTerminalRuns = runs.some(
    (run) => run.status === "PENDING" || run.status === "RUNNING"
  )

  // Auto-refresh every 10 seconds if there are non-terminal runs
  useEffect(() => {
    if (!hasNonTerminalRuns) return

    const interval = setInterval(() => {
      refetch().then(() => {
        setLastRefreshed(new Date())
      })
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [hasNonTerminalRuns, refetch])

  // Format "X seconds ago" from timestamp
  const formatTimeAgo = (timestamp: Date | null): string => {
    if (!timestamp) return ""
    const now = new Date()
    const diffSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000)
    
    if (diffSeconds < 1) return "just now"
    if (diffSeconds === 1) return "1 second ago"
    return `${diffSeconds} seconds ago`
  }

  const toggleRun = (runId: number) => {
    const newExpanded = new Set(expandedRuns)
    if (newExpanded.has(runId)) {
      newExpanded.delete(runId)
    } else {
      newExpanded.add(runId)
    }
    setExpandedRuns(newExpanded)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (startedAt: string | null, finishedAt: string | null) => {
    if (!startedAt) return "—"
    if (!finishedAt) return "Running..."
    
    const start = new Date(startedAt)
    const end = new Date(finishedAt)
    const durationMs = end.getTime() - start.getTime()
    const durationSec = Math.round(durationMs / 1000)
    
    if (durationSec < 60) return `${durationSec}s`
    const minutes = Math.floor(durationSec / 60)
    const seconds = durationSec % 60
    return `${minutes}m ${seconds}s`
  }

  const getSegmentStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: "PENDING",
      RUNNING: "RUNNING", 
      DONE: "COMPLETED",
      FAILED: "FAILED",
      SKIPPED: "SKIPPED",
    }
    return <StatusBadge status={statusMap[status as keyof typeof statusMap] as any} />
  }

  // Update lastRefreshed when data changes (initial load or manual refresh)
  // Only update if there are non-terminal runs
  useEffect(() => {
    if (data && !isLoading && hasNonTerminalRuns) {
      setLastRefreshed(new Date())
    } else if (data && !isLoading && !hasNonTerminalRuns) {
      // Clear lastRefreshed when all runs are terminal
      setLastRefreshed(null)
    }
  }, [data, isLoading, hasNonTerminalRuns])

  // Force re-render every second to update "seconds ago" display
  // Only run when there are non-terminal runs
  const [, setTick] = useState(0)
  useEffect(() => {
    if (!lastRefreshed || !hasNonTerminalRuns) return

    const interval = setInterval(() => {
      setTick((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [lastRefreshed, hasNonTerminalRuns])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">Loading extraction runs...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-destructive">Failed to load extraction runs</div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="mr-2 size-3" />
            Retry
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[80px]">Run ID</TableHead>
              <TableHead>Document ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started At</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Segments</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <p>No extraction runs found.</p>
                    <p className="text-sm">Try adjusting your filters or upload a document to start extraction.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              runs.flatMap((run) => {
                const mainRow = (
                  <TableRow 
                    key={run.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleRun(run.id)}
                  >
                    <TableCell>
                      {expandedRuns.has(run.id) ? (
                        <ChevronDown className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{run.id}</TableCell>
                    <TableCell className="font-mono text-sm">{run.document_id}</TableCell>
                    <TableCell>
                      <StatusBadge status={run.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(run.started_at)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDuration(run.started_at, run.finished_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {run.segments.length} segments
                        </Badge>
                        {run.segments.some(s => s.status === "FAILED") && (
                          <AlertCircle className="size-4 text-destructive" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8" onClick={(e) => e.stopPropagation()}>
                            <Eye className="size-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Extraction Run #{run.id}</DialogTitle>
                            <DialogDescription>
                              Document ID: {run.document_id} • Status: {run.status}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {run.error_message && (
                              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="size-4 text-destructive" />
                                  <span className="text-sm font-medium text-destructive">Error</span>
                                </div>
                                <p className="mt-2 text-sm">{run.error_message}</p>
                              </div>
                            )}
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Segments</h4>
                              {run.segments.map((segment) => (
                                <div key={segment.id} className="rounded-lg border p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">
                                        {segment.segment_type} • Pages {segment.page_start}-{segment.page_end}
                                      </Badge>
                                      {getSegmentStatusBadge(segment.status)}
                                    </div>
                                    {segment.status === "FAILED" && (
                                      <RetryButton segmentId={segment.id} size="sm" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                )

                const expandedRow = expandedRuns.has(run.id) ? (
                  <TableRow key={`${run.id}-expanded`}>
                    <TableCell colSpan={8} className="bg-muted/30 p-0">
                      <div className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Segments Details</h4>
                            {lastRefreshed && hasNonTerminalRuns && (
                              <span className="text-xs text-muted-foreground">
                                Last refreshed: {formatTimeAgo(lastRefreshed)}
                              </span>
                            )}
                          </div>
                          <div className="grid gap-3">
                            {run.segments.map((segment) => (
                              <div key={segment.id} className="rounded-lg border bg-background p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <Badge variant="outline">
                                      {segment.segment_type.replace("_", " ")}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      Pages {segment.page_start}-{segment.page_end}
                                    </span>
                                    {getSegmentStatusBadge(segment.status)}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {segment.status === "FAILED" && (
                                      <RetryButton segmentId={segment.id} size="sm" />
                                    )}
                                    <div className="text-xs text-muted-foreground">
                                      ID: {segment.id}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null

                return [mainRow, expandedRow].filter(Boolean)
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{runs.length}</span> of{" "}
          <span className="font-medium">{data?.total || 0}</span> extraction runs
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {totalPages > 0 && Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page = i + 1
              if (totalPages > 5) {
                const start = Math.max(1, currentPage - 2)
                const end = Math.min(totalPages, start + 4)
                page = start + i
                if (page > end) return null
              }
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className="size-8"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}