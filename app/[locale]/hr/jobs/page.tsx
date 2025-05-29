"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { HRNav } from "@/components/hr-nav"
import { PlusCircle, Search, Briefcase, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface HRJobsPageProps {
  params: {
    locale: string
  }
}

export default function HRJobsPage({ params: { locale } }: HRJobsPageProps) {
  const t = useTranslations('HR')
  const tCommon = useTranslations('common')
  const { profile } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchJobs = async () => {
      if (!profile) return

      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select(`
            *,
            recommendations:recommendations(count)
          `)
          .eq("hr_id", profile.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        // Transform the data to include recommendation count
        const jobsWithCounts = data.map((job) => ({
          ...job,
          recommendation_count: job.recommendations.length > 0 ? job.recommendations[0].count : 0,
        }))

        setJobs(jobsWithCounts)
        setFilteredJobs(jobsWithCounts)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [profile, supabase])

  useEffect(() => {
    if (searchTerm) {
      const filtered = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.skills_required.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredJobs(filtered)
    } else {
      setFilteredJobs(jobs)
    }
  }, [searchTerm, jobs])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">InternMatch</h1>
          <HRNav />
        </div>
      </header>
      <div className="container mx-auto py-10 flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('jobListings')}</h1>
            <p className="text-muted-foreground">{t('manageJobsDescription')}</p>
          </div>
          <Button asChild>
            <Link href={`/${locale}/hr/jobs/create`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('createJob')}
            </Link>
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchJobsPlaceholder')}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription>
                    {job.company} • {job.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{job.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.skills_required.slice(0, 3).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills_required.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.skills_required.length - 3} {tCommon('more')}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Briefcase className="mr-1 h-4 w-4" />
                      <span>{job.recommendation_count} {t('recommendations')}</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/${locale}/hr/jobs/${job.id}`}>{t('viewDetails')}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-xl font-semibold">{t('noJobsFound')}</h3>
            <p className="mt-2 text-muted-foreground">
              {searchTerm
                ? t('noJobsMatchSearch')
                : t('noJobsCreated')}
            </p>
            {!searchTerm && (
              <Button className="mt-4" asChild>
                <Link href={`/${locale}/hr/jobs/create`}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('createFirstJob')}
                </Link>
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
