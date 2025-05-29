"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
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
  const locale = params.locale as string
  const jobId = params.id as string
  const t = useTranslations()
  
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
        router.push(`/${locale}/hr/jobs/create`)
        return
      }

      // Validate UUID format
      if (!isValidUUID(jobId)) {
        setError(t('hr.jobDetail.invalidId'))
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
            setError(t('hr.jobDetail.notFound'))
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
        setError(t('hr.jobDetail.loadError'))
      } finally {
        setIsLoading(false)
      }
    }

    if (jobId) {
      fetchData()
    }
  }, [jobId, supabase, router, locale, t])

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
        message: error instanceof Error ? error.message : t('hr.jobDetail.unknownError'),
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return locale === 'ar' 
      ? date.toLocaleDateString('ar-EG')
      : date.toLocaleDateString('en-US')
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold">{t('common.appName')}</h1>
            <HRNav />
          </div>
        </header>
        <div className="container mx-auto py-10 flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>{t('hr.jobDetail.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="flex flex-col min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold">{t('common.appName')}</h1>
            <HRNav />
          </div>
        </header>
        <div className="container mx-auto py-10 flex-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('hr.jobDetail.notFoundTitle')}</CardTitle>
              <CardDescription>
                {error || t('hr.jobDetail.notFoundDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button onClick={() => router.push(`/${locale}/hr/dashboard`)}>
                  {t('hr.jobDetail.backToDashboard')}
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/${locale}/hr/jobs/create`}>
                    {t('hr.jobDetail.createNewJob')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">{t('common.appName')}</h1>
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
              <span>{t('hr.jobDetail.posted')} {formatDate(job.created_at)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push(`/${locale}/hr/dashboard`)}>
              {t('hr.jobDetail.backToDashboard')}
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/${locale}/hr/jobs/edit/${job.id}`}>
                {t('hr.jobDetail.editJob')}
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t('hr.jobDetail.description')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="whitespace-pre-wrap">{job.description}</p>

              <div>
                <h3 className="font-medium mb-3">{t('hr.jobDetail.requiredSkills')}</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required?.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  )) || <p className="text-muted-foreground">{t('hr.jobDetail.noSkills')}</p>}
                </div>
              </div>

              {job.min_gpa && (
                <div>
                  <h3 className="font-medium mb-2">{t('hr.jobDetail.minGPA')}</h3>
                  <p>{job.min_gpa}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('hr.jobDetail.matchStats')}</CardTitle>
                <CardDescription>{t('hr.jobDetail.matchStatsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{recommendations.length}</div>
                    <p className="text-xs text-muted-foreground">{t('hr.jobDetail.totalMatches')}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{getHighMatchCount()}</div>
                    <p className="text-xs text-muted-foreground">{t('hr.jobDetail.highMatches')}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{getMediumMatchCount()}</div>
                    <p className="text-xs text-muted-foreground">{t('hr.jobDetail.mediumMatches')}</p>
                  </div>
                </div>

                {recommendations.length > 0 && (
                  <div className="pt-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center">
                          <div className="w-2 h-2 mr-1 rounded-full bg-green-500" />
                          <span>{t('hr.jobDetail.highRange')}</span>
                        </div>
                        <span>{getHighMatchCount()}</span>
                      </div>
                      <Progress value={(getHighMatchCount() / recommendations.length) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center">
                          <div className="w-2 h-2 mr-1 rounded-full bg-amber-500" />
                          <span>{t('hr.jobDetail.mediumRange')}</span>
                        </div>
                        <span>{getMediumMatchCount()}</span>
                      </div>
                      <Progress value={(getMediumMatchCount() / recommendations.length) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center">
                          <div className="w-2 h-2 mr-1 rounded-full bg-gray-300" />
                          <span>{t('hr.jobDetail.lowRange')}</span>
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
                <CardTitle>{t('hr.jobDetail.generateTitle')}</CardTitle>
                <CardDescription>
                  {t('hr.jobDetail.generateDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleGenerateRecommendations} disabled={isGenerating} className="w-full">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('hr.jobDetail.generating')}
                    </>
                  ) : recommendations.length > 0 ? (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      {t('hr.jobDetail.refresh')}
                    </>
                  ) : (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      {t('hr.jobDetail.generate')}
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
              <CardTitle>{t('hr.jobDetail.recommendations')}</CardTitle>
              <CardDescription>
                {recommendations.length > 0
                  ? t('hr.jobDetail.recommendationsCount', { count: recommendations.length })
                  : t('hr.jobDetail.noRecommendations')}
              </CardDescription>
            </div>
            {recommendations.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleGenerateRecommendations} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('hr.jobDetail.refreshing')}
                  </>
                ) : (
                  t('hr.jobDetail.refreshMatches')
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
                            <h3 className="font-semibold">{rec.student?.name || t('hr.jobDetail.unknownStudent')}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <GraduationCap className="w-3.5 h-3.5 mr-1" />
                              {rec.student?.major || t('hr.jobDetail.noMajor')}
                              {rec.student?.gpa && (
                                <>
                                  <span className="mx-1.5">•</span>
                                  <span>{t('hr.jobDetail.gpa')}: {rec.student.gpa}</span>
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
                                    +{rec.student.skills.length - 5} {t('hr.jobDetail.more')}
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
                            {rec.match_score}% {t('hr.jobDetail.match')}
                          </Badge>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/${locale}/hr/recommendations/${rec.id}`}>
                              {t('hr.jobDetail.viewDetails')}
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
                <h3 className="mt-4 text-lg font-semibold">{t('hr.jobDetail.noRecommendationsTitle')}</h3>
                <p className="mt-2 text-muted-foreground">
                  {t('hr.jobDetail.noRecommendationsDesc')}
                </p>
                <Button className="mt-6" onClick={handleGenerateRecommendations} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('hr.jobDetail.generating')}
                    </>
                  ) : (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      {t('hr.jobDetail.generate')}
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
