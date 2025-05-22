"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { UserNav } from "@/components/user-nav"
import { useToast } from "@/components/ui/use-toast"
import { Search, Building, MapPin, Briefcase, Check, Trash2 } from "lucide-react"

// Mock job data
const mockJobs = [
  {
    id: 1,
    title: "Software Engineering Position",
    company: "TechCorp",
    location: "San Francisco, CA",
    description: "Join our engineering team to build cutting-edge web applications using React and Node.js.",
    match: 92,
    tags: ["Skills match", "Goals match", "Merit match"],
    type: "Full-time",
    salary: "$80,000 - $100,000",
    postedDate: "2023-11-15",
  },
  {
    id: 2,
    title: "Data Science Role",
    company: "DataWorks",
    location: "Remote",
    description: "Work with our data science team to analyze large datasets and build predictive models.",
    match: 87,
    tags: ["Skills match", "Merit match"],
    type: "Full-time",
    salary: "$90,000 - $110,000",
    postedDate: "2023-11-20",
  },
  {
    id: 3,
    title: "UX Designer",
    company: "DesignHub",
    location: "New York, NY",
    description: "Create user-centered designs for web and mobile applications.",
    match: 78,
    tags: ["Goals match", "Skills match"],
    type: "Full-time",
    salary: "$75,000 - $95,000",
    postedDate: "2023-11-10",
  },
  // Additional job data would continue here...
]

export default function SavedJobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [savedJobs, setSavedJobs] = useState<number[]>([])
  const [appliedJobs, setAppliedJobs] = useState<number[]>([])
  const { toast } = useToast()

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

  const handleRemoveJob = (jobId: number) => {
    setSavedJobs(savedJobs.filter((id) => id !== jobId))
    toast({
      title: "Job removed",
      description: "The job has been removed from your saved jobs.",
    })
  }

  const handleApplyJob = (jobId: number) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs([...appliedJobs, jobId])
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      })
    }
  }

  // Filter saved jobs based on search term
  const filteredJobs = mockJobs
    .filter((job) => savedJobs.includes(job.id))
    .filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Saved Jobs</h1>
              <p className="text-gray-500">Jobs you've saved for later</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search saved jobs"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/jobs/${job.id}`} className="hover:underline">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1 text-gray-500">
                            <Building className="w-4 h-4" />
                            <span>{job.company}</span>
                            <span>•</span>
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>{job.type}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="px-3 py-1 text-lg font-bold">
                          {job.match}%
                        </Badge>
                      </div>
                      <p className="mt-4 text-gray-600">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {job.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-row justify-between p-4 border-t md:flex-col md:border-t-0 md:border-l md:p-6 md:w-48 bg-gray-50">
                      <Link href={`/jobs/${job.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        className="w-full mt-2"
                        onClick={() => handleApplyJob(job.id)}
                        disabled={appliedJobs.includes(job.id)}
                      >
                        {appliedJobs.includes(job.id) ? (
                          <>
                            <Check className="w-4 h-4 mr-2" /> Applied
                          </>
                        ) : (
                          "Apply Now"
                        )}
                      </Button>
                      <Button variant="ghost" className="w-full mt-2" onClick={() => handleRemoveJob(job.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Briefcase className="w-12 h-12 mx-auto text-gray-300" />
              <h3 className="mt-4 text-xl font-semibold">No saved jobs</h3>
              <p className="mt-2 text-gray-500">
                You haven't saved any jobs yet. Browse jobs and click the "Save" button to add them here.
              </p>
              <Link href="/jobs">
                <Button className="mt-4">Browse Jobs</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
