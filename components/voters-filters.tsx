"use client"

import { Search, Filter, Download, Settings, SortAsc, SortDesc } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface VotersFiltersProps {
  // Search
  searchTerm: string
  searchType: string
  onSearchChange: (search: string) => void
  onSearchTypeChange: (type: string) => void
  
  // Filters
  partNumber: string
  pollingStation: string
  gender: string
  onPartNumberChange: (value: string) => void
  onPollingStationChange: (value: string) => void
  onGenderChange: (value: string) => void
  
  // Sort
  sortBy: string
  sortOrder: string
  onSortByChange: (value: string) => void
  onSortOrderChange: (value: string) => void
  
  // Page size
  pageSize: number
  onPageSizeChange: (value: number) => void
  
  // Actions
  onApplyFilters: () => void
  onExport: () => void
  onClearFilters: () => void
  
  // State
  isLoading?: boolean
  totalResults?: number
}

export function VotersFilters({ 
  searchTerm, 
  searchType,
  onSearchChange, 
  onSearchTypeChange,
  partNumber,
  pollingStation,
  gender,
  onPartNumberChange,
  onPollingStationChange,
  onGenderChange,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  pageSize,
  onPageSizeChange,
  onApplyFilters,
  onExport,
  onClearFilters,
  isLoading = false,
  totalResults = 0
}: VotersFiltersProps) {
  const activeFiltersCount = [
    partNumber,
    pollingStation,
    gender,
    searchTerm
  ].filter(Boolean).length

  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Enter search term..." 
                  className="pl-9" 
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
              <Select value={searchType || undefined} onValueChange={onSearchTypeChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Search by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="father_name">Father's Name</SelectItem>
                  <SelectItem value="epic">EPIC ID</SelectItem>
                  <SelectItem value="house_no">House No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Part Number</label>
              <Input
                placeholder="Enter part number"
                value={partNumber}
                onChange={(e) => onPartNumberChange(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Polling Station</label>
              <Input
                placeholder="Enter polling station"
                value={pollingStation}
                onChange={(e) => onPollingStationChange(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Gender</label>
              <Select value={gender || undefined} onValueChange={onGenderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Sort and Settings Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Sort by:</label>
                <Select value={sortBy || undefined} onValueChange={onSortByChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="serial_number">Serial Number</SelectItem>
                    <SelectItem value="created_at">Created At</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="father_name">Father's Name</SelectItem>
                    <SelectItem value="part_number">Part Number</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? <SortAsc className="size-4" /> : <SortDesc className="size-4" />}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Page size:</label>
                <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="mr-2">
                  <Filter className="size-3 mr-1" />
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}
                </Badge>
              )}
              
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                Clear
              </Button>
              
              <Button onClick={onApplyFilters} disabled={isLoading}>
                {isLoading ? "Loading..." : "Apply"}
              </Button>
              
              <Button variant="outline" onClick={onExport} disabled={isLoading}>
                <Download className="mr-2 size-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          {totalResults > 0 && (
            <div className="text-sm text-muted-foreground">
              Showing {totalResults.toLocaleString()} voter{totalResults !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
