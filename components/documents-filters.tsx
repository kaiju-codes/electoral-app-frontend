"use client"

import { RefreshCw, Search, Filter, SortAsc, SortDesc, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface DocumentsFiltersProps {
  // Location filters
  selectedState: string
  selectedConstituency: string
  statesData?: { states: string[] }
  constituenciesData?: { constituencies: Array<{ number_english: string; name_english: string | null; name_local: string | null; display_name: string }> }
  statesLoading: boolean
  constituenciesLoading: boolean
  onStateChange: (value: string) => void
  onConstituencyChange: (value: string) => void
  
  // Search
  search: string
  onSearchChange: (value: string) => void
  
  // Filters
  partNumber: string
  onPartNumberChange: (value: string) => void
  
  // Sort
  sortBy: string
  sortOrder: string
  onSortByChange: (value: string) => void
  onSortOrderChange: (value: string) => void
  
  // Actions
  onApplyFilters: () => void
  onClearFilters: () => void
  onRefresh: () => void
  
  // State
  isLoading?: boolean
  totalResults?: number
}

export function DocumentsFilters({ 
  selectedState,
  selectedConstituency,
  statesData,
  constituenciesData,
  statesLoading,
  constituenciesLoading,
  onStateChange,
  onConstituencyChange,
  search,
  onSearchChange,
  partNumber,
  onPartNumberChange,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  onApplyFilters,
  onClearFilters,
  onRefresh,
  isLoading = false,
  totalResults = 0
}: DocumentsFiltersProps) {
  const activeFiltersCount = [
    selectedState,
    selectedConstituency,
    search,
    partNumber
  ].filter(Boolean).length

  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        <div className="space-y-4">
          {/* Location Selector Section */}
          <div className="flex items-center gap-3">
            <MapPin className="size-4 text-muted-foreground" />
            <div className="flex flex-1 items-center gap-3">
              <Select value={selectedState} onValueChange={onStateChange}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder={statesLoading ? "Loading states..." : "Select state"} />
                </SelectTrigger>
                <SelectContent>
                  {statesLoading ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  ) : statesData?.states && statesData.states.length > 0 ? (
                    statesData.states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
                      No states available
                    </div>
                  )}
                </SelectContent>
              </Select>
              <Select
                value={selectedConstituency}
                onValueChange={onConstituencyChange}
                disabled={!selectedState || constituenciesLoading}
              >
                <SelectTrigger className="w-[400px]">
                  <SelectValue 
                    placeholder={
                      !selectedState 
                        ? "Select state first" 
                        : constituenciesLoading 
                        ? "Loading constituencies..." 
                        : "Select assembly constituency"
                    } 
                  />
                </SelectTrigger>
                <SelectContent>
                  {constituenciesLoading ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  ) : constituenciesData?.constituencies && constituenciesData.constituencies.length > 0 ? (
                    constituenciesData.constituencies.map((constituency, index) => {
                      // Create unique value by combining number and name to handle duplicates
                      const uniqueValue = `${constituency.number_english}-${constituency.name_english || constituency.name_local || index}`
                      return (
                        <SelectItem key={`${constituency.number_english}-${index}`} value={uniqueValue}>
                          {constituency.display_name}
                        </SelectItem>
                      )
                    })
                  ) : (
                    <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
                      {selectedState ? "No constituencies available" : "Select state first"}
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator />

          {/* Search and Part Number Section - 8:4 ratio */}
          <div className="flex items-center gap-4">
            <div className="relative flex-[8]">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by document name..." 
                className="pl-9" 
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <div className="flex-[4]">
              <Input
                placeholder="Part number"
                value={partNumber}
                onChange={(e) => onPartNumberChange(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Sort and Actions Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Sort by:</label>
                <Select value={sortBy} onValueChange={onSortByChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Created At</SelectItem>
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
              
              <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
                <RefreshCw className="mr-2 size-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          {totalResults > 0 && (
            <div className="text-sm text-muted-foreground">
              Showing {totalResults.toLocaleString()} document{totalResults !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
