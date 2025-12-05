"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Download, Eye, Loader2, RefreshCw } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { VoterDetailDrawer } from "@/components/voter-detail-drawer"
import { useVoters } from "@/hooks/use-voters"
import type { Voter } from "@/lib/types"

interface VotersTableProps {
  state: string
  constituency: string
  filters: {
    search: string
    search_type: string
    part_number: string
    polling_station: string
    gender: string
    sort_by: string
    sort_order: string
    page_size: number
  }
}

export function VotersTable({ state, constituency, filters }: VotersTableProps) {
  const [selectedVoters, setSelectedVoters] = useState<Set<number>>(new Set())
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Extract constituency number from the combined value (format: "number-name")
  const constituencyNumber = constituency ? constituency.split('-')[0] : ''
  
  // Prepare query parameters
  const queryParams = {
    state,
    assembly_constituency_number: constituencyNumber,
    page: currentPage,
    page_size: filters.page_size,
    ...(filters.search && { search: filters.search }),
    ...(filters.search_type && { search_type: filters.search_type }),
    ...(filters.part_number && { part_number: filters.part_number }),
    ...(filters.polling_station && { polling_station: filters.polling_station }),
    ...(filters.gender && { gender: filters.gender }),
    ...(filters.sort_by && { sort_by: filters.sort_by }),
    ...(filters.sort_order && { sort_order: filters.sort_order }),
  }

  const { data, isLoading, error, refetch } = useVoters(queryParams)

  const totalPages = data ? Math.ceil(data.total / filters.page_size) : 0

  const toggleVoter = (voterId: number) => {
    const newSelected = new Set(selectedVoters)
    if (newSelected.has(voterId)) {
      newSelected.delete(voterId)
    } else {
      newSelected.add(voterId)
    }
    setSelectedVoters(newSelected)
  }

  const toggleAll = () => {
    const voters = data?.items || []
    if (selectedVoters.size === voters.length) {
      setSelectedVoters(new Set())
    } else {
      setSelectedVoters(new Set(voters.map((v) => v.id)))
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">Loading voters...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-destructive">Failed to load voters</div>
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

  const voters = data?.items || []

  return (
    <>
      <div className="space-y-4">
        {/* Bulk Actions */}
        {selectedVoters.size > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2">
            <span className="text-sm font-medium">{selectedVoters.size} selected</span>
            <Button variant="outline" size="sm">
              <Download className="mr-2 size-3" />
              Export to CSV
            </Button>
            <Button variant="outline" size="sm">
              Mark for Review
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px]">
                    <Checkbox checked={voters.length > 0 && selectedVoters.size === voters.length} onCheckedChange={toggleAll} />
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      Serial
                      <ArrowUpDown className="size-3" />
                    </Button>
                  </TableHead>
                  <TableHead>House No.</TableHead>
                  <TableHead>Voter Name (Local)</TableHead>
                  <TableHead>Voter Name (English)</TableHead>
                  <TableHead>Relation Type</TableHead>
                  <TableHead>Relation Name (Local)</TableHead>
                  <TableHead>Relation Name (English)</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      Gender
                      <ArrowUpDown className="size-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      Age
                      <ArrowUpDown className="size-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Photo ID</TableHead>
                  <TableHead>Part Number</TableHead>
                  <TableHead>Section ID</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {voters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <p>No voters found.</p>
                        <p className="text-sm">Try adjusting your search or check if data exists for this location.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  voters.map((voter) => (
                    <TableRow
                      key={voter.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedVoter(voter)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedVoters.has(voter.id)}
                          onCheckedChange={() => toggleVoter(voter.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{voter.serial_number || "—"}</TableCell>
                      <TableCell className="font-mono text-sm">{voter.house_number || "—"}</TableCell>
                      <TableCell className="font-medium">{voter.voter_name_local || "—"}</TableCell>
                      <TableCell>{voter.voter_name_english || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{voter.relation_type || "—"}</TableCell>
                      <TableCell className="text-sm">{voter.relation_name_local || "—"}</TableCell>
                      <TableCell className="text-sm">{voter.relation_name_english || "—"}</TableCell>
                      <TableCell className="text-sm">{voter.gender || "—"}</TableCell>
                      <TableCell className="text-sm">{voter.age || "—"}</TableCell>
                      <TableCell className="font-mono text-sm">{voter.photo_id || "—"}</TableCell>
                      <TableCell className="text-sm">{voter.part_number || "—"}</TableCell>
                      <TableCell className="text-sm">{voter.document_section?.section_id || "—"}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedVoter(voter)}>
                              <Eye className="mr-2 size-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 size-4" />
                              Export Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{voters.length}</span> of{" "}
            <span className="font-medium">{data?.total || 0}</span> voters
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

      {/* Detail Drawer */}
      <VoterDetailDrawer
        voter={selectedVoter as any}
        onClose={() => setSelectedVoter(null)}
      />
    </>
  )
}
