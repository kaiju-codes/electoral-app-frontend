"use client"

import { useState } from "react"
import Link from "next/link"
import { VotersFilters } from "@/components/voters-filters"
import { VotersTable } from "@/components/voters-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Loader2, Menu } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useStates, useConstituencies } from "@/hooks/use-location"

export default function VotersPage() {
  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedConstituency, setSelectedConstituency] = useState<string>("")
  
  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchType, setSearchType] = useState<string>("all")
  
  // Filter state
  const [partNumber, setPartNumber] = useState<string>("")
  const [pollingStation, setPollingStation] = useState<string>("")
  const [gender, setGender] = useState<string>("all")
  
  // Sort state
  const [sortBy, setSortBy] = useState<string>("serial_number")
  const [sortOrder, setSortOrder] = useState<string>("asc")
  
  // Pagination state
  const [pageSize, setPageSize] = useState<number>(50)
  
  // Applied filters (what's actually sent to API)
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    search_type: "",
    part_number: "",
    polling_station: "",
    gender: "",
    sort_by: "",
    sort_order: "asc",
    page_size: 50
  })
  
  // Fetch states and constituencies
  const { data: statesData, isLoading: statesLoading } = useStates()
  const { data: constituenciesData, isLoading: constituenciesLoading } = useConstituencies(selectedState)
  
  const showTable = selectedState && selectedConstituency

  const handleApplyFilters = () => {
    setAppliedFilters({
      search: searchTerm,
      search_type: searchType === "all" ? "" : searchType,
      part_number: partNumber,
      polling_station: pollingStation,
      gender: gender === "all" ? "" : gender,
      sort_by: sortBy === "serial_number" ? "" : sortBy,
      sort_order: sortOrder,
      page_size: pageSize
    })
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSearchType("all")
    setPartNumber("")
    setPollingStation("")
    setGender("all")
    setSortBy("serial_number")
    setSortOrder("asc")
    setPageSize(50)
    setAppliedFilters({
      search: "",
      search_type: "",
      part_number: "",
      polling_station: "",
      gender: "",
      sort_by: "",
      sort_order: "asc",
      page_size: 50
    })
  }

  const handleExport = async () => {
    if (!selectedState || !selectedConstituency) return
    
    try {
      const { votersAPI } = await import("@/lib/api")
      const constituencyNumber = selectedConstituency.split('-')[0]
      
      await votersAPI.export({
        state: selectedState,
        assembly_constituency_number: constituencyNumber,
        ...appliedFilters
      })
    } catch (error) {
      console.error("Export failed:", error)
      // You might want to show a toast notification here
    }
  }

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setSelectedConstituency("") // Reset constituency when state changes
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
                className="transition-colors hover:text-foreground/80 text-foreground"
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
          <h1 className="text-3xl font-bold tracking-tight">Electoral Roll Voters</h1>
          <p className="text-muted-foreground">
            Explore and search voter records by state and assembly constituency
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-muted-foreground" />
                <div className="flex flex-1 items-center gap-3">
                  <Select value={selectedState} onValueChange={handleStateChange}>
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
                    onValueChange={setSelectedConstituency}
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
              {!selectedState || !selectedConstituency ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  State and assembly constituency are required to view voter records.
                </p>
              ) : null}
            </CardContent>
          </Card>

          {showTable ? (
            <>
              {/* Enhanced Filters */}
              <VotersFilters 
                searchTerm={searchTerm}
                searchType={searchType}
                onSearchChange={setSearchTerm}
                onSearchTypeChange={setSearchType}
                partNumber={partNumber}
                pollingStation={pollingStation}
                gender={gender}
                onPartNumberChange={setPartNumber}
                onPollingStationChange={setPollingStation}
                onGenderChange={setGender}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortByChange={setSortBy}
                onSortOrderChange={setSortOrder}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                onApplyFilters={handleApplyFilters}
                onExport={handleExport}
                onClearFilters={handleClearFilters}
              />

              <div className="mt-6 overflow-x-auto">
                <VotersTable 
                  state={selectedState} 
                  constituency={selectedConstituency}
                  filters={appliedFilters}
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
        </div>
      </main>
    </div>
  )
}