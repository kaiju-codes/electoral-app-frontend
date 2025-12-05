"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface JsonViewerProps {
  data: object
}

export function JSONViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <Button variant="outline" size="sm" className="absolute right-2 top-2 bg-transparent" onClick={handleCopy}>
        {copied ? (
          <>
            <Check className="mr-2 size-3" />
            Copied
          </>
        ) : (
          <>
            <Copy className="mr-2 size-3" />
            Copy
          </>
        )}
      </Button>
      <pre className="overflow-auto rounded-lg bg-muted p-4 text-xs">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  )
}

export { JSONViewer as JsonViewer }
