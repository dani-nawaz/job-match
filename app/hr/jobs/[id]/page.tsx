"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { generateRecommendations } from "@/app/actions/generate-recommendations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { HRNav } from "@/components/hr-nav"
import {
  AlertCircle,
  Award,
  Building,
  CheckCircle,
  ChevronRight,
  Clock,
  GraduationCap,
  Loader2,
  MapPin,
  Users,
} from "lucide-react"
import Link from "next/link"

// Helper function to validate UUID format
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  const [job, setJob] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchData = async () => {
      // Check if the ID is "create" and redirect
      if (jobId === "create") {
        router.push("/hr/jobs/create")
        return
      }

      // Validate UUID format
      if (!isValidUUID(jobId)) {
        setError("Invalid job ID format")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Fetch job details
        const { data: jobData, error: jobError } = await supabase.from("jobs").select("*").eq("id", jobId).single()

        if (jobError) {
          if (jobError.code === "PGRST116") {
            setError("Job not found")
          } else {
            throw jobError
          }
          return
        }

        setJob(jobData)

        // Fetch recommendations
        const { data: recommendationsData, error: recommendationsError } = await supabase
          .from("recommendations")
          .select(`
            *,
            student:students(*)
          `)
          .eq("job_id", jobId)
          .order("match_score", { ascending: false })

        if (recommendationsError) throw recommendationsError
        setRecommendations(recommendationsData || [])
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load job details")
      } finally {
        setIsLoading(false)
      }
    }

    if (jobId) {
      fetchData()
    }
  }, [jobId, supabase, router])

  const handleGenerateRecommendations = async () => {
    setIsGenerating(true)
    setGenerationResult(null)
    try {
      const result = await generateRecommendations(jobId)
      setGenerationResult(result)

      if (result.success) {
        // Refresh recommendations
        const { data: recommendationsData } = await supabase
          .from("recommendations")
          .select(`
            *,
            student:students(*)
          `)
          .eq("job_id", jobId)
          .order("match_score", { ascending: false })

        setRecommendations(recommendationsData || [])
      }
    } catch (error) {
      console.error("Error generating recommendations:", error)
      setGenerationResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getHighMatchCount = () => {
    return recommendations.filter((rec) => rec.match_score >= 80).length
  }

  const getMediumMatchCount = () => {
    return recommendations.filter((rec) => rec.match_score >= 60 && rec.match_score < 80).length
  }

  const getLowMatchCount = () => {
    return recommendations.filter((rec) => rec.match_score < 60).length
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold">TalentBridge</h1>
            <HRNav />
          </div>
        </header>
        <div className="container mx-auto py-10 flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Loading job details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold">TalentBridge</h1>
            <HRNav />
          </div>
        </header>
        <div className="container mx-auto py-10 flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Job Not Found</CardTitle>
              <CardDescription>
                {error || "The job you're looking for doesn't exist or you don't have permission to view it."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button onClick={() => router.push("/hr/dashboard")}>Back to Dashboard</Button>
                <Button variant="outline" asChild>
                  <Link href="/hr/jobs/create">Create New Job</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <div className="flex items-center mt-1 text-muted-foreground">
              <Building className="w-4 h-4 mr-1" />
              <span>{job.company}</span>
              <span className="mx-2">•</span>
              <MapPin className="w-4 h-4 mr-1" />
              <span>{job.location}</span>
              <span className="mx-2">•</span>
              <Clock className="w-4 h-4 mr-1" />
              <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/hr/dashboard")}>
              Back to Dashboard
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/hr/jobs/edit/${job.id}`}>Edit Job</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="whitespace-pre-wrap">{job.description}</p>

              <div>
                <h3 className="font-medium mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required?.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  )) || <p className="text-muted-foreground">No skills specified</p>}
                </div>
              </div>

              {job.min_gpa && (
                <div>
                  <h3 className="font-medium mb-2">Minimum GPA</h3>
                  <p>{job.min_gpa}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Match Statistics</CardTitle>
                <CardDescription>Overview of student matches for this job</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{recommendations.length}</div>
                    <p className="text-xs text-muted-foreground">Total Matches</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{getHighMatchCount()}</div>
                    <p className="text-xs text-muted-foreground">High Matches</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{getMediumMatchCount()}</div>
                    <p className="text-xs text-muted-foreground">Medium Matches</p>
                  </div>
                </div>

                {recommendations.length > 0 && (
                  <div className="pt-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center">
                          <div className="w-2 h-2 mr-1 rounded-full bg-green-500" />
                          <span>High (80-100%)</span>
                        </div>
                        <span>{getHighMatchCount()}</span>
                      </div>
                      <Progress value={(getHighMatchCount() / recommendations.length) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center">
                          <div className="w-2 h-2 mr-1 rounded-full bg-amber-500" />
                          <span>Medium (60-79%)</span>
                        </div>
                        <span>{getMediumMatchCount()}</span>
                      </div>
                      <Progress value={(getMediumMatchCount() / recommendations.length) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center">
                          <div className="w-2 h-2 mr-1 rounded-full bg-gray-300" />
                          <span>Low (0-59%)</span>
                        </div>
                        <span>{getLowMatchCount()}</span>
                      </div>
                      <Progress value={(getLowMatchCount() / recommendations.length) * 100} className="h-2" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generate Recommendations</CardTitle>
                <CardDescription>
                  Use AI to match students with this job based on skills, experience, and qualifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleGenerateRecommendations} disabled={isGenerating} className="w-full">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : recommendations.length > 0 ? (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      Refresh Recommendations
                    </>
                  ) : (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      Generate Recommendations
                    </>
                  )}
                </Button>

                {generationResult && (
                  <div className={`mt-4 p-4 rounded-md ${generationResult.success ? "bg-green-50" : "bg-red-50"}`}>
                    <div className="flex items-start">
                      {generationResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      )}
                      <div>
                        <p className={generationResult.success ? "text-green-700" : "text-red-700"}>
                          {generationResult.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Student Recommendations</CardTitle>
              <CardDescription>
                {recommendations.length > 0
                  ? `${recommendations.length} students matched with this job`
                  : "No recommendations generated yet"}
              </CardDescription>
            </div>
            {recommendations.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleGenerateRecommendations} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  "Refresh Matches"
                )}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="overflow-hidden">
                    <div
                      className={`h-1 ${
                        rec.match_score >= 80 ? "bg-green-500" : rec.match_score >= 60 ? "bg-amber-500" : "bg-gray-300"
                      }`}
                    />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-10 h-10 mt-1">
                            <AvatarFallback>
                              {rec.student?.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("") || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{rec.student?.name || "Unknown Student"}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <GraduationCap className="w-3.5 h-3.5 mr-1" />
                              {rec.student?.major || "No major specified"}
                              {rec.student?.gpa && (
                                <>
                                  <span className="mx-1.5">•</span>
                                  <span>GPA: {rec.student.gpa}</span>
                                </>
                              )}
                            </div>

                            {rec.student?.skills && rec.student.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {rec.student.skills.slice(0, 5).map((skill: string, index: number) => (
                                  <Badge
                                    key={index}
                                    variant={job.skills_required?.includes(skill) ? "default" : "secondary"}
                                    className="text-xs px-1.5 py-0"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                                {rec.student.skills.length > 5 && (
                                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                                    +{rec.student.skills.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            )}

                            {rec.reason && (
                              <div className="mt-3 text-sm">
                                <p className="text-muted-foreground">{rec.reason}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            className={`px-2.5 py-1 ${
                              rec.match_score >= 80
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : rec.match_score >= 60
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }`}
                          >
                            {rec.match_score}% Match
                          </Badge>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/hr/recommendations/${rec.id}`}>
                              View Details
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <h3 className="mt-4 text-lg font-semibold">No recommendations yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Generate recommendations to find suitable candidates for this job.
                </p>
                <Button className="mt-6" onClick={handleGenerateRecommendations} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      Generate Recommendations
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
