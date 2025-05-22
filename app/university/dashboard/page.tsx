"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNav } from "@/components/user-nav"
import type { University, Student, Job, Recommendation } from "@/types/supabase"
import { PlusCircle, Users, Briefcase, Award, LogOut } from "lucide-react"

export default function UniversityDashboard() {
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
        const { data: universityData } = await supabase
          .from("universities")
          .select("*")
          .eq("admin_id", profile.id)
          .single()

        setUniversity(universityData)

        if (universityData) {
          // Fetch students
          const { data: studentsData } = await supabase
            .from("students")
            .select("*")
            .eq("university_id", universityData.id)
            .order("created_at", { ascending: false })

          setStudents(studentsData || [])

          // Fetch jobs
          const { data: jobsData } = await supabase.from("jobs").select("*").order("created_at", { ascending: false })

          setJobs(jobsData || [])

          // Fetch recommendations
          const { data: recommendationsData } = await supabase
            .from("recommendations")
            .select(`
              *,
              job:jobs(*),
              student:students(*)
            `)
            .eq("student.university_id", universityData.id)
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

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
      window.location.href = "/login"
    } catch (error) {
      console.error("Error logging out:", error)
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!university) {
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
              <CardTitle>Welcome to the University Dashboard</CardTitle>
              <CardDescription>You need to set up your university profile before you can continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/university/setup">Set up University Profile</Link>
              </Button>
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
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </>
              )}
            </Button>
            <UserNav />
          </div>
        </div>
      </header>

      <div className="container mx-auto py-10 flex-1">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{university.name} Dashboard</h1>
            <p className="text-muted-foreground">{university.location}</p>
          </div>
          <Button asChild>
            <Link href="/university/students/upload">
              <PlusCircle className="mr-2 h-4 w-4" />
              Upload Students
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recommendations.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students">
          <TabsList>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="jobs">Available Jobs</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          <TabsContent value="students" className="space-y-4">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left font-medium">Name</th>
                    <th className="p-2 text-left font-medium">Email</th>
                    <th className="p-2 text-left font-medium">Major</th>
                    <th className="p-2 text-left font-medium">GPA</th>
                    <th className="p-2 text-left font-medium">Skills</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        No students found. Upload students to get started.
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id} className="border-b">
                        <td className="p-2">{student.name}</td>
                        <td className="p-2">{student.email}</td>
                        <td className="p-2">{student.major || "N/A"}</td>
                        <td className="p-2">{student.gpa || "N/A"}</td>
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
                                +{student.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="jobs" className="space-y-4">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left font-medium">Title</th>
                    <th className="p-2 text-left font-medium">Company</th>
                    <th className="p-2 text-left font-medium">Location</th>
                    <th className="p-2 text-left font-medium">Skills Required</th>
                    <th className="p-2 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        No jobs available at the moment.
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job.id} className="border-b">
                        <td className="p-2">{job.title}</td>
                        <td className="p-2">{job.company}</td>
                        <td className="p-2">{job.location}</td>
                        <td className="p-2">
                          <div className="flex flex-wrap gap-1">
                            {job.skills_required.slice(0, 3).map((skill, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills_required.length > 3 && (
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                                +{job.skills_required.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/jobs/${job.id}`}>View Details</Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="recommendations" className="space-y-4">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left font-medium">Student</th>
                    <th className="p-2 text-left font-medium">Job</th>
                    <th className="p-2 text-left font-medium">Company</th>
                    <th className="p-2 text-left font-medium">Match Score</th>
                    <th className="p-2 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        No recommendations available yet.
                      </td>
                    </tr>
                  ) : (
                    recommendations.map((rec) => (
                      <tr key={rec.id} className="border-b">
                        <td className="p-2">{rec.student.name}</td>
                        <td className="p-2">{rec.job.title}</td>
                        <td className="p-2">{rec.job.company}</td>
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
                            <Link href={`/recommendations/${rec.id}`}>View Details</Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
