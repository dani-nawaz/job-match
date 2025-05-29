"use client"

import type React from "react"
import { CardFooter } from "@/components/ui/card"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { HRNav } from "@/components/hr-nav"
import { Search, Filter, Mail, MessageSquare, User, Briefcase } from "lucide-react"

// Mock job data
const mockJobs = [
  {
    id: 1,
    title: "Software Engineering Intern",
    company: "TechCorp",
    location: "San Francisco, CA",
    description: "Join our engineering team to build cutting-edge web applications using React and Node.js.",
    skills: ["JavaScript", "React", "Node.js"],
    salary: "$25-30/hr",
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "TechCorp",
    location: "Remote",
    description: "Work with our data science team to analyze large datasets and build predictive models.",
    skills: ["Python", "Machine Learning", "SQL"],
    salary: "$28-32/hr",
  },
  {
    id: 3,
    title: "UX Design Intern",
    company: "TechCorp",
    location: "New York, NY",
    description: "Create user-centered designs for web and mobile applications.",
    skills: ["UI/UX Design", "Figma", "User Research"],
    salary: "$22-26/hr",
  },
]

const mockStudents = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    skills: ["JavaScript", "React", "Node.js", "HTML", "CSS"],
    interests: ["Web Development", "Mobile Development"],
    dreamCompanies: ["Google", "Microsoft", "TechCorp"],
    careerGoals: "I want to become a full-stack developer working on innovative products that make a difference.",
    gpa: "3.8",
    internships: "Summer Web Developer at LocalTech",
    certifications: ["AWS Certified Developer", "Google Cloud Associate"],
    hiringStatus: "part-time",
    match: 92,
    matchReasons: ["Skills match", "Goals match", "Merit match"],
  },
  {
    id: 2,
    name: "Jamie Smith",
    email: "jamie.smith@example.com",
    skills: ["JavaScript", "React", "Vue", "TypeScript"],
    interests: ["Web Development", "UI/UX Design"],
    dreamCompanies: ["Apple", "TechCorp", "Spotify"],
    careerGoals: "I aim to specialize in frontend development with a focus on creating beautiful, accessible interfaces.",
    gpa: "3.6",
    internships: "UI Developer Intern at DesignStudio",
    certifications: ["React Certification", "Frontend Masters"],
    hiringStatus: "full-time",
    match: 87,
    matchReasons: ["Skills match", "Merit match"],
  },
  {
    id: 3,
    name: "Taylor Wilson",
    email: "taylor.wilson@example.com",
    skills: ["Python", "Machine Learning", "SQL", "Data Analysis", "Statistics"],
    interests: ["Data Science", "AI", "Big Data"],
    dreamCompanies: ["Amazon", "Netflix", "TechCorp"],
    careerGoals: "I want to build machine learning models that solve real-world problems.",
    gpa: "3.9",
    internships: "Data Science Intern at StartupX",
    certifications: ["TensorFlow Developer", "Python Data Science"],
    hiringStatus: "full-time",
    match: 95,
    matchReasons: ["Skills match", "Goals match"],
  },
  {
    id: 4,
    name: "Jordan Lee",
    email: "jordan.lee@example.com",
    skills: ["Python", "R", "SQL", "Tableau", "Statistical Analysis"],
    interests: ["Data Visualization", "Business Intelligence"],
    dreamCompanies: ["IBM", "Microsoft", "Oracle"],
    careerGoals: "I want to help organizations make data-driven decisions through analytics.",
    gpa: "3.5",
    internships: "Data Analyst at EnterpriseX",
    certifications: ["SQL Advanced", "Data Science Professional"],
    hiringStatus: "part-time",
    match: 88,
    matchReasons: ["Skills match"],
  },
  {
    id: 5,
    name: "Casey Martinez",
    email: "casey.martinez@example.com",
    skills: ["UI/UX Design", "Figma", "User Research", "Wireframing", "Prototyping"],
    interests: ["User Experience", "Interaction Design"],
    dreamCompanies: ["Facebook", "GitHub", "TechCorp"],
    careerGoals: "I want to create intuitive and accessible user experiences that delight users.",
    gpa: "3.7",
    internships: "UX Designer at DesignAgency",
    certifications: ["UX Certification", "Figma Advanced"],
    hiringStatus: "full-time",
    match: 93,
    matchReasons: ["Skills match", "Goals match"],
  },
  {
    id: 6,
    name: "Riley Thompson",
    email: "riley.thompson@example.com",
    skills: ["UI/UX Design", "Adobe XD", "Sketch", "User Testing", "Visual Design"],
    interests: ["Product Design", "Brand Identity"],
    dreamCompanies: ["Apple", "Airbnb", "TechCorp"],
    careerGoals: "I aim to blend aesthetics and functionality to create memorable digital experiences.",
    gpa: "3.8",
    internships: "Product Designer at CreativeStudio",
    certifications: ["Interaction Design Foundation", "Design Thinking"],
    hiringStatus: "full-time",
    match: 89,
    matchReasons: ["Skills match", "Merit match"],
  },
]

