"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { RunsTable } from "@/components/runs-table"
import { RunsFilters } from "@/components/runs-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle2, XCircle, Clock, Menu } from "lucide-react"
import { useMetrics } from "@/hooks/use-metrics"
import type { ExtractionRunStatus } from "@/lib/types"

export default function RunsPage() {
  const searchParams = useSearchParams()
  const [statusFilter, setStatusFilter] = useState<ExtractionRunStatus | "ALL">("ALL")
  const [documentIdFilter, setDocumentIdFilter] = useState<string>("")
  const [refreshKey, setRefreshKey] = useState(0)

  const { data: metrics } = useMetrics()

  // Initialize filters from URL parameters
  useEffect(() => {
    const documentId = searchParams.get('document_id')
    const status = searchParams.get('status')
    
    if (documentId) {
      setDocumentIdFilter(documentId)
    }
    if (status && ['PENDING', 'RUNNING', 'COMPLETED', 'PARTIAL', 'FAILED'].includes(status)) {
      setStatusFilter(status as ExtractionRunStatus)
    }
  }, [searchParams])

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center ml-4">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <div className="size-6 rounded bg-primary" />
              <span className="hidden font-bold sm:inline-block">Electoral Data</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="/"
              >
                Voters
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="/documents"
              >
                Documents
              </Link>
            </nav>
          </div>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <Menu className="size-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </header>

      <main className="max-w-full py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Extraction Runs</h1>
          <p className="text-muted-foreground">
            Monitor all extraction runs and their segments
          </p>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
                <Activity className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.total_extraction_runs || 0}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="size-4 text-status-processed" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.completed_runs || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics?.total_extraction_runs 
                    ? Math.round((metrics.completed_runs / metrics.total_extraction_runs) * 100)
                    : 0}% success rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
                <XCircle className="size-4 text-status-failed" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.failed_runs || 0}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Partial</CardTitle>
                <Clock className="size-4 text-status-processing" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.partial_runs || 0}</div>
                <p className="text-xs text-muted-foreground">Partially completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <RunsFilters
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              documentIdFilter={documentIdFilter}
              onDocumentIdFilterChange={setDocumentIdFilter}
              onRefresh={handleRefresh}
            />
          </div>

          {/* Runs Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Extraction Runs</CardTitle>
              <CardDescription>View and manage extraction runs with their segments</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <RunsTable 
                statusFilter={statusFilter}
                documentIdFilter={documentIdFilter}
                key={refreshKey}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
