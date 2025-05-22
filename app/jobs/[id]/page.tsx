"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/user-nav"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Building, MapPin, Calendar, DollarSign, Clock, BookmarkPlus, Check, Share2 } from "lucide-react"

// Mock job data
const mockJobs = [
  {
    id: 1,
    title: "Software Engineering Position",
    company: "TechCorp",
    location: "San Francisco, CA",
    description:
      "Join our engineering team to build cutting-edge web applications using React and Node.js. You'll work in an agile environment with a team of experienced developers to create innovative solutions for our clients. This role offers opportunities for professional growth and learning new technologies.",
    match: 92,
    tags: ["Skills match", "Goals match", "Merit match"],
    type: "Full-time",
    salary: "$80,000 - $100,000",
    postedDate: "2023-11-15",
    requirements: [
      "3+ years of experience with JavaScript, React, and Node.js",
      "Experience with RESTful APIs and database design",
      "Strong problem-solving skills and attention to detail",
      "Bachelor's degree in Computer Science or related field (or equivalent experience)",
      "Excellent communication and teamwork skills",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Health, dental, and vision insurance",
      "401(k) matching",
      "Flexible work hours and remote options",
      "Professional development budget",
      "Paid time off and parental leave",
    ],
    companyDescription:
      "TechCorp is a leading technology company specializing in web and mobile application development. We work with clients across various industries to deliver high-quality software solutions.",
  },
  {
    id: 2,
    title: "Data Science Role",
    company: "DataWorks",
    location: "Remote",
    description:
      "Work with our data science team to analyze large datasets and build predictive models. You'll collaborate with cross-functional teams to extract insights and drive business decisions through data.",
    match: 87,
    tags: ["Skills match", "Merit match"],
    type: "Full-time",
    salary: "$90,000 - $110,000",
    postedDate: "2023-11-20",
    requirements: [
      "Experience with Python, R, and SQL",
      "Knowledge of machine learning algorithms and statistical modeling",
      "Experience with data visualization tools",
      "Master's degree in Statistics, Computer Science, or related field preferred",
      "Strong analytical and problem-solving skills",
    ],
    benefits: [
      "Competitive salary",
      "Comprehensive health benefits",
      "Remote work flexibility",
      "Continuous learning opportunities",
      "Collaborative work environment",
    ],
    companyDescription:
      "DataWorks is a data analytics company that helps businesses make data-driven decisions through advanced analytics and machine learning solutions.",
  },
  // Additional job data would continue here...
]

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const jobId = Number.parseInt(params.id)
  const [savedJobs, setSavedJobs] = useState<number[]>([])
  const [appliedJobs, setAppliedJobs] = useState<number[]>([])

  // Find the job with the matching ID
  const job = mockJobs.find((job) => job.id === jobId)

  // Load saved jobs from localStorage on component mount
  useEffect(() => {
    const savedJobsFromStorage = localStorage.getItem("savedJobs")
    if (savedJobsFromStorage) {
      setSavedJobs(JSON.parse(savedJobsFromStorage))
    }

    const appliedJobsFromStorage = localStorage.getItem("appliedJobs")
    if (appliedJobsFromStorage) {
      setAppliedJobs(JSON.parse(appliedJobsFromStorage))
    }
  }, [])

  // Save to localStorage whenever savedJobs changes
  useEffect(() => {
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs))
  }, [savedJobs])

  // Save to localStorage whenever appliedJobs changes
  useEffect(() => {
    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs))
  }, [appliedJobs])

  const handleSaveJob = () => {
    if (!job) return

    if (savedJobs.includes(job.id)) {
      setSavedJobs(savedJobs.filter((id) => id !== job.id))
      toast({
        title: "Job removed from saved list",
        description: "The job has been removed from your saved jobs.",
      })
    } else {
      setSavedJobs([...savedJobs, job.id])
      toast({
        title: "Job saved",
        description: "The job has been added to your saved jobs.",
      })
    }
  }

  const handleApplyJob = () => {
    if (!job) return

    if (!appliedJobs.includes(job.id)) {
      setAppliedJobs([...appliedJobs, job.id])
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      })
    }
  }

  const handleShareJob = () => {
    if (!job) return

    // In a real app, this would open a share dialog
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied",
      description: "Job link has been copied to clipboard.",
    })
  }

  if (!job) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container flex items-center justify-between h-16 mx-auto">
            <h1 className="text-xl font-bold">JobMatch</h1>
            <UserNav />
          </div>
        </header>
        <div className="flex items-center justify-center flex-1 bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Job Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The job you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => router.push("/jobs")} className="mt-4 w-full">
                Browse All Jobs
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
        <div className="container flex items-center justify-between h-16 mx-auto">
          <h1 className="text-xl font-bold">JobMatch</h1>
          <UserNav />
        </div>
      </header>
      <div className="flex-1 py-6 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.push("/jobs")} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
            </Button>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Posted on {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {job.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="font-bold">
                    {job.match}% Match
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                <Button onClick={handleApplyJob} disabled={appliedJobs.includes(job.id)}>
                  {appliedJobs.includes(job.id) ? (
                    <>
                      <Check className="w-4 h-4 mr-2" /> Applied
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </Button>
                <Button variant="outline" onClick={handleSaveJob}>
                  {savedJobs.includes(job.id) ? (
                    <>
                      <Check className="w-4 h-4 mr-2" /> Saved
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4 mr-2" /> Save
                    </>
                  )}
                </Button>
                <Button variant="ghost" onClick={handleShareJob}>
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{job.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="pl-5 space-y-2 list-disc">
                    {job.requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="pl-5 space-y-2 list-disc">
                    {job.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {job.company}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{job.companyDescription}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Why You Match</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Overall Match</span>
                        <span className="text-sm font-bold">{job.match}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-black rounded-full" style={{ width: `${job.match}%` }}></div>
                      </div>
                    </div>
                    {job.tags.includes("Skills match") && (
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Your skills match the job requirements</span>
                      </div>
                    )}
                    {job.tags.includes("Goals match") && (
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>This aligns with your career goals</span>
                      </div>
                    )}
                    {job.tags.includes("Merit match") && (
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Your qualifications are a good fit</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Similar Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockJobs
                      .filter((j) => j.id !== job.id)
                      .slice(0, 3)
                      .map((similarJob) => (
                        <Link key={similarJob.id} href={`/jobs/${similarJob.id}`} className="block">
                          <div className="p-3 transition-colors border rounded-lg hover:bg-gray-100">
                            <h3 className="font-medium">{similarJob.title}</h3>
                            <p className="text-sm text-gray-500">
                              {similarJob.company} • {similarJob.location}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="outline" className="text-xs">
                                {similarJob.match}% Match
                              </Badge>
                              <span className="text-xs text-gray-500">{similarJob.type}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button onClick={handleApplyJob} size="lg" disabled={appliedJobs.includes(job.id)}>
              {appliedJobs.includes(job.id) ? (
                <>
                  <Check className="w-5 h-5 mr-2" /> Applied
                </>
              ) : (
                "Apply for this Position"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
