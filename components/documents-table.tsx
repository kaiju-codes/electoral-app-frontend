"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, Download, Eye, RefreshCw, ArrowUpDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
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
import { StatusBadge } from "@/components/status-badge"
import { useDocuments } from "@/hooks/use-documents"

interface DocumentsTableProps {
  filters?: {
    search: string
    state: string
    assembly_constituency: string
    part_number: string
    sort_by: string
    sort_order: string
  }
  refreshKey?: number
}

export function DocumentsTable({ filters, refreshKey }: DocumentsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  // Prepare query parameters
  const queryParams = {
    page: currentPage,
    page_size: pageSize,
    ...(filters?.search && { search: filters.search }),
    ...(filters?.state && { state: filters.state }),
    ...(filters?.assembly_constituency && { assembly_constituency: filters.assembly_constituency }),
    ...(filters?.part_number && { part_number: filters.part_number }),
    ...(filters?.sort_by && { sort_by: filters.sort_by }),
    ...(filters?.sort_order && { sort_order: filters.sort_order }),
  }

  const { data, isLoading, error, refetch } = useDocuments(queryParams)

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">Loading documents...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-destructive">Failed to load documents</div>
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

  const documents = data?.items || []

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex-1 rounded-lg border border-border bg-card overflow-hidden">
        <div className="h-full overflow-auto">
          <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  ID
                  <ArrowUpDown className="size-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  Filename
                  <ArrowUpDown className="size-3" />
                </Button>
              </TableHead>
              <TableHead>Pages</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Assembly Constituency</TableHead>
              <TableHead>Part Number</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  Created At
                  <ArrowUpDown className="size-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Size (KB)</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <p>No documents found.</p>
                    <p className="text-sm">Try adjusting your filters or upload a new document.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-mono text-sm">{doc.id}</TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/documents/${doc.id}`} className="hover:text-primary hover:underline">
                      {doc.original_filename}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {doc.page_count || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {doc.header?.state || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {doc.header?.assembly_constituency_number_english 
                      ? `${doc.header.assembly_constituency_number_english} - ${doc.header.assembly_constituency_name_english || 'Unknown'}`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {doc.header?.part_number || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(doc.created_at)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {doc.page_size_kb?.toLocaleString() || "—"}
                  </TableCell>
                  <TableCell>
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
                        <DropdownMenuItem>
                          <Eye className="mr-2 size-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="mr-2 size-4" />
                          Reprocess
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 size-4" />
                          Download PDF
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
          Showing <span className="font-medium">{documents.length}</span> of{" "}
          <span className="font-medium">{data?.total || 0}</span> documents
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
                // Show pages around current page
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
