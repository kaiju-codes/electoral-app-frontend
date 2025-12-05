import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RefreshCw, Clock, AlertCircle } from "lucide-react"
import { useRetrySegment, useRetryFailedSegmentsForDocument, useSegmentRetryStatus } from "@/hooks/use-retry"
import { cn } from "@/lib/utils"

interface RetryButtonProps {
  segmentId: number
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function RetryButton({ 
  segmentId, 
  className, 
  size = "sm", 
  variant = "outline" 
}: RetryButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const retryMutation = useRetrySegment()
  const { data: retryStatus, isLoading: statusLoading } = useSegmentRetryStatus(segmentId)

  const handleRetry = async () => {
    try {
      await retryMutation.mutateAsync(segmentId)
    } catch (error) {
      console.error("Retry failed:", error)
    }
  }

  if (statusLoading) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        disabled 
        className={cn("gap-1.5", className)}
      >
        <RefreshCw className="size-3 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (!retryStatus) {
    return null
  }

  const { can_retry, reason, hours_remaining_for_retry } = retryStatus
  const isRetrying = retryMutation.isPending

  if (!can_retry) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex">
              <Button 
                variant="ghost" 
                size={size} 
                disabled 
                className={cn("gap-1.5 cursor-not-allowed", className)}
              >
                <AlertCircle className="size-3" />
                Cannot Retry
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{reason}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
          <TooltipTrigger asChild>
            <Button 
              variant={variant} 
              size={size} 
              onClick={handleRetry}
              disabled={isRetrying}
              className={cn("gap-1.5", className)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <RefreshCw className={cn("size-3", isRetrying && "animate-spin")} />
              {isRetrying ? "Retrying..." : "Retry"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Retry this failed segment</p>
            <p className="text-xs text-muted-foreground">
              Time remaining: {hours_remaining_for_retry.toFixed(1)}h
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {hours_remaining_for_retry < 12 && (
        <Badge variant="outline" className="gap-1 text-xs">
          <Clock className="size-3" />
          {hours_remaining_for_retry.toFixed(1)}h left
        </Badge>
      )}
    </div>
  )
}

interface BulkRetryButtonProps {
  documentId: number
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function BulkRetryButton({ 
  documentId, 
  className, 
  size = "default", 
  variant = "default" 
}: BulkRetryButtonProps) {
  const retryMutation = useRetryFailedSegmentsForDocument()

  const handleBulkRetry = async () => {
    try {
      await retryMutation.mutateAsync(documentId)
    } catch (error) {
      console.error("Bulk retry failed:", error)
    }
  }

  const isRetrying = retryMutation.isPending

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={variant} 
            size={size} 
            onClick={handleBulkRetry}
            disabled={isRetrying}
            className={cn("gap-1.5", className)}
          >
            <RefreshCw className={cn("size-4", isRetrying && "animate-spin")} />
            {isRetrying ? "Retrying All..." : "Retry All Failed"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Retry all failed segments for this document</p>
          <p className="text-xs text-muted-foreground">
            Only segments failed within 48 hours will be retried
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
