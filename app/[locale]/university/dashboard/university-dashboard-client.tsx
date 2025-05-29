"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UniversityNav } from "@/components/university-nav"
import { LanguageToggle } from "@/components/language-toggle"
import type { University, Student, Job, Recommendation } from "@/types/supabase"
import { PlusCircle, Users, Briefcase, Award, LogOut, FileText, Building } from "lucide-react"

interface UniversityDashboardClientProps {
  locale: string
}

export default function UniversityDashboardClient({ locale }: UniversityDashboardClientProps) {
  const t = useTranslations('university')
  const tCommon = useTranslations('common')
  const { profile, signOut } = useAuth()
  const [university, setUniversity] = useState<University | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [recommendations, setRecommendations] = useState<(Recommendation & { job: Job; student: Student })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const supabase = getSupabaseBrowserClient()
  useEffect(() => {
    const fetchData = async () => {
      if (!profile) return

      try {
        // Fetch university
        const { data: universityData, error: universityError } = await supabase
          .from("universities")
          .select("*")
          .eq("admin_id", profile.id)
          .single()

        if (universityError) {
          console.error("Error fetching university:", universityError)
          setUniversity(null)
        } else {
          setUniversity(universityData)
        }

        if (universityData) {
          // Fetch students with error handling
          try {
            const { data: studentsData, error: studentsError } = await supabase
              .from("students")
              .select("*")
              .eq("university_id", universityData.id)
              .order("created_at", { ascending: false })

            if (studentsError) {
              console.error("Error fetching students:", studentsError)
            } else {
              setStudents(studentsData || [])
            }
          } catch (error) {
            console.error("Unexpected error fetching students:", error)
            setStudents([])
          }

          // Fetch jobs with error handling
          try {
            const { data: jobsData, error: jobsError } = await supabase
              .from("jobs")
              .select("*")
              .order("created_at", { ascending: false })

            if (jobsError) {
              console.error("Error fetching jobs:", jobsError)
            } else {
              setJobs(jobsData || [])
            }
          } catch (error) {
            console.error("Unexpected error fetching jobs:", error)
            setJobs([])
          }

          // Fetch recommendations with error handling
          try {
            const { data: recommendationsData, error: recommendationsError } = await supabase
              .from("recommendations")
              .select(`
                *,
                job:jobs(*),
                student:students(*)
              `)
              .eq("student.university_id", universityData.id)
              .order("match_score", { ascending: false })

            if (recommendationsError) {
              console.error("Error fetching recommendations:", recommendationsError)
            } else {
              setRecommendations(recommendationsData || [])
            }
          } catch (error) {
            console.error("Unexpected error fetching recommendations:", error)
            setRecommendations([])
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [profile, supabase])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
      window.location.href = `/${locale}/login`
    } catch (error) {
      console.error("Error logging out:", error)
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">{tCommon('loading')}</div>
  }

  if (!university) {
    return (      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold">InternMatch</h1>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <UniversityNav />
            </div>
          </div>
        </header>
        <div className="container mx-auto py-10 flex-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('welcome')}</CardTitle>
              <CardDescription>{t('setupRequired')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={`/${locale}/university/setup`}>{t('setupProfile')}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">InternMatch</h1>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {tCommon('loggingOut')}
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  {tCommon('logout')}
                </>
              )}
            </Button>
            <UniversityNav />
          </div>
        </div>
      </header>

      <div className="container mx-auto py-10 flex-1">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboardTitle', { name: university.name })}</h1>
            <p className="text-muted-foreground">{university.location}</p>
          </div>
          <Button asChild>
            <Link href={`/${locale}/university/students/upload`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('uploadStudents')}
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('totalStudents')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('availableJobs')}</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('recommendations')}</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recommendations.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students">
          <TabsList>
            <TabsTrigger value="students">{t('students')}</TabsTrigger>
            <TabsTrigger value="jobs">{t('jobs')}</TabsTrigger>
            <TabsTrigger value="recommendations">{t('recommendations')}</TabsTrigger>
          </TabsList>          <TabsContent value="students" className="space-y-4">
            {students.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('emptyStudentsTitle')}</h3>
                  <p className="text-muted-foreground text-center mb-4 max-w-md">
                    {t('emptyStudentsDescription')}
                  </p>
                  <Button asChild>
                    <Link href={`/${locale}/university/students/upload`}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {t('uploadStudents')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium">{t('name')}</th>
                      <th className="p-2 text-left font-medium">{t('email')}</th>
                      <th className="p-2 text-left font-medium">{t('major')}</th>
                      <th className="p-2 text-left font-medium">{t('gpa')}</th>
                      <th className="p-2 text-left font-medium">{t('skills')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b">
                        <td className="p-2">{student.name}</td>
                        <td className="p-2">{student.email}</td>
                        <td className="p-2">{student.major || tCommon('notAvailable')}</td>
                        <td className="p-2">{student.gpa || tCommon('notAvailable')}</td>
                        <td className="p-2">
                          <div className="flex flex-wrap gap-1">
                            {student.skills.slice(0, 3).map((skill, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                              >
                                {skill}
                              </span>
                            ))}
                            {student.skills.length > 3 && (
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                                +{student.skills.length - 3} {tCommon('more')}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>          <TabsContent value="jobs" className="space-y-4">
            {jobs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('emptyJobsTitle')}</h3>
                  <p className="text-muted-foreground text-center mb-4 max-w-md">
                    {t('emptyJobsDescription')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium">{t('jobTitle')}</th>
                      <th className="p-2 text-left font-medium">{t('company')}</th>
                      <th className="p-2 text-left font-medium">{t('location')}</th>
                      <th className="p-2 text-left font-medium">{t('skillsRequired')}</th>
                      <th className="p-2 text-left font-medium">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id} className="border-b">
                        <td className="p-2">{job.title}</td>
                        <td className="p-2">{job.company}</td>
                        <td className="p-2">{job.location}</td>
                        <td className="p-2">
                          <div className="flex flex-wrap gap-1">
                            {job.skills_required?.slice(0, 3).map((skill, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                              >
                                {skill}
                              </span>
                            )) || []}
                            {job.skills_required?.length > 3 && (
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                                +{job.skills_required.length - 3} {tCommon('more')}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/${locale}/jobs/${job.id}`}>{t('viewDetails')}</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>          <TabsContent value="recommendations" className="space-y-4">
            {recommendations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('emptyRecommendationsTitle')}</h3>
                  <p className="text-muted-foreground text-center mb-4 max-w-md">
                    {t('emptyRecommendationsDescription')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium">{t('student')}</th>
                      <th className="p-2 text-left font-medium">{t('job')}</th>
                      <th className="p-2 text-left font-medium">{t('company')}</th>
                      <th className="p-2 text-left font-medium">{t('matchScore')}</th>
                      <th className="p-2 text-left font-medium">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendations.map((rec) => (
                      <tr key={rec.id} className="border-b">
                        <td className="p-2">{rec.student?.name || tCommon('notAvailable')}</td>
                        <td className="p-2">{rec.job?.title || tCommon('notAvailable')}</td>
                        <td className="p-2">{rec.job?.company || tCommon('notAvailable')}</td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                rec.match_score >= 80
                                  ? "bg-green-100 text-green-800"
                                  : rec.match_score >= 60
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {rec.match_score}%
                            </span>
                          </div>
                        </td>
                        <td className="p-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/${locale}/recommendations/${rec.id}`}>{t('viewDetails')}</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
