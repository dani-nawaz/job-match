"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HRNav } from "@/components/hr-nav"
import { generateRecommendations } from "@/app/actions/generate-recommendations"
import {
  Award,
  Briefcase,
  Building,
  Calendar,
  ChevronRight,
  Clock,
  GraduationCap,
  LineChart,
  Loader2,
  MapPin,
  PlusCircle,
  Search,
  Users,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"

export default function HRDashboard() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations()
  const { profile } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({})
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) return

      try {
        // Fetch jobs
        const { data: jobsData } = await supabase
          .from("jobs")
          .select("*")
          .eq("hr_id", profile.id)
          .order("created_at", { ascending: false })

        setJobs(jobsData || [])

        // Fetch recommendations with student details
        if (jobsData && jobsData.length > 0) {
          const { data: recommendationsData } = await supabase
            .from("recommendations")
            .select(`
              *,
              job:jobs(*),
              student:students(
                id,
                name,
                email,
                major,
                gpa,
                skills,
                university_id
              )
            `)
            .in(
              "job_id",
              jobsData.map((job) => job.id),
            )
            .order("match_score", { ascending: false })

          setRecommendations(recommendationsData || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [profile, supabase])

  const handleGenerateRecommendations = async (jobId: string) => {
    setIsGenerating((prev) => ({ ...prev, [jobId]: true }))
    try {
      await generateRecommendations(jobId)

      // Refresh recommendations
      const { data: newRecommendations } = await supabase
        .from("recommendations")
        .select(`
          *,
          job:jobs(*),
          student:students(
            id,
            name,
            email,
            major,
            gpa,
            skills,
            university_id
          )
        `)
        .eq("job_id", jobId)
        .order("match_score", { ascending: false })

      setRecommendations((prev) => {
        const filtered = prev.filter((rec) => rec.job_id !== jobId)
        return [...filtered, ...(newRecommendations || [])]
      })
    } catch (error) {
      console.error("Error generating recommendations:", error)
    } finally {
      setIsGenerating((prev) => ({ ...prev, [jobId]: false }))
    }
  }

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId)
  }

  const getJobRecommendations = (jobId: string) => {
    return recommendations.filter((rec) => rec.job_id === jobId)
  }

  const getHighMatchCount = (jobId: string) => {
    return getJobRecommendations(jobId).filter((rec) => rec.match_score >= 80).length
  }

  const getMediumMatchCount = (jobId: string) => {
    return getJobRecommendations(jobId).filter((rec) => rec.match_score >= 60 && rec.match_score < 80).length
  }

  const getRecommendationCount = (jobId: string) => {
    return getJobRecommendations(jobId).length
  }

  const getTopSkills = () => {
    // Create a map of skills and their counts
    const skillsMap: Record<string, number> = {}

    jobs.forEach((job) => {
      if (job.skills_required && Array.isArray(job.skills_required)) {
        job.skills_required.forEach((skill: string) => {
          skillsMap[skill] = (skillsMap[skill] || 0) + 1
        })
      }
    })

    // Convert to array of [skill, count] pairs
    const skillsArray = Object.entries(skillsMap)

    // Sort by count (descending)
    skillsArray.sort((a, b) => b[1] - a[1])

    // Return top 10 skills
    return skillsArray.slice(0, 10)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <header className="border-b">
          <div className="container flex items-center justify-between h-16 mx-auto">
            <h1 className="text-xl font-bold">TalentBridge</h1>
            <HRNav />
          </div>
        </header>
        <div className="container py-10 mx-auto">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 mx-auto">
          <h1 className="text-xl font-bold">TalentBridge</h1>
          <HRNav />
        </div>
      </header>

      <div className="container py-10 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('hr.dashboard.title')}</h1>
            <p className="text-muted-foreground">{profile?.company_name || t('hr.dashboard.yourCompany')}</p>
          </div>
          <Button asChild>
            <Link href={`/${locale}/hr/jobs/create`}>
              <PlusCircle className="w-4 h-4 mr-2" />
              {t('hr.dashboard.postNewJob')}
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 mb-10 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{t('hr.dashboard.activeJobs')}</CardTitle>
                <Briefcase className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.length}</div>
              <p className="text-xs text-muted-foreground">
                {jobs.length === 0
                  ? t('hr.dashboard.noActiveJobPostings')
                  : jobs.length === 1
                    ? t('hr.dashboard.oneActiveJobPosting')
                    : t('hr.dashboard.activeJobPostingsCount', { count: jobs.length })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{t('hr.dashboard.totalRecommendations')}</CardTitle>
                <Award className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recommendations.length}</div>
              <p className="text-xs text-muted-foreground">
                {recommendations.length === 0
                  ? t('hr.dashboard.noStudentRecommendations')
                  : recommendations.length === 1
                    ? t('hr.dashboard.oneStudentRecommendation')
                    : t('hr.dashboard.studentRecommendationsCount', { count: recommendations.length })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{t('hr.dashboard.highMatches')}</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recommendations.filter((rec) => rec.match_score >= 80).length}</div>
              <p className="text-xs text-muted-foreground">{t('hr.dashboard.highMatchDescription')}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="jobs">{t('hr.dashboard.myJobs')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('hr.dashboard.analytics')}</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            {jobs.length === 0 ? (
              <Card className="p-8 text-center">
                <Briefcase className="w-12 h-12 mx-auto text-gray-300" />
                <h3 className="mt-4 text-xl font-semibold">{t('hr.dashboard.noActiveJobPostings')}</h3>
                <p className="mt-2 text-muted-foreground">
                  {t('hr.dashboard.createFirstJobDescription')}
                </p>
                <Button className="mt-4" asChild>
                  <Link href={`/${locale}/hr/jobs/create`}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    {t('hr.dashboard.postNewJob')}
                  </Link>
                </Button>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {jobs.map((job) => {
                  const jobRecommendations = getJobRecommendations(job.id)
                  const isExpanded = expandedJobId === job.id

                  return (
                    <Card key={job.id} className="overflow-hidden">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{job.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Building className="w-3.5 h-3.5 mr-1" />
                              {job.company}
                              <span className="mx-1.5">•</span>
                              <MapPin className="w-3.5 h-3.5 mr-1" />
                              {job.location}
                            </CardDescription>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/${locale}/hr/jobs/${job.id}`}>
                              <Search className="w-3.5 h-3.5 mr-1.5" />
                              {t('hr.dashboard.details')}
                            </Link>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-1.5">
                          {job.skills_required &&
                            Array.isArray(job.skills_required) &&
                            job.skills_required.slice(0, 5).map((skill: string, index: number) => (
                              <Badge key={index} variant="secondary" className="px-2 py-0.5 text-xs">
                                {skill}
                              </Badge>
                            ))}
                          {job.skills_required &&
                            Array.isArray(job.skills_required) &&
                            job.skills_required.length > 5 && (
                              <Badge variant="outline" className="px-2 py-0.5 text-xs">
                                +{job.skills_required.length - 5} {t('hr.dashboard.more')}
                              </Badge>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1.5 text-muted-foreground" />
                              <span className="text-sm">
                                <span className="font-medium">{getRecommendationCount(job.id)}</span>{" "}
                                {getRecommendationCount(job.id) === 1 ? t('hr.dashboard.match') : t('hr.dashboard.matches')}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1.5 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(job.created_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleJobExpansion(job.id)}
                            className="flex items-center gap-1"
                          >
                            {isExpanded ? t('hr.dashboard.hide') : t('hr.dashboard.show')} {t('hr.dashboard.matches')}
                            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                          </Button>
                        </div>

                        {getRecommendationCount(job.id) > 0 && (
                          <div className="pt-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                              <span>{t('hr.dashboard.matchQuality')}</span>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 mr-1 rounded-full bg-green-500" />
                                  <span>{getHighMatchCount(job.id)} {t('hr.dashboard.high')}</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-2 h-2 mr-1 rounded-full bg-amber-500" />
                                  <span>{getMediumMatchCount(job.id)} {t('hr.dashboard.medium')}</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-2 h-2 mr-1 rounded-full bg-gray-300" />
                                  <span>
                                    {getRecommendationCount(job.id) -
                                      getHighMatchCount(job.id) -
                                      getMediumMatchCount(job.id)}{" "}
                                    {t('hr.dashboard.low')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Progress
                              value={
                                (getHighMatchCount(job.id) / getRecommendationCount(job.id)) * 100 +
                                (getMediumMatchCount(job.id) / getRecommendationCount(job.id)) * 100
                              }
                              className="h-2"
                            />
                          </div>
                        )}
                      </CardContent>

                      {isExpanded && (
                        <div className="px-6 pb-6">
                          {jobRecommendations.length > 0 ? (
                            <div className="space-y-3 mt-2">
                              <h4 className="text-sm font-medium">{t('hr.dashboard.topMatches')}</h4>
                              {jobRecommendations.slice(0, 3).map((rec) => (
                                <div
                                  key={rec.id}
                                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                      <AvatarFallback className="text-xs">
                                        {rec.student && rec.student.name
                                          ? rec.student.name
                                              .split(" ")
                                              .map((n: string) => n[0])
                                              .join("")
                                          : "?"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">{rec.student?.name || t('hr.dashboard.unknownStudent')}</p>
                                      <p className="text-xs text-muted-foreground flex items-center">
                                        <GraduationCap className="w-3 h-3 mr-1" />
                                        {rec.student?.major || t('hr.dashboard.noMajorSpecified')}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Badge
                                      className={`${
                                        rec.match_score >= 80
                                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                                          : rec.match_score >= 60
                                            ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                      }`}
                                    >
                                      {rec.match_score}%
                                    </Badge>
                                    <Button variant="ghost" size="icon" asChild>
                                      <Link href={`/${locale}/hr/recommendations/${rec.id}`}>
                                        <ChevronRight className="w-4 h-4" />
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              ))}
                              {jobRecommendations.length > 3 && (
                                <Button
                                  variant="outline"
                                  className="w-full mt-2"
                                  onClick={() => router.push(`/${locale}/hr/jobs/${job.id}`)}
                                >
                                  {t('hr.dashboard.viewAllMatches', { count: jobRecommendations.length })}
                                </Button>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                              <Users className="w-8 h-8 mb-2 text-muted-foreground/50" />
                              <h4 className="text-sm font-medium">{t('hr.dashboard.noMatchesFound')}</h4>
                              <p className="text-xs text-muted-foreground mt-1 mb-3">
                                {t('hr.dashboard.generateMatchesDescription')}
                              </p>
                              <Button
                                onClick={() => handleGenerateRecommendations(job.id)}
                                disabled={isGenerating[job.id]}
                                size="sm"
                              >
                                {isGenerating[job.id] ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                                    {t('hr.dashboard.generating')}
                                  </>
                                ) : (
                                  t('hr.dashboard.generateMatches')
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      <CardFooter className="flex justify-between border-t bg-muted/50 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateRecommendations(job.id)}
                          disabled={isGenerating[job.id]}
                        >
                          {isGenerating[job.id] ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                              {t('hr.dashboard.generating')}
                            </>
                          ) : (
                            <>
                              <Award className="w-3.5 h-3.5 mr-1.5" />
                              {getRecommendationCount(job.id) > 0 ? t('hr.dashboard.refreshMatches') : t('hr.dashboard.generateMatches')}
                            </>
                          )}
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/${locale}/hr/jobs/edit/${job.id}`}>{t('common.edit')}</Link>
                          </Button>
                          <Button variant="default" size="sm" asChild>
                            <Link href={`/${locale}/hr/jobs/${job.id}`}>{t('common.view')}</Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>{t('hr.dashboard.recruitmentAnalytics')}</CardTitle>
                <CardDescription>{t('hr.dashboard.recruitmentAnalyticsDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{t('hr.dashboard.matchQualityDistribution')}</CardTitle>
                        <LineChart className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <div className="w-3 h-3 mr-2 rounded-full bg-green-500" />
                              <span>{t('hr.dashboard.highMatchesRange')}</span>
                            </div>
                            <span className="font-medium">
                              {recommendations.filter((rec) => rec.match_score >= 80).length}
                            </span>
                          </div>
                          <Progress
                            value={
                              recommendations.length > 0
                                ? (recommendations.filter((rec) => rec.match_score >= 80).length /
                                    recommendations.length) *
                                  100
                                : 0
                            }
                            className="h-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <div className="w-3 h-3 mr-2 rounded-full bg-amber-500" />
                              <span>{t('hr.dashboard.mediumMatchesRange')}</span>
                            </div>
                            <span className="font-medium">
                              {recommendations.filter((rec) => rec.match_score >= 60 && rec.match_score < 80).length}
                            </span>
                          </div>
                          <Progress
                            value={
                              recommendations.length > 0
                                ? (recommendations.filter((rec) => rec.match_score >= 60 && rec.match_score < 80)
                                    .length /
                                    recommendations.length) *
                                  100
                                : 0
                            }
                            className="h-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <div className="w-3 h-3 mr-2 rounded-full bg-gray-300" />
                              <span>{t('hr.dashboard.lowMatchesRange')}</span>
                            </div>
                            <span className="font-medium">
                              {recommendations.filter((rec) => rec.match_score < 60).length}
                            </span>
                          </div>
                          <Progress
                            value={
                              recommendations.length > 0
                                ? (recommendations.filter((rec) => rec.match_score < 60).length /
                                    recommendations.length) *
                                  100
                                : 0
                            }
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{t('hr.dashboard.recentActivity')}</CardTitle>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {jobs.length > 0 ? (
                          jobs.slice(0, 3).map((job) => (
                            <div key={job.id} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">{job.title}</p>
                                <p className="text-xs text-muted-foreground">{job.company}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">{getRecommendationCount(job.id)} {t('hr.dashboard.matches')}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(job.created_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-center">
                            <p className="text-sm text-muted-foreground">{t('hr.dashboard.noRecentActivity')}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">{t('hr.dashboard.topSkillsInDemand')}</CardTitle>
                      <Award className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {getTopSkills().map(([skill, count]) => (
                        <Badge key={skill} variant="secondary" className="px-2.5 py-1">
                          {skill} <span className="ml-1 opacity-70">({count})</span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
