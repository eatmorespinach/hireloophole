"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Key, ChevronDown, Upload, X } from "lucide-react"
import { Navigation } from "@/components/navigation"
import Image from "next/image"

export default function HomePage() {
  const [jobUrl, setJobUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showUploadSection, setShowUploadSection] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const router = useRouter()
  const [urlError, setUrlError] = useState("")

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 10 * 1024 * 1024) {
      // 10MB limit
      setResumeFile(file)
    } else if (file) {
      alert("File size must be less than 10MB")
    }
  }

  const removeFile = () => {
    setResumeFile(null)
    // Clear the file input
    const fileInput = document.getElementById("resume-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear any previous errors
    setUrlError("")

    if (!jobUrl) {
      setUrlError("Please enter a company's job posting URL")
      return
    }

    if (!isValidUrl(jobUrl)) {
      setUrlError("Please enter a company's job posting URL")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/mockGenerator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobUrl,
          resumeFile: resumeFile
            ? {
                name: resumeFile.name,
                size: resumeFile.size,
                type: resumeFile.type,
              }
            : null,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Store in sessionStorage and redirect
      sessionStorage.setItem("outreachData", JSON.stringify(data))
      router.push("/results")
    } catch (error) {
      console.error("Error generating outreach kit:", error)
      setUrlError("Failed to generate outreach kit. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobUrl(e.target.value)
    if (urlError) {
      setUrlError("")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <header className="pt-12 pb-8 text-center mt-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Key className="h-8 w-8 text-black" />
          <h1 className="text-4xl font-bold text-black">
            Your Hiring Advantage
          </h1>
        </div>
        <p className="text-xl text-gray-600 font-medium">Skip the resume pile. Reach the hiring boss in one click.</p>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl shadow-lg border border-gray-200 bg-white">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="jobUrl" className="block text-lg font-semibold text-gray-700">
                  Paste job post URL
                </label>
                <Input
                  id="jobUrl"
                  type="url"
                  placeholder="https://company.com/careers/your-future-job"
                  value={jobUrl}
                  onChange={handleUrlChange}
                  className={`h-14 text-lg border-2 focus:ring-gray-400 rounded-xl ${
                    urlError ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-gray-400"
                  }`}
                  required
                />
                {urlError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                    <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 text-xs">!</span>
                    </div>
                    {urlError}
                  </div>
                )}

                {/* Upload Context Button */}
                <div className="flex justify-start">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUploadSection(!showUploadSection)}
                    className="text-gray-600 hover:text-black p-2 h-auto font-medium"
                  >
                    <ChevronDown
                      className={`h-4 w-4 mr-2 transition-transform ${showUploadSection ? "rotate-180" : ""}`}
                    />
                    Upload resume to personalize message
                  </Button>
                </div>

                {/* Expandable Upload Section */}
                {showUploadSection && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <h3 className="text-md font-semibold text-gray-700 mb-3">Add context for better personalization</h3>

                    {/* Resume Upload */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Resume (PDF, DOC, DOCX)</label>
                      {!resumeFile ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <label htmlFor="resume-upload" className="cursor-pointer">
                            <span className="text-black font-medium hover:text-gray-700">
                              Click to upload your resume
                            </span>
                            <span className="text-gray-500 block text-sm mt-1">or drag and drop (max 10MB)</span>
                          </label>
                          <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <Upload className="h-4 w-4 text-black" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700 block">{resumeFile.name}</span>
                              <span className="text-xs text-gray-500">
                                {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeFile}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={!jobUrl || isLoading}
                className="w-full h-14 text-lg font-semibold bg-black hover:bg-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Magic...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Generate Outreach Kit
                  </div>
                )}
              </Button>
            </form>

            {/* Fun little footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                ✨ We'll find the hiring manager, craft your perfect message, then let you review and send ✨
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
