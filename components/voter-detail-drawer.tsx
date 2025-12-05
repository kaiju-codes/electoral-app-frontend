"use client"
import { X, FileText, Loader2, MapPin, Building, Hash, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { JsonViewer } from "@/components/json-viewer"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Voter, DocumentDetail } from "@/lib/types"

interface VoterDetailDrawerProps {
  voter: Voter | null
  onClose: () => void
}

export function VoterDetailDrawer({ voter, onClose }: VoterDetailDrawerProps) {
  // Fetch document header information for this voter
  const { data: documentDetail, isLoading: documentLoading } = useQuery<DocumentDetail>({
    queryKey: ["document", voter?.document_id],
    queryFn: () => api.documents.get(voter!.document_id),
    enabled: !!voter?.document_id,
  })

  if (!voter) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-2xl border-l border-border bg-card shadow-lg animate-in slide-in-from-right">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-6">
            <div>
              <h2 className="text-xl font-semibold">Voter Details</h2>
              <p className="text-sm text-muted-foreground">Serial Number: {voter.serial_number || "—"}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="header">Part Details</TabsTrigger>
                <TabsTrigger value="json">Raw JSON</TabsTrigger>
                <TabsTrigger value="source">Source PDF</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                {/* Personal Information */}
                <div className="rounded-lg border border-border p-4">
                  <h3 className="mb-4 font-semibold">Personal Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
                      <p className="font-mono">{voter.serial_number || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">House Number</p>
                      <p className="font-mono">{voter.house_number || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Name (Local)</p>
                      <p className="font-medium">{voter.voter_name_local || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Name (English)</p>
                      <p className="font-medium">{voter.voter_name_english || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gender</p>
                      <Badge variant="outline">{voter.gender || "—"}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Age</p>
                      <p>{voter.age || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Photo ID</p>
                      <p className="font-mono">{voter.photo_id || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Relationship Information */}
                <div className="rounded-lg border border-border p-4">
                  <h3 className="mb-4 font-semibold">Relationship Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Relation Type</p>
                      <p>{voter.relation_type || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Relation Name (Local)</p>
                      <p className="font-medium">{voter.relation_name_local || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Relation Name (English)</p>
                      <p className="font-medium">{voter.relation_name_english || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="rounded-lg border border-border p-4">
                  <h3 className="mb-4 font-semibold">Location Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">State</p>
                      <p>{voter.state || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Assembly Constituency</p>
                      <p>{voter.assembly_constituency_number_english ? `${voter.assembly_constituency_number_english} - ${voter.assembly_constituency_name_english}` : "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Part Number</p>
                      <p className="font-mono">{voter.part_number || "—"}</p>
                    </div>
                    {voter.document_section && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Section ID</p>
                        <p className="font-mono">{voter.document_section.section_id}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Section Information */}
                {voter.document_section && (
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="mb-4 font-semibold">Document Section Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Section ID</p>
                        <p className="font-mono">{voter.document_section.section_id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Start Serial Number</p>
                        <p className="font-mono">{voter.document_section.start_serial_number || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Section Name (Local)</p>
                        <p className="font-medium">{voter.document_section.section_name_local || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Section Name (English)</p>
                        <p className="font-medium">{voter.document_section.section_name_english || "—"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="header" className="space-y-6">
                {documentLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-6 animate-spin mr-2" />
                    <span className="text-sm text-muted-foreground">Loading document header...</span>
                  </div>
                ) : documentDetail?.header ? (
                  <>
                    {/* Basic Information */}
                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-4 font-semibold flex items-center gap-2">
                        <FileText className="size-4" />
                        Basic Information
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">State</p>
                          <p className="font-medium">{documentDetail.header.state || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Part Number</p>
                          <p className="font-medium">{documentDetail.header.part_number || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Language</p>
                          <p className="font-medium">{documentDetail.header.language || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Document ID</p>
                          <p className="font-mono">{documentDetail.id}</p>
                        </div>
                      </div>
                    </div>

                    {/* Assembly Constituency */}
                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-4 font-semibold flex items-center gap-2">
                        <Building className="size-4" />
                        Assembly Constituency
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Number (English)</p>
                          <p className="font-medium">{documentDetail.header.assembly_constituency_number_english || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Number (Local)</p>
                          <p className="font-medium">{documentDetail.header.assembly_constituency_number_local || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Name (English)</p>
                          <p className="font-medium">{documentDetail.header.assembly_constituency_name_english || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Name (Local)</p>
                          <p className="font-medium">{documentDetail.header.assembly_constituency_name_local || "—"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Polling Station */}
                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-4 font-semibold flex items-center gap-2">
                        <MapPin className="size-4" />
                        Polling Station
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Number (English)</p>
                          <p className="font-medium">{documentDetail.header.polling_station_number_english || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Number (Local)</p>
                          <p className="font-medium">{documentDetail.header.polling_station_number_local || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Name (English)</p>
                          <p className="font-medium">{documentDetail.header.polling_station_name_english || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Name (Local)</p>
                          <p className="font-medium">{documentDetail.header.polling_station_name_local || "—"}</p>
                        </div>
                      </div>
                      
                      {(documentDetail.header.polling_station_building_and_address_english || 
                        documentDetail.header.polling_station_building_and_address_local) && (
                        <>
                          <Separator className="my-4" />
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium">Address</h4>
                            {documentDetail.header.polling_station_building_and_address_english && (
                              <div>
                                <p className="text-xs text-muted-foreground">English:</p>
                                <p className="text-sm">{documentDetail.header.polling_station_building_and_address_english}</p>
                              </div>
                            )}
                            {documentDetail.header.polling_station_building_and_address_local && (
                              <div>
                                <p className="text-xs text-muted-foreground">Local:</p>
                                <p className="text-sm">{documentDetail.header.polling_station_building_and_address_local}</p>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Document Statistics */}
                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-4 font-semibold flex items-center gap-2">
                        <Hash className="size-4" />
                        Document Statistics
                      </h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Voters</p>
                          <p className="text-2xl font-bold">{documentDetail.voter_count.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Pages</p>
                          <p className="text-2xl font-bold">{documentDetail.page_count || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">File Size</p>
                          <p className="text-2xl font-bold">{documentDetail.page_size_kb ? `${documentDetail.page_size_kb.toLocaleString()} KB` : "—"}</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="size-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Header Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Header information has not been extracted for this document yet.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="json">
                <JsonViewer data={voter} />
              </TabsContent>

              <TabsContent value="source">
                <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-muted">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileText className="size-12" />
                    <p className="text-sm">PDF snippet preview placeholder</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}
