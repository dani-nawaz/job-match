"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, AlertCircle, X, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  isLoading: boolean
  error: string | null
  selectedFile: File | null
  onDownloadTemplate: () => void
  progress?: number
  className?: string
}

export function CSVFileUpload({
  onFileSelect,
  onFileRemove,
  isLoading,
  error,
  selectedFile,
  onDownloadTemplate,
  progress = 0,
  className,
}: FileUploadProps) {
  const t = useTranslations('university')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      const csvFile = files.find((file) => file.type === "text/csv" || file.name.endsWith(".csv"))

      if (csvFile) {
        onFileSelect(csvFile)
      }
    },
    [onFileSelect],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onFileSelect(file)
      }
    },
    [onFileSelect],
  )

  const handleClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click()
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Template Download */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{t('csvUploadDescription')}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadTemplate}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {t('downloadTemplate')}
        </Button>
      </div>

      {/* File Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-all duration-200 cursor-pointer",
          isDragOver && "border-blue-500 bg-blue-50",
          selectedFile && "border-green-500 bg-green-50",
          error && "border-red-500 bg-red-50",
          isLoading && "cursor-not-allowed opacity-60",
        )}
      >
        <CardContent
          className="p-8 text-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />

          {!selectedFile ? (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload
                  className={cn("h-8 w-8 text-gray-400", isDragOver && "text-blue-500", isLoading && "animate-pulse")}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {isDragOver ? t('dropFileHere') : t('uploadCsvFile')}
                </h3>
                <p className="text-sm text-gray-500">{t('dragDropText')}</p>
                <p className="text-xs text-gray-400">{t('supportedFiles')}</p>
              </div>

              {!isLoading && (
                <Button variant="outline" className="mt-4">
                  {t('chooseFile')}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
                ) : error ? (
                  <AlertCircle className="h-8 w-8 text-red-500" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-gray-900">{selectedFile.name}</span>
                  {!isLoading && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onFileRemove()
                      }}
                      className="h-6 w-6 p-0 hover:bg-red-100"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>

                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>

                {isLoading && (
                  <div className="space-y-2">
                    <p className="text-sm text-blue-600 font-medium">{t('processingFile')}</p>
                    <Progress value={progress} className="w-full max-w-xs mx-auto" />
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* File Requirements */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• {t('csvHeadersRequired')}</p>
        <p>• {t('skillsSeparator')}</p>
        <p>• {t('gpaFormat')}</p>
        <p>• {t('maxFileSize')}</p>
      </div>
    </div>
  )
}
