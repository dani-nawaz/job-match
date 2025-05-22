"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/user-nav"
import { ArrowLeft, Briefcase, GraduationCap, MapPin, Building, Award, Loader2 } from "lucide-react"
import Link from "next/link"

export default function RecommendationDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const recommendationId = params.id as string
  const [recommendation, setRecommendation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch recommendation with job and student details
        const { data, error } = await supabase
          .from("recommendations")
          .select(`
            *,
            job:jobs(*),
            student:students(*)
          `)
          .eq("id", recommendationId)
          .single()

        if (error) throw error
        setRecommendation(data)
      } catch (error) {
        console.error("Error fetching recommendation:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (recommendationId) {
      fetchData()
    }
  }, [recommendationId, supabase])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold">InternMatch</h1>
            <UserNav />
          </div>
        </header>
        <div className="container mx-auto py-10 flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Loading recommendation details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!recommendation) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold">InternMatch</h1>
            <UserNav />
          </div>
        </header>
        <div className="container mx-auto py-10 flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Recommendation Not Found</CardTitle>
              <CardDescription>
                The recommendation you're looking for doesn't exist or you don't have permission to view it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/hr/dashboard")}>Back to Dashboard</Button>
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
          <h1 className="text-xl font-bold">InternMatch</h1>
          <UserNav />
        </div>
      </header>
      <div className="container mx-auto py-10 flex-1">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Job Details</CardTitle>
                  <CardDescription>{recommendation.job.company}</CardDescription>
                </div>
                <Badge variant="outline" className="px-3 py-1 text-lg font-bold">
                  {recommendation.match_score}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{recommendation.job.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>{recommendation.job.company}</span>
                    <span>•</span>
                    <MapPin className="h-4 w-4" />
                    <span>{recommendation.job.location}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{recommendation.job.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Required Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.job.skills_required.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {recommendation.job.min_gpa && (
                  <div>
                    <h4 className="font-medium mb-1">Minimum GPA</h4>
                    <p>{recommendation.job.min_gpa}</p>
                  </div>
                )}

                <div className="pt-2">
                  <Button variant="outline" asChild>
                    <Link href={`/hr/jobs/${recommendation.job.id}`}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      View Full Job Details
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Details</CardTitle>
              <CardDescription>Matched candidate information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{recommendation.student.name}</h3>
                  <p className="text-sm text-muted-foreground">{recommendation.student.email}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Education</h4>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>{recommendation.student.major || "Major not specified"}</span>
                    {recommendation.student.gpa && (
                      <>
                        <span>•</span>
                        <span>GPA: {recommendation.student.gpa}</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.student.skills.map((skill: string, index: number) => (
                      <Badge
                        key={index}
                        variant={recommendation.job.skills_required.includes(skill) ? "default" : "secondary"}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {recommendation.student.certifications && recommendation.student.certifications.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-1">Certifications</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {recommendation.student.certifications.map((cert: string, index: number) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {recommendation.student.location_preference && (
                  <div>
                    <h4 className="font-medium mb-1">Location Preference</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{recommendation.student.location_preference}</span>
                    </div>
                  </div>
                )}

                {recommendation.student.internship_history && recommendation.student.internship_history.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-1">Internship History</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {recommendation.student.internship_history.map((internship: string, index: number) => (
                        <li key={index}>{internship}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Match Analysis</CardTitle>
                <Badge variant="outline" className="px-3 py-1 text-lg font-bold">
                  {recommendation.match_score}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Award className="mr-2 h-5 w-5 text-primary" />
                    Match Reasoning
                  </h4>
                  <div className="p-4 bg-muted/30 rounded-md">
                    <p className="whitespace-pre-wrap">{recommendation.reason}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button>Contact Student</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
