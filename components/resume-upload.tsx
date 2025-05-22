"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"

export function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [extracting, setExtracting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadStatus("idle")
    }
  }

  const handleUpload = () => {
    if (!file) return

    setUploading(true)

    // Simulate upload process
    setTimeout(() => {
      setUploading(false)
      setUploadStatus("success")

      // Simulate extraction process
      setExtracting(true)
      setTimeout(() => {
        setExtracting(false)
      }, 2000)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="resume-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF, DOC, or DOCX (MAX. 5MB)</p>
          </div>
          <input
            id="resume-upload"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={uploading || extracting}
          />
        </label>
      </div>

      {file && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-500" />
              <span className="font-medium">{file.name}</span>
              <span className="text-xs text-gray-500">({Math.round(file.size / 1024)} KB)</span>
            </div>
            {uploadStatus === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : uploadStatus === "error" ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : null}
          </div>

          {uploadStatus === "idle" && (
            <Button onClick={handleUpload} disabled={uploading} className="w-full mt-2">
              {uploading ? "Uploading..." : "Upload Resume"}
            </Button>
          )}

          {uploadStatus === "success" && (
            <div className="mt-2">
              {extracting ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-t-black rounded-full animate-spin"></div>
                  Extracting information from your resume...
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Resume processed successfully! Your profile has been updated.
                </div>
              )}
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="mt-2 text-sm text-red-500">
              There was an error processing your resume. Please try again.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
