"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { LocationSelector } from "@/components/common/location-selector"
import { SimpleFilters } from "@/components/common/simple-filters"
import { VotersTable } from "@/components/voters-table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Download } from "lucide-react"
import { useFilters } from "@/hooks/use-filters"

const DEFAULT_FILTERS = {
  search: "",
  search_type: "all",
  part_number: "",
  polling_station: "",
  gender: "all",
  sort_by: "serial_number",
  sort_order: "asc",
  page_size: 50
}

const FILTER_FIELDS = [
  { key: 'search', label: 'Search', type: 'text' as const, placeholder: 'Search voters...', className: 'md:col-span-2' },
  { key: 'search_type', label: 'Search Type', type: 'select' as const, options: [
    { value: 'all', label: 'All Fields' },
    { value: 'name', label: 'Name' },
    { value: 'father_name', label: "Father's Name" },
    { value: 'epic', label: 'EPIC ID' },
    { value: 'house_no', label: 'House No' }
  ]},
  { key: 'part_number', label: 'Part Number', type: 'text' as const, placeholder: 'Enter part number' },
  { key: 'polling_station', label: 'Polling Station', type: 'text' as const, placeholder: 'Enter polling station' },
  { key: 'gender', label: 'Gender', type: 'select' as const, options: [
    { value: 'all', label: 'All' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ]},
  { key: 'page_size', label: 'Page Size', type: 'select' as const, options: [
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '200', label: '200' }
  ]}
]

const SORT_OPTIONS = [
  { value: 'serial_number', label: 'Serial Number' },
  { value: 'created_at', label: 'Created At' },
  { value: 'name', label: 'Name' },
  { value: 'father_name', label: "Father's Name" },
  { value: 'part_number', label: 'Part Number' }
]

export default function HomePage() {
  // Location state
  const [selectedState, setSelectedState] = useState("")
  const [selectedConstituency, setSelectedConstituency] = useState("")
  
  // Filter state using simplified hook
  const { filters, updateFilter, resetFilters } = useFilters(DEFAULT_FILTERS)
  
  // Show table only when location is selected
  const showTable = selectedState && selectedConstituency

  const handleSortChange = (field: string, order: string) => {
    updateFilter('sort_by', field)
    updateFilter('sort_order', order)
  }

  const handleExport = async () => {
    if (!selectedState || !selectedConstituency) return
    
    try {
      const { votersAPI } = await import("@/lib/api")
      const constituencyNumber = selectedConstituency.split('-')[0]
      
      await votersAPI.export({
        state: selectedState,
        assembly_constituency_number: constituencyNumber,
        ...filters
      })
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  return (
    <AppLayout 
      title="Electoral Roll Voters" 
      description="Explore and search voter records by state and assembly constituency"
    >
      <LocationSelector
        selectedState={selectedState}
        selectedConstituency={selectedConstituency}
        onStateChange={setSelectedState}
        onConstituencyChange={setSelectedConstituency}
        required={true}
        description="State and assembly constituency are required to view voter records."
      />

      {showTable ? (
        <>
          <SimpleFilters
            fields={FILTER_FIELDS}
            values={filters}
            onChange={updateFilter}
            onClear={resetFilters}
            sortBy={filters.sort_by}
            sortOrder={filters.sort_order}
            onSortChange={handleSortChange}
            sortOptions={SORT_OPTIONS}
          />

          <div className="mb-4 flex justify-end">
            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 size-4" />
              Export CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <VotersTable 
              state={selectedState} 
              constituency={selectedConstituency}
              filters={filters}
            />
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto mb-4 size-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Select Location</h3>
              <p className="text-sm text-muted-foreground">
                Please select a state and assembly constituency to view voter records
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  )
}
