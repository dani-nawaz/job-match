"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { HRNav } from "@/components/hr-nav"
import { MultiSelect } from "@/components/multi-select"

// Mock job data
const mockJobs = [
  {
    id: 1,
    title: "Software Engineering Intern",
    description: "Join our engineering team to build cutting-edge web applications using React and Node.js.",
    skills: ["JavaScript", "React", "Node.js"],
    location: "San Francisco, CA",
    salary: "$25-30/hr",
  },
  {
    id: 2,
    title: "Data Science Intern",
    description: "Work with our data science team to analyze large datasets and build predictive models.",
    skills: ["Python", "Machine Learning", "SQL"],
    location: "Remote",
    salary: "$28-32/hr",
  },
  {
    id: 3,
    title: "UX Design Intern",
    description: "Create user-centered designs for web and mobile applications.",
    skills: ["UI/UX Design", "Figma", "User Research"],
    location: "New York, NY",
    salary: "$22-26/hr",
  },
]

export default function EditJobPage() {
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string
  const jobId = Number.parseInt(params.id as string)
  const t = useTranslations()
  
  const [isLoading, setIsLoading] = useState(false)
  const [jobNotFound, setJobNotFound] = useState(false)

  // Job details
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [salary, setSalary] = useState("")
  const [skills, setSkills] = useState<string[]>([])

  useEffect(() => {
    // Find the job with the matching ID
    const job = mockJobs.find((job) => job.id === jobId)

    if (job) {
      setTitle(job.title)
      setDescription(job.description)
      setLocation(job.location)
      setSalary(job.salary)
      setSkills(job.skills)
    } else {
      setJobNotFound(true)
    }
  }, [jobId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate job update
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/${locale}/hr/dashboard`)
    }, 1000)
  }

  // Available options for skills multi-select
  const skillOptions = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "React",
    "Angular",
    "Vue",
    "Node.js",
    "Express",
    "Django",
    "Flask",
    "SQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Kubernetes",
    "Machine Learning",
    "Data Analysis",
    "UI/UX Design",
    "Mobile Development",
    "User Research",
    "Figma",
  ]

  if (jobNotFound) {
    return (
      <div className="flex flex-col min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <header className="border-b">
          <div className="container flex items-center justify-between h-16 mx-auto">
            <h1 className="text-xl font-bold">{t('common.appName')}</h1>
            <HRNav />
          </div>
        </header>
        <div className="flex items-center justify-center flex-1 bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{t('hr.editJob.jobNotFound')}</CardTitle>
              <CardDescription>{t('hr.editJob.jobNotFoundDesc')}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push(`/${locale}/hr/dashboard`)} className="w-full">
                {t('hr.editJob.returnToDashboard')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 mx-auto">
          <h1 className="text-xl font-bold">{t('common.appName')}</h1>
          <HRNav />
        </div>
      </header>
      <div className="flex-1 py-6 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">{t('hr.editJob.title')}</h1>
              <p className="text-gray-500">{t('hr.editJob.subtitle')}</p>
            </div>
            <Button variant="outline" onClick={() => router.push(`/${locale}/hr/dashboard`)}>
              {t('hr.editJob.cancel')}
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>{t('hr.editJob.jobDetails')}</CardTitle>
                <CardDescription>{t('hr.editJob.jobDetailsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">{t('hr.editJob.jobTitle')}</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('hr.editJob.jobTitlePlaceholder')}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">{t('hr.editJob.jobDescription')}</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('hr.editJob.jobDescriptionPlaceholder')}
                    rows={6}
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="location">{t('hr.editJob.location')}</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={t('hr.editJob.locationPlaceholder')}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="salary">{t('hr.editJob.salaryRange')}</Label>
                    <Input
                      id="salary"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder={t('hr.editJob.salaryPlaceholder')}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="skills">{t('hr.editJob.requiredSkills')}</Label>
                  <MultiSelect
                    options={skillOptions.map((skill) => ({ label: skill, value: skill }))}
                    selected={skills}
                    onChange={setSkills}
                    placeholder={t('hr.editJob.skillsPlaceholder')}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t('hr.editJob.updating') : t('hr.editJob.updateJob')}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
