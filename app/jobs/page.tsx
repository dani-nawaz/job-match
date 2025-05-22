"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { UserNav } from "@/components/user-nav"
import { Search, Filter, MapPin, Building, Briefcase, BookmarkPlus, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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
  {
    id: 4,
    title: "Frontend Developer",
    company: "WebSolutions",
    location: "Boston, MA",
    description: "Build responsive and accessible user interfaces using modern frontend technologies.",
    match: 83,
    tags: ["Skills match", "New"],
    type: "Contract",
    salary: "$50/hr",
    postedDate: "2023-11-25",
  },
  {
    id: 5,
    title: "Product Manager",
    company: "ProductLabs",
    location: "Chicago, IL",
    description: "Work with cross-functional teams to define product requirements and roadmaps.",
    match: 76,
    tags: ["Goals match", "New"],
    type: "Full-time",
    salary: "$100,000 - $120,000",
    postedDate: "2023-11-22",
  },
  {
    id: 6,
    title: "Backend Developer",
    company: "ServerTech",
    location: "Seattle, WA",
    description: "Develop scalable backend services and APIs using Java and Spring Boot.",
    match: 81,
    tags: ["Skills match", "Merit match"],
    type: "Full-time",
    salary: "$85,000 - $105,000",
    postedDate: "2023-11-18",
  },
  {
    id: 7,
    title: "Machine Learning Engineer",
    company: "AIStartup",
    location: "Austin, TX",
    description: "Research and implement machine learning algorithms for computer vision applications.",
    match: 85,
    tags: ["Skills match", "Goals match"],
    type: "Full-time",
    salary: "$95,000 - $115,000",
    postedDate: "2023-11-12",
  },
  {
    id: 8,
    title: "DevOps Engineer",
    company: "CloudOps",
    location: "Remote",
    description: "Help automate deployment pipelines and infrastructure management.",
    match: 72,
    tags: ["Skills match"],
    type: "Contract",
    salary: "$60/hr",
    postedDate: "2023-11-05",
  },
  {
    id: 9,
    title: "Mobile Developer",
    company: "AppFactory",
    location: "Los Angeles, CA",
    description: "Develop mobile applications for iOS and Android using React Native.",
    match: 79,
    tags: ["Skills match", "Goals match"],
    type: "Full-time",
    salary: "$85,000 - $100,000",
    postedDate: "2023-11-08",
  },
  {
    id: 10,
    title: "Cybersecurity Analyst",
    company: "SecureTech",
    location: "Washington, DC",
    description: "Assist in identifying and addressing security vulnerabilities in web applications.",
    match: 68,
    tags: ["Merit match"],
    type: "Full-time",
    salary: "$90,000 - $110,000",
    postedDate: "2023-11-01",
  },
  {
    id: 11,
    title: "Data Engineer",
    company: "DataFlow",
    location: "Denver, CO",
    description: "Build data pipelines and ETL processes for big data applications.",
    match: 74,
    tags: ["Skills match"],
    type: "Full-time",
    salary: "$85,000 - $105,000",
    postedDate: "2023-11-03",
  },
  {
    id: 12,
    title: "Full Stack Developer",
    company: "StackWorks",
    location: "Portland, OR",
    description: "Develop full stack web applications using modern JavaScript frameworks.",
    match: 89,
    tags: ["Skills match", "Goals match", "Merit match"],
    type: "Full-time",
    salary: "$90,000 - $110,000",
    postedDate: "2023-11-17",
  },
]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [matchThreshold, setMatchThreshold] = useState([60])
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

  const handleSaveJob = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId))
      toast({
        title: "Job removed from saved list",
        description: "The job has been removed from your saved jobs.",
      })
    } else {
      setSavedJobs([...savedJobs, jobId])
      toast({
        title: "Job saved",
        description: "The job has been added to your saved jobs.",
      })
    }
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

  // Filter jobs based on search term, location, and match threshold
  const filteredJobs = mockJobs
    .filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter(
      (job) =>
        locationFilter === "all" ||
        (locationFilter === "remote" && job.location === "Remote") ||
        (locationFilter !== "remote" && job.location.includes(locationFilter)),
    )
    .filter((job) => job.match >= matchThreshold[0])
    .sort((a, b) => b.match - a.match)

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
              <h1 className="text-3xl font-bold">Recommended Jobs</h1>
              <p className="text-gray-500">Personalized matches based on your profile</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search by title, company, or keyword"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <SelectValue placeholder="Filter by location" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote Only</SelectItem>
                <SelectItem value="San Francisco">San Francisco</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Seattle">Seattle</SelectItem>
                <SelectItem value="Austin">Austin</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 mb-8 md:grid-cols-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Match Percentage</Label>
                    <span className="text-sm font-medium">{matchThreshold[0]}%+</span>
                  </div>
                  <Slider value={matchThreshold} onValueChange={setMatchThreshold} min={0} max={100} step={5} />
                </div>

                <div className="space-y-2">
                  <Label>Match Criteria</Label>
                  <div className="space-y-1">
                    <CheckboxItem id="skills-match" label="Skills Match" defaultChecked />
                    <CheckboxItem id="goals-match" label="Goals Match" defaultChecked />
                    <CheckboxItem id="merit-match" label="Merit Match" defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <div className="space-y-1">
                    <CheckboxItem id="full-time" label="Full-time" defaultChecked />
                    <CheckboxItem id="part-time" label="Part-time" defaultChecked />
                    <CheckboxItem id="contract" label="Contract" defaultChecked />
                    <CheckboxItem id="internship" label="Internship" defaultChecked />
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("")
                    setLocationFilter("all")
                    setMatchThreshold([60])
                  }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4 md:col-span-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {filteredJobs.length} of {mockJobs.length} jobs
                </p>
                <Select defaultValue="match">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">Match % (High to Low)</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="company">Company Name</SelectItem>
                  </SelectContent>
                </Select>
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
                          <Button variant="ghost" className="w-full mt-2" onClick={() => handleSaveJob(job.id)}>
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
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Briefcase className="w-12 h-12 mx-auto text-gray-300" />
                  <h3 className="mt-4 text-xl font-semibold">No matches found</h3>
                  <p className="mt-2 text-gray-500">Try adjusting your filters or search terms to find more jobs.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("")
                      setLocationFilter("all")
                      setMatchThreshold([60])
                    }}
                  >
                    Reset Filters
                  </Button>
                </Card>
              )}
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

function CheckboxItem({ id, label, defaultChecked = false }: { id: string; label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        defaultChecked={defaultChecked}
        className="w-4 h-4 border-gray-300 rounded text-black focus:ring-black"
      />
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
    </div>
  )
}
