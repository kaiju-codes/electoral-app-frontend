"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import { BulkRetryButton } from "@/components/retry-button"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  FileText, 
  Users, 
  Calendar, 
  MapPin, 
  Building, 
  Hash,
  Globe,
  Loader2,
  AlertCircle,
  Activity,
  Menu
} from "lucide-react"
import { useDocument } from "@/hooks/use-documents"
import { useExtractionRuns } from "@/hooks/use-extraction-runs"

export default function DocumentDetailPage() {
  const params = useParams()
  const documentId = parseInt(params.id as string)

  const { data: document, isLoading, error } = useDocument(documentId)
  const { data: runsData } = useExtractionRuns({ document_id: documentId, page_size: 10 })

  if (isLoading) {
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
                  className="transition-colors hover:text-foreground/80 text-foreground"
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
            <h1 className="text-3xl font-bold tracking-tight">Document Details</h1>
            <p className="text-muted-foreground">Loading document information...</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin" />
          </div>
        </main>
      </div>
    )
  }

  if (error || !document) {
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
                  className="transition-colors hover:text-foreground/80 text-foreground"
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
            <h1 className="text-3xl font-bold tracking-tight">Document Details</h1>
            <p className="text-muted-foreground">Document not found</p>
          </div>
          <div>
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="size-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">Document not found</p>
                    <p className="text-sm text-muted-foreground">
                      The document you're looking for doesn't exist or has been removed.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button asChild variant="outline">
                    <Link href="/documents">
                      <ArrowLeft className="mr-2 size-4" />
                      Back to Documents
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const runs = runsData?.items || []

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center ml-4">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <div className="size-6 rounded bg-primary" />
              <span className="hidden font-bold sm:inline-block">
                Electoral Data
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="/"
              >
                Voters
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground"
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
          <h1 className="text-3xl font-bold tracking-tight">
            Document Details
          </h1>
          <p className="text-muted-foreground">
            Details for {document.original_filename}
          </p>
        </div>

        <div>
          {/* Back Button */}
          <div className="mb-6">
            <Button asChild variant="outline">
              <Link href="/documents">
                <ArrowLeft className="mr-2 size-4" />
                Back to Documents
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Document Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="size-5" />
                    Document Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Filename
                      </label>
                      <p className="font-medium">
                        {document.original_filename}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Status
                      </label>
                      <div className="mt-1">
                        {document.latest_run_status ? (
                          <StatusBadge
                            status={document.latest_run_status as any}
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No extraction runs
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Document ID
                      </label>
                      <p className="font-mono">{document.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Pages
                      </label>
                      <p>{document.page_count || "—"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        File Size
                      </label>
                      <p>
                        {document.page_size_kb
                          ? `${document.page_size_kb.toLocaleString()} KB`
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        MIME Type
                      </label>
                      <p className="font-mono text-sm">
                        {document.mime_type || "—"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Created At
                      </label>
                      <p className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        {formatDate(document.created_at)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Updated At
                      </label>
                      <p className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        {formatDate(document.updated_at)}
                      </p>
                    </div>
                  </div>

                  {document.latest_run_error_message && (
                    <>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-destructive">
                          Error Message
                        </label>
                        <p className="text-sm text-destructive mt-1">
                          {document.latest_run_error_message}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Header Information */}
              {document.header && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="size-5" />
                      Electoral Roll Header Information
                    </CardTitle>
                    <CardDescription>
                      Extracted information from the document header
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {document.header.state && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            State
                          </label>
                          <p className="font-medium">{document.header.state}</p>
                        </div>
                      )}
                      {document.header.language && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Language
                          </label>
                          <p className="flex items-center gap-2">
                            <Globe className="size-4" />
                            {document.header.language}
                          </p>
                        </div>
                      )}
                      {document.header.part_number && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Part Number
                          </label>
                          <p className="flex items-center gap-2">
                            <Hash className="size-4" />
                            {document.header.part_number}
                          </p>
                        </div>
                      )}
                    </div>

                    {(document.header.assembly_constituency_number_english ||
                      document.header.assembly_constituency_name_english) && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-3">
                            Assembly Constituency
                          </h4>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {document.header
                              .assembly_constituency_number_english && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Number (English)
                                </label>
                                <p>
                                  {
                                    document.header
                                      .assembly_constituency_number_english
                                  }
                                </p>
                              </div>
                            )}
                            {document.header
                              .assembly_constituency_number_local && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Number (Local)
                                </label>
                                <p>
                                  {
                                    document.header
                                      .assembly_constituency_number_local
                                  }
                                </p>
                              </div>
                            )}
                            {document.header
                              .assembly_constituency_name_english && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Name (English)
                                </label>
                                <p>
                                  {
                                    document.header
                                      .assembly_constituency_name_english
                                  }
                                </p>
                              </div>
                            )}
                            {document.header
                              .assembly_constituency_name_local && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Name (Local)
                                </label>
                                <p>
                                  {
                                    document.header
                                      .assembly_constituency_name_local
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {(document.header.polling_station_number_english ||
                      document.header.polling_station_name_english ||
                      document.header
                        .polling_station_building_and_address_english) && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Building className="size-4" />
                            Polling Station
                          </h4>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {document.header.polling_station_number_english && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Number (English)
                                </label>
                                <p>
                                  {
                                    document.header
                                      .polling_station_number_english
                                  }
                                </p>
                              </div>
                            )}
                            {document.header.polling_station_number_local && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Number (Local)
                                </label>
                                <p>
                                  {document.header.polling_station_number_local}
                                </p>
                              </div>
                            )}
                            {document.header.polling_station_name_english && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Name (English)
                                </label>
                                <p>
                                  {document.header.polling_station_name_english}
                                </p>
                              </div>
                            )}
                            {document.header.polling_station_name_local && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                  Name (Local)
                                </label>
                                <p>
                                  {document.header.polling_station_name_local}
                                </p>
                              </div>
                            )}
                          </div>
                          {(document.header
                            .polling_station_building_and_address_english ||
                            document.header
                              .polling_station_building_and_address_local) && (
                            <div className="mt-4">
                              <label className="text-sm font-medium text-muted-foreground">
                                Address
                              </label>
                              <div className="mt-1 space-y-1">
                                {document.header
                                  .polling_station_building_and_address_english && (
                                  <p className="text-sm">
                                    {
                                      document.header
                                        .polling_station_building_and_address_english
                                    }
                                  </p>
                                )}
                                {document.header
                                  .polling_station_building_and_address_local && (
                                  <p className="text-sm text-muted-foreground">
                                    {
                                      document.header
                                        .polling_station_building_and_address_local
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href={`/runs?document_id=${document.id}`}>
                      <Activity className="mr-2 size-4" />
                      View Runs
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link
                      href={`/voters?state=${
                        document.header?.state || ""
                      }&assembly_constituency_number=${
                        document.header?.assembly_constituency_number_english ||
                        ""
                      }`}
                    >
                      <Users className="mr-2 size-4" />
                      View Voters
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="size-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {document.voter_count.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Voters
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Extraction Runs
                      </span>
                      <span className="font-medium">{runs.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pages</span>
                      <span className="font-medium">
                        {document.page_count || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">File Size</span>
                      <span className="font-medium">
                        {document.page_size_kb
                          ? `${document.page_size_kb} KB`
                          : "—"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Extraction Runs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="size-5" />
                    Extraction Runs
                  </CardTitle>
                  <CardDescription>
                    Recent extraction attempts for this document
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {runs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No extraction runs found
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {runs.slice(0, 5).map((run) => (
                        <div
                          key={run.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">
                                #{run.id}
                              </span>
                              <StatusBadge status={run.status} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {run.started_at
                                ? formatDate(run.started_at)
                                : "Not started"}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {run.segments.length} segments
                          </Badge>
                        </div>
                      ))}
                      {runs.length > 5 && (
                        <div className="text-center">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/runs?document_id=${document.id}`}>
                              View All Runs
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}