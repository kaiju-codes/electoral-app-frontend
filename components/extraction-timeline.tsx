"use client"

import { CheckCircle2, Circle, XCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type StepStatus = "completed" | "in-progress" | "pending" | "failed"

interface TimelineStep {
  label: string
  status: StepStatus
  startTime?: string
  endTime?: string
  duration?: string
  retries?: number
}

const steps: TimelineStep[] = [
  {
    label: "Uploaded",
    status: "completed",
    startTime: "10:30:00",
    endTime: "10:30:05",
    duration: "5s",
    retries: 0,
  },
  {
    label: "Gemini File Upload",
    status: "completed",
    startTime: "10:30:05",
    endTime: "10:30:15",
    duration: "10s",
    retries: 0,
  },
  {
    label: "Header Extraction",
    status: "completed",
    startTime: "10:30:15",
    endTime: "10:31:20",
    duration: "1m 5s",
    retries: 1,
  },
  {
    label: "List Extraction",
    status: "completed",
    startTime: "10:31:20",
    endTime: "10:35:45",
    duration: "4m 25s",
    retries: 2,
  },
  {
    label: "Merged",
    status: "completed",
    startTime: "10:35:45",
    endTime: "10:35:50",
    duration: "5s",
    retries: 0,
  },
  {
    label: "Completed",
    status: "completed",
    startTime: "10:35:50",
    endTime: "10:35:50",
    duration: "0s",
    retries: 0,
  },
]

export function ExtractionTimeline() {
  return (
    <div className="relative">
      <div className="flex items-start justify-between gap-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-1 flex-col items-center">
            {/* Step Icon */}
            <div className="relative flex items-center justify-center">
              {step.status === "completed" && (
                <div className="flex size-10 items-center justify-center rounded-full bg-status-processed/10 ring-2 ring-status-processed">
                  <CheckCircle2 className="size-5 text-status-processed" />
                </div>
              )}
              {step.status === "in-progress" && (
                <div className="flex size-10 items-center justify-center rounded-full bg-status-processing/10 ring-2 ring-status-processing">
                  <Loader2 className="size-5 animate-spin text-status-processing" />
                </div>
              )}
              {step.status === "pending" && (
                <div className="flex size-10 items-center justify-center rounded-full bg-muted ring-2 ring-border">
                  <Circle className="size-5 text-muted-foreground" />
                </div>
              )}
              {step.status === "failed" && (
                <div className="flex size-10 items-center justify-center rounded-full bg-status-failed/10 ring-2 ring-status-failed">
                  <XCircle className="size-5 text-status-failed" />
                </div>
              )}

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-full top-1/2 h-0.5 w-full -translate-y-1/2",
                    step.status === "completed" ? "bg-status-processed" : "bg-border",
                  )}
                />
              )}
            </div>

            {/* Step Info */}
            <div className="mt-3 text-center">
              <p className="text-sm font-medium">{step.label}</p>
              {step.duration && <p className="mt-1 text-xs text-muted-foreground">{step.duration}</p>}
              {step.retries !== undefined && step.retries > 0 && (
                <p className="mt-0.5 text-xs text-status-uploaded">
                  {step.retries} {step.retries === 1 ? "retry" : "retries"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
