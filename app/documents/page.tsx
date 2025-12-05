"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { SimpleFilters } from "@/components/common/simple-filters"
import { DocumentsTable } from "@/components/documents-table"
import { UploadModal } from "@/components/upload-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, CheckCircle2, XCircle, Clock, FileText, Users } from "lucide-react"
import { useMetrics } from "@/hooks/use-metrics"
import { useStates, useConstituencies } from "@/hooks/use-location"
import { useFilters } from "@/hooks/use-filters"

const DEFAULT_FILTERS = {
  search: "",
  state: "",
  assembly_constituency: "",
  part_number: "",
  sort_by: "created_at",
  sort_order: "desc"
}

const FILTER_FIELDS = [
  { key: 'search', label: 'Search', type: 'text' as const, placeholder: 'Search documents...', className: 'md:col-span-2' },
  { key: 'part_number', label: 'Part Number', type: 'text' as const, placeholder: 'Enter part number' }
]

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Created At' }
]

export default function DocumentsPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  
  // Filter state using simplified hook
  const { filters, updateFilter, resetFilters } = useFilters(DEFAULT_FILTERS)
  
  // Location data
  const { data: statesData } = useStates()
  const { data: constituenciesData } = useConstituencies(filters.state)
  
  // Metrics
  const { data: metrics, isLoading: metricsLoading } = useMetrics()

  const handleStateChange = (state: string) => {
    updateFilter('state', state)
    updateFilter('assembly_constituency', '') // Reset constituency
  }

  const handleSortChange = (field: string, order: string) => {
    updateFilter('sort_by', field)
    updateFilter('sort_order', order)
  }

  const handleRefresh = () => setRefreshKey(prev => prev + 1)

  // Simplified metrics cards
  const metricsCards = [
    { title: "Documents", value: metrics?.total_documents || 0, icon: FileText, color: "blue" },
    { title: "Voters", value: metrics?.total_voters || 0, icon: Users, color: "purple" },
    { title: "Completed", value: metrics?.completed_runs || 0, icon: CheckCircle2, color: "green" },
    { title: "Failed", value: metrics?.failed_runs || 0, icon: XCircle, color: "red" },
  ]

  return (
    <AppLayout 
      title="Documents" 
      description="Manage uploaded PDFs and extraction status"
    >
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Metrics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricsCards.map((metric) => (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className={`size-4 text-${metric.color}-600`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metricsLoading ? "..." : metric.value.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Documents</h2>
          <Button onClick={() => setUploadModalOpen(true)}>
            <Plus className="mr-2 size-4" />
            Upload Document
          </Button>
        </div>

        {/* Filters with Location */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="space-y-4">
              {/* Location Filters */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">State (Optional)</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={filters.state} 
                    onChange={(e) => handleStateChange(e.target.value)}
                  >
                    <option value="">All States</option>
                    {statesData?.states?.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Assembly Constituency (Optional)</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={filters.assembly_constituency} 
                    onChange={(e) => updateFilter('assembly_constituency', e.target.value)}
                    disabled={!filters.state}
                  >
                    <option value="">All Constituencies</option>
                    {constituenciesData?.constituencies?.map((constituency, index) => (
                      <option 
                        key={`${constituency.number_english}-${index}`} 
                        value={constituency.number_english}
                      >
                        {constituency.display_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <SimpleFilters
          fields={FILTER_FIELDS}
          values={filters}
          onChange={updateFilter}
          onClear={resetFilters}
          onRefresh={handleRefresh}
          sortBy={filters.sort_by}
          sortOrder={filters.sort_order}
          onSortChange={handleSortChange}
          sortOptions={SORT_OPTIONS}
        />

        {/* Table */}
        <div className="flex-1 overflow-hidden">
          <DocumentsTable 
            filters={filters}
            refreshKey={refreshKey}
          />
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal 
        open={uploadModalOpen} 
        onOpenChange={setUploadModalOpen} 
      />
    </AppLayout>
  )
}
