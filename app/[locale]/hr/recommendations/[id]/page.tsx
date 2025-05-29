"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HRNav } from "@/components/hr-nav"
import { ArrowLeft, Briefcase, GraduationCap, MapPin, Building, Award, Loader2 } from "lucide-react"
import Link from "next/link"

export default function RecommendationDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string
  const recommendationId = params.id as string
  const t = useTranslations()
  
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
            <p>{t('hr.recommendation.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!recommendation) {
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
              <CardTitle>{t('hr.recommendation.notFoundTitle')}</CardTitle>
              <CardDescription>
                {t('hr.recommendation.notFoundDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push(`/${locale}/hr/dashboard`)}>
                {t('hr.recommendation.backToDashboard')}
              </Button>
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
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/${locale}/hr/jobs/${recommendation.job.id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('hr.recommendation.backToJob')}
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{t('hr.recommendation.title')}</h1>
            <p className="text-muted-foreground">
              {t('hr.recommendation.subtitle', {
                student: recommendation.student?.name || t('hr.recommendation.unknownStudent'),
                job: recommendation.job?.title || t('hr.recommendation.unknownJob')
              })}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {t('hr.recommendation.studentProfile')}
                </CardTitle>
                <Badge
                  className={`px-3 py-1 ${
                    recommendation.match_score >= 80
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : recommendation.match_score >= 60
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {recommendation.match_score}% {t('hr.recommendation.match')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{recommendation.student?.name || t('hr.recommendation.unknownStudent')}</h3>
                <p className="text-muted-foreground">{recommendation.student?.email}</p>
              </div>

              {recommendation.student?.major && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    {t('hr.recommendation.major')}
                  </h4>
                  <p>{recommendation.student.major}</p>
                </div>
              )}

              {recommendation.student?.gpa && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    {t('hr.recommendation.gpa')}
                  </h4>
                  <p>{recommendation.student.gpa}</p>
                </div>
              )}

              {recommendation.student?.year_of_study && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    {t('hr.recommendation.year')}
                  </h4>
                  <p>{recommendation.student.year_of_study}</p>
                </div>
              )}

              {recommendation.student?.skills && recommendation.student.skills.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    {t('hr.recommendation.skills')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.student.skills.map((skill: string, index: number) => (
                      <Badge
                        key={index}
                        variant={recommendation.job?.skills_required?.includes(skill) ? "default" : "secondary"}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {recommendation.student?.experience && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    {t('hr.recommendation.experience')}
                  </h4>
                  <p className="whitespace-pre-wrap">{recommendation.student.experience}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {t('hr.recommendation.jobDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{recommendation.job?.title}</h3>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Building className="h-4 w-4" />
                  <span>{recommendation.job?.company}</span>
                  <span>•</span>
                  <MapPin className="h-4 w-4" />
                  <span>{recommendation.job?.location}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  {t('hr.recommendation.description')}
                </h4>
                <p className="whitespace-pre-wrap">{recommendation.job?.description}</p>
              </div>

              {recommendation.job?.skills_required && recommendation.job.skills_required.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    {t('hr.recommendation.requiredSkills')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.job.skills_required.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {recommendation.job?.min_gpa && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    {t('hr.recommendation.minGPA')}
                  </h4>
                  <p>{recommendation.job.min_gpa}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {recommendation.reason && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                {t('hr.recommendation.matchReason')}
              </CardTitle>
              <CardDescription>
                {t('hr.recommendation.matchReasonDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{recommendation.reason}</p>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t('hr.recommendation.nextSteps')}</CardTitle>
            <CardDescription>
              {t('hr.recommendation.nextStepsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={`/${locale}/hr/messages`}>
                  {t('hr.recommendation.contactStudent')}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/${locale}/hr/jobs/${recommendation.job?.id}/applicants`}>
                  {t('hr.recommendation.viewAllApplicants')}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/${locale}/hr/jobs/${recommendation.job?.id}`}>
                  {t('hr.recommendation.backToJobDetail')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
