"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { HRNav } from "@/components/hr-nav"
import { AlertCircle, ArrowLeft, Briefcase } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CreateJobPage() {
  const { profile } = useAuth()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [skillsRequired, setSkillsRequired] = useState("")
  const [minGpa, setMinGpa] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (!profile) {
        throw new Error("You must be logged in to create a job")
      }

      const jobData = {
        title,
        company: profile.company_name || "",
        hr_id: profile.id,
        location,
        description,
        skills_required: skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        min_gpa: minGpa ? Number.parseFloat(minGpa) : null,
      }

      const { error: insertError, data: job } = await supabase.from("jobs").insert(jobData).select().single()

      if (insertError) {
        throw insertError
      }

      router.push(`/hr/jobs/${job.id}`)
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">TalentBridge</h1>
          <HRNav />
        </div>
      </header>
      <div className="container mx-auto py-10 flex-1">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/hr/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Create Job Posting</h1>
              <p className="text-muted-foreground">Post a new job opportunity to find the perfect candidates</p>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="max-w-2xl">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Enter the details of the job you want to post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Software Engineering Intern"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., San Francisco, CA or Remote"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the responsibilities, requirements, and benefits of the position..."
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillsRequired">Required Skills (comma separated) *</Label>
                <Textarea
                  id="skillsRequired"
                  value={skillsRequired}
                  onChange={(e) => setSkillsRequired(e.target.value)}
                  placeholder="e.g., JavaScript, React, Node.js, Problem Solving"
                  rows={3}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Separate each skill with a comma. These will be used for AI-powered matching.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minGpa">Minimum GPA (Optional)</Label>
                <Input
                  id="minGpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  value={minGpa}
                  onChange={(e) => setMinGpa(e.target.value)}
                  placeholder="e.g., 3.0"
                />
                <p className="text-sm text-muted-foreground">Leave empty if no minimum GPA is required.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/hr/dashboard")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Job Posting"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
