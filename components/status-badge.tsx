import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ExtractionRunStatus, SegmentStatus } from "@/lib/types"

type Status = ExtractionRunStatus | SegmentStatus | "COMPLETED" | "DONE"

interface StatusBadgeProps {
  status: Status
}

const statusConfig: Partial<Record<Status, { label: string; className: string }>> = {
  FAILED: {
    label: "Failed",
    className: "bg-status-failed/10 text-status-failed border-status-failed/20",
  },
  PENDING: {
    label: "Pending",
    className: "bg-status-pending/10 text-status-pending border-status-pending/20",
  },
  RUNNING: {
    label: "Running",
    className: "bg-status-processing/10 text-status-processing border-status-processing/20",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-status-processed/10 text-status-processed border-status-processed/20",
  },
  DONE: {
    label: "Done",
    className: "bg-status-processed/10 text-status-processed border-status-processed/20",
  },
  PARTIAL: {
    label: "Partial",
    className: "bg-status-partial/10 text-status-partial border-status-partial/20",
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  // Fallback for unknown status values
  if (!config) {
    console.warn(`Unknown status: ${status}`)
    return (
      <Badge variant="outline" className="gap-1.5">
        <span className="size-1.5 rounded-full bg-gray-400" />
        {status}
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={cn("gap-1.5", config.className)}>
      <span
        className={cn("size-1.5 rounded-full", {
          "bg-status-processing": status === "RUNNING",
          "bg-status-processed": status === "COMPLETED" || status === "DONE",
          "bg-status-failed": status === "FAILED",
          "bg-status-partial": status === "PARTIAL",
          "bg-status-pending": status === "PENDING",
        })}
      />
      {config.label}
    </Badge>
  )
}
