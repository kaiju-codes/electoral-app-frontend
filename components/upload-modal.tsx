"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Loader2
} from "lucide-react"
import { useUploadDocument } from "@/hooks/use-documents"

interface UploadedFile {
  file: File
  id: string
  status: "uploading" | "success" | "error"
  progress: number
  documentId?: number
  error?: string
}

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const uploadMutation = useUploadDocument()

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 5,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach((rejection) => {
          const errors = rejection.errors.map(e => e.message).join(', ')
          console.error(`File ${rejection.file.name} rejected: ${errors}`)
        })
      }

      // Handle accepted files
      acceptedFiles.forEach((file) => {
        const fileId = Math.random().toString(36).substring(7)
        const uploadFile: UploadedFile = {
          file,
          id: fileId,
          status: "uploading",
          progress: 0,
        }

        setUploadedFiles(prev => [...prev, uploadFile])

        // Start upload
        uploadMutation.mutate(file, {
          onSuccess: (data) => {
            setUploadedFiles(prev => 
              prev.map(f => 
                f.id === fileId 
                  ? { ...f, status: "success", progress: 100, documentId: data.id }
                  : f
              )
            )
          },
          onError: (error) => {
            setUploadedFiles(prev => 
              prev.map(f => 
                f.id === fileId 
                  ? { 
                      ...f, 
                      status: "error", 
                      progress: 0, 
                      error: error instanceof Error ? error.message : "Upload failed" 
                    }
                  : f
              )
            )
          },
        })

        // Simulate progress (since we don't have real progress from the API)
        const progressInterval = setInterval(() => {
          setUploadedFiles(prev => 
            prev.map(f => {
              if (f.id === fileId && f.status === "uploading" && f.progress < 90) {
                return { ...f, progress: Math.min(f.progress + Math.random() * 20, 90) }
              }
              return f
            })
          )
        }, 500)

        // Clear interval when upload completes
        setTimeout(() => clearInterval(progressInterval), 10000)
      })
    }
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const clearAll = () => {
    setUploadedFiles([])
  }

  const handleClose = () => {
    setUploadedFiles([])
    onOpenChange(false)
  }

  const successfulUploads = uploadedFiles.filter(f => f.status === "success")
  const failedUploads = uploadedFiles.filter(f => f.status === "error")
  const uploadingFiles = uploadedFiles.filter(f => f.status === "uploading")

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Upload PDF files for electoral roll extraction. Maximum 5 files, 50MB each.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragActive && !isDragReject 
                ? "border-primary bg-primary/5" 
                : isDragReject 
                ? "border-destructive bg-destructive/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <div className={`
                rounded-full p-3 
                ${isDragActive && !isDragReject 
                  ? "bg-primary/10" 
                  : isDragReject 
                  ? "bg-destructive/10"
                  : "bg-muted"
                }
              `}>
                <Upload className={`
                  size-6 
                  ${isDragActive && !isDragReject 
                    ? "text-primary" 
                    : isDragReject 
                    ? "text-destructive"
                    : "text-muted-foreground"
                  }
                `} />
              </div>
              
              {isDragActive ? (
                isDragReject ? (
                  <div className="text-destructive">
                    <p className="font-medium">Invalid file type</p>
                    <p className="text-sm">Only PDF files are allowed</p>
                  </div>
                ) : (
                  <div className="text-primary">
                    <p className="font-medium">Drop files here</p>
                    <p className="text-sm">Release to upload</p>
                  </div>
                )
              ) : (
                <div>
                  <p className="font-medium">Drop PDF files here</p>
                  <p className="text-sm text-muted-foreground">
                    or <span className="text-primary font-medium">click to browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports: PDF files up to 50MB each
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Status */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {successfulUploads.length} successful, {failedUploads.length} failed, {uploadingFiles.length} uploading
                </div>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {uploadedFiles.map((uploadFile) => (
                  <div key={uploadFile.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <FileText className="size-6 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">
                          {uploadFile.file.name}
                        </p>
                        <div className="flex items-center gap-2">
                          {uploadFile.status === "uploading" && (
                            <Loader2 className="size-4 animate-spin text-primary" />
                          )}
                          {uploadFile.status === "success" && (
                            <CheckCircle2 className="size-4 text-green-600" />
                          )}
                          {uploadFile.status === "error" && (
                            <AlertCircle className="size-4 text-destructive" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6"
                            onClick={() => removeFile(uploadFile.id)}
                          >
                            <X className="size-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mb-2">
                        {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </div>

                      {uploadFile.status === "uploading" && (
                        <Progress value={uploadFile.progress} className="h-1.5" />
                      )}

                      {uploadFile.status === "success" && uploadFile.documentId && (
                        <div className="text-xs text-green-600">
                          Upload successful • Document ID: {uploadFile.documentId}
                        </div>
                      )}

                      {uploadFile.status === "error" && (
                        <Alert className="mt-2">
                          <AlertCircle className="size-4" />
                          <AlertDescription className="text-xs">
                            {uploadFile.error || "Upload failed"}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Summary */}
          {successfulUploads.length > 0 && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">
                    {successfulUploads.length} file{successfulUploads.length > 1 ? 's' : ''} uploaded successfully
                  </p>
                  <p className="text-sm text-green-600">
                    Extraction will begin automatically. Monitor progress in the Runs page.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