// Add this function before the ApplicantCard component
function getMatchingSkills(jobSkills: string[], studentSkills: string[]): string[] {
  return jobSkills.filter((jobSkill) =>
    studentSkills.some(
      (studentSkill) =>
        studentSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(studentSkill.toLowerCase()),
    ),
  )
}

export default function ApplicantsPage() {
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string
  const jobId = Number.parseInt(params.id as string)
  const t = useTranslations()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [matchThreshold, setMatchThreshold] = useState([60])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [hiringStatus, setHiringStatus] = useState("all")

  // Find the job with the matching ID
  const job = mockJobs.find((job) => job.id === jobId)

  // Filter students based on search term, match threshold, and other filters
  const filteredStudents = mockStudents
    .filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .filter((student) => student.match >= matchThreshold[0])
    .filter(
      (student) =>
        hiringStatus === "all" ||
        (hiringStatus === "full-time" && student.hiringStatus === "full-time") ||
        (hiringStatus === "part-time" && student.hiringStatus === "part-time"),
    )
    .filter((student) => selectedSkills.length === 0 || selectedSkills.every((skill) => student.skills.includes(skill)))
    // Add this filter to ensure students have at least one matching skill with the job
    .filter((student) => {
      // For each student, check if they have at least one skill that matches the job's required skills
      return job?.skills.some((jobSkill) =>
        student.skills.some(
          (studentSkill) =>
            studentSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
            jobSkill.toLowerCase().includes(studentSkill.toLowerCase()),
        ),
      )
    })
    // Sort by the number of matching skills first, then by match percentage
    .sort((a, b) => {
      if (!job) return 0
      // Count matching skills
      const aMatchingSkills = job.skills.filter((jobSkill) =>
        a.skills.some(
          (studentSkill) =>
            studentSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
            jobSkill.toLowerCase().includes(studentSkill.toLowerCase()),
        ),
      ).length

      const bMatchingSkills = job.skills.filter((jobSkill) =>
        b.skills.some(
          (studentSkill) =>
            studentSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
            jobSkill.toLowerCase().includes(studentSkill.toLowerCase()),
        ),
      ).length

      // If matching skills count is different, sort by that first
      if (bMatchingSkills !== aMatchingSkills) {
        return bMatchingSkills - aMatchingSkills
      }

      // Otherwise, sort by match percentage
      return b.match - a.match
    })

  if (!job) {
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
              <CardTitle>{t('hr.applicants.jobNotFound')}</CardTitle>
              <CardDescription>{t('hr.applicants.jobNotFoundDesc')}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push(`/${locale}/hr/dashboard`)} className="w-full">
                {t('hr.applicants.returnToDashboard')}
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
              <h1 className="text-3xl font-bold">{t('hr.applicants.title')}</h1>
              <p className="text-gray-500">
                {t('hr.applicants.subtitle')} <span className="font-medium">{job.title}</span>
              </p>
            </div>
            <Link href={`/${locale}/hr/dashboard`}>
              <Button variant="outline">{t('hr.applicants.backToDashboard')}</Button>
            </Link>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>
                {job.location} • {job.salary}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{job.description}</p>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 mb-6 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 ${locale === 'ar' ? 'right-3' : 'left-3'}`} />
              <Input
                placeholder={t('hr.applicants.searchPlaceholder')}
                className={locale === 'ar' ? 'pr-10' : 'pl-10'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={hiringStatus} onValueChange={setHiringStatus}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <SelectValue placeholder={t('hr.applicants.filterByStatus')} />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('hr.applicants.allStatuses')}</SelectItem>
                <SelectItem value="full-time">{t('hr.applicants.fullTimeOnly')}</SelectItem>
                <SelectItem value="part-time">{t('hr.applicants.partTimeOnly')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 mb-8 md:grid-cols-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">{t('hr.applicants.filters')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t('hr.applicants.matchPercentage')}</Label>
                    <span className="text-sm font-medium">{matchThreshold[0]}%+</span>
                  </div>
                  <Slider value={matchThreshold} onValueChange={setMatchThreshold} min={0} max={100} step={5} />
                </div>

                <div className="space-y-2">
                  <Label>{t('hr.applicants.requiredSkills')}</Label>
                  <div className="space-y-1">
                    {job.skills.map((skill, index) => (
                      <CheckboxItem
                        key={index}
                        id={`skill-${index}`}
                        label={skill}
                        checked={selectedSkills.includes(skill)}
                        onChange={(checked) => {
                          if (checked) {
                            setSelectedSkills([...selectedSkills, skill])
                          } else {
                            setSelectedSkills(selectedSkills.filter((s) => s !== skill))
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("")
                    setMatchThreshold([60])
                    setSelectedSkills([])
                    setHiringStatus("all")
                  }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {t('hr.applicants.resetFilters')}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4 md:col-span-3">
              <div className="flex items-center justify-between">
                <Select defaultValue="match">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('hr.applicants.sortBy')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">{t('hr.applicants.sortByMatch')}</SelectItem>
                    <SelectItem value="name">{t('hr.applicants.sortByName')}</SelectItem>
                    <SelectItem value="gpa">{t('hr.applicants.sortByGPA')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">{t('hr.applicants.allCandidates')}</TabsTrigger>
                  <TabsTrigger value="high-match">{t('hr.applicants.highMatches')}</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => <ApplicantCard key={student.id} student={student} job={job} locale={locale} t={t} />)
                  ) : (
                    <Card className="p-8 text-center">
                      <User className="w-12 h-12 mx-auto text-gray-300" />
                      <h3 className="mt-4 text-xl font-semibold">{t('hr.applicants.noCandidatesFound')}</h3>
                      <p className="mt-2 text-gray-500">{t('hr.applicants.noCandidatesDesc')}</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setSearchTerm("")
                          setMatchThreshold([60])
                          setSelectedSkills([])
                          setHiringStatus("all")
                        }}
                      >
                        {t('hr.applicants.resetFilters')}
                      </Button>
                    </Card>
                  )}
                </TabsContent>
                <TabsContent value="high-match" className="space-y-4">
                  {filteredStudents.filter((student) => student.match >= 80).length > 0 ? (
                    filteredStudents
                      .filter((student) => student.match >= 80)
                      .map((student) => <ApplicantCard key={student.id} student={student} job={job} locale={locale} t={t} />)
                  ) : (
                    <Card className="p-8 text-center">
                      <User className="w-12 h-12 mx-auto text-gray-300" />
                      <h3 className="mt-4 text-xl font-semibold">{t('hr.applicants.noHighMatchFound')}</h3>
                      <p className="mt-2 text-gray-500">{t('hr.applicants.noHighMatchDesc')}</p>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper components
function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-medium mb-1.5">{children}</div>
}

function CheckboxItem({
  id,
  label,
  checked,
  onChange,
}: { id: string; label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 border-gray-300 rounded text-black focus:ring-black"
      />
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
    </div>
  )
}

function ApplicantCard({ 
  student, 
  job, 
  locale, 
  t 
}: { 
  student: (typeof mockStudents)[0]; 
  job: (typeof mockJobs)[0]; 
  locale: string;
  t: any;
}) {
  const [expanded, setExpanded] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSendMessage = () => {
    setMessageSent(true)
    // In a real app, this would send a message to the student
  }

  const handleSendEmail = () => {
    setEmailSent(true)
    // In a real app, this would send an email to the student
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={student.name} />
                <AvatarFallback>
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{student.name}</h3>
                <p className="text-sm text-gray-500">{student.email}</p>
              </div>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-lg font-bold">
              {student.match}%
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {student.matchReasons.map((reason, index) => (
              <Badge key={index} variant="secondary">
                {reason}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <p className="text-sm font-medium w-full">{t('hr.applicants.matchingSkills')}</p>
            {getMatchingSkills(job.skills, student.skills).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">{t('hr.applicants.hiringStatus')}</p>
                <p className="text-sm">
                  {student.hiringStatus === "full-time"
                    ? t('hr.applicants.lookingFullTime')
                    : student.hiringStatus === "part-time"
                      ? t('hr.applicants.lookingPartTime')
                      : t('hr.applicants.notInterested')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">{t('hr.applicants.gpa')}</p>
                <p className="text-sm">{student.gpa}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <p className="text-sm font-medium w-full">{t('hr.applicants.skills')}</p>
            {student.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
          {expanded && (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm font-medium">{t('hr.applicants.interests')}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {student.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">{t('hr.applicants.dreamCompanies')}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {student.dreamCompanies.map((company, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">{t('hr.applicants.careerGoals')}</p>
                <p className="text-sm mt-1">{student.careerGoals}</p>
              </div>
              <div>
                <p className="text-sm font-medium">{t('hr.applicants.previousInternships')}</p>
                <p className="text-sm mt-1">{student.internships}</p>
              </div>
              <div>
                <p className="text-sm font-medium">{t('hr.applicants.certifications')}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {student.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mt-6">
            <Button variant="link" onClick={() => setExpanded(!expanded)}>
              {expanded ? t('hr.applicants.showLess') : t('hr.applicants.showMore')}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSendEmail} disabled={emailSent}>
                <Mail className="w-4 h-4 mr-2" />
                {emailSent ? t('hr.applicants.emailSent') : t('hr.applicants.sendEmail')}
              </Button>
              <Button size="sm" onClick={handleSendMessage} disabled={messageSent}>
                <MessageSquare className="w-4 h-4 mr-2" />
                {messageSent ? t('hr.applicants.messageSent') : t('hr.applicants.sendMessage')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
