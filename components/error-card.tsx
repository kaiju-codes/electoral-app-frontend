"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, AlertCircle, RefreshCw, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ErrorCardProps {
  documentId: string
  filename: string
  segmentType: string
  pageRange: string
  errorMessage: string
  timestamp: string
  rawResponse?: object
}

export function ErrorCard({
  documentId,
  filename,
  segmentType,
  pageRange,
  errorMessage,
  timestamp,
  rawResponse,
}: ErrorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-start gap-4 p-4">
        {/* Error Icon */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-status-failed/10">
          <AlertCircle className="size-5 text-status-failed" />
        </div>

        {/* Error Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{filename}</h3>
              <p className="text-sm text-muted-foreground">Document ID: {documentId}</p>
            </div>
            <Badge variant="outline" className="bg-status-failed/10 text-status-failed border-status-failed/20">
              Failed
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Segment: {segmentType}</span>
            <span>•</span>
            <span>Pages: {pageRange}</span>
            <span>•</span>
            <span>{timestamp}</span>
          </div>

          <div className="rounded-md bg-muted p-3">
            <p className="text-sm font-medium text-foreground">{errorMessage}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <RefreshCw className="mr-2 size-3" />
              Retry Segment
            </Button>
            {rawResponse && (
              <Button size="sm" variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
                <Eye className="mr-2 size-3" />
                {isExpanded ? "Hide" : "View"} Raw Response
                {isExpanded ? <ChevronUp className="ml-2 size-3" /> : <ChevronDown className="ml-2 size-3" />}
              </Button>
            )}
          </div>

          {/* Expanded Content */}
          {isExpanded && rawResponse && (
            <div className="mt-4 rounded-md border border-border bg-muted p-4">
              <pre className="overflow-auto text-xs">
                <code>{JSON.stringify(rawResponse, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
