"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { HRNav } from "@/components/hr-nav"
import { Search, Filter, MapPin, Building, Briefcase } from "lucide-react"

// Mock internship data
const mockInternships = [
  {
    id: 1,
    title: "Software Engineering Intern",
    company: "TechCorp",
    location: "San Francisco, CA",
    description: "Join our engineering team to build cutting-edge web applications using React and Node.js.",
    match: 92,
    tags: ["Skills match", "Goals match", "Merit match"],
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "DataWorks",
    location: "Remote",
    description: "Work with our data science team to analyze large datasets and build predictive models.",
    match: 87,
    tags: ["Skills match", "Merit match"],
  },
  {
    id: 3,
    title: "UX Design Intern",
    company: "DesignHub",
    location: "New York, NY",
    description: "Create user-centered designs for web and mobile applications.",
    match: 78,
    tags: ["Goals match", "Skills match"],
  },
  {
    id: 4,
    title: "Frontend Developer Intern",
    company: "WebSolutions",
    location: "Boston, MA",
    description: "Build responsive and accessible user interfaces using modern frontend technologies.",
    match: 83,
    tags: ["Skills match", "New"],
  },
  {
    id: 5,
    title: "Product Management Intern",
    company: "ProductLabs",
    location: "Chicago, IL",
    description: "Work with cross-functional teams to define product requirements and roadmaps.",
    match: 76,
    tags: ["Goals match", "New"],
  },
  {
    id: 6,
    title: "Backend Developer Intern",
    company: "ServerTech",
    location: "Seattle, WA",
    description: "Develop scalable backend services and APIs using Java and Spring Boot.",
    match: 81,
    tags: ["Skills match", "Merit match"],
  },
  {
    id: 7,
    title: "Machine Learning Intern",
    company: "AIStartup",
    location: "Austin, TX",
    description: "Research and implement machine learning algorithms for computer vision applications.",
    match: 85,
    tags: ["Skills match", "Goals match"],
  },
  {
    id: 8,
    title: "DevOps Intern",
    company: "CloudOps",
    location: "Remote",
    description: "Help automate deployment pipelines and infrastructure management.",
    match: 72,
    tags: ["Skills match"],
  },
  {
    id: 9,
    title: "Mobile Developer Intern",
    company: "AppFactory",
    location: "Los Angeles, CA",
    description: "Develop mobile applications for iOS and Android using React Native.",
    match: 79,
    tags: ["Skills match", "Goals match"],
  },
  {
    id: 10,
    title: "Cybersecurity Intern",
    company: "SecureTech",
    location: "Washington, DC",
    description: "Assist in identifying and addressing security vulnerabilities in web applications.",
    match: 68,
    tags: ["Merit match"],
  },
  {
    id: 11,
    title: "Data Engineering Intern",
    company: "DataFlow",
    location: "Denver, CO",
    description: "Build data pipelines and ETL processes for big data applications.",
    match: 74,
    tags: ["Skills match"],
  },
  {
    id: 12,
    title: "Full Stack Developer Intern",
    company: "StackWorks",
    location: "Portland, OR",
    description: "Develop full stack web applications using modern JavaScript frameworks.",
    match: 89,
    tags: ["Skills match", "Goals match", "Merit match"],
  },
]

export default function RecommendationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [matchThreshold, setMatchThreshold] = useState([60])

  // Filter internships based on search term, location, and match threshold
  const filteredInternships = mockInternships
    .filter(
      (internship) =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter(
      (internship) =>
        locationFilter === "all" ||
        (locationFilter === "remote" && internship.location === "Remote") ||
        (locationFilter !== "remote" && internship.location.includes(locationFilter)),
    )
    .filter((internship) => internship.match >= matchThreshold[0])
    .sort((a, b) => b.match - a.match)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 mx-auto">
          <h1 className="text-xl font-bold">InternMatch</h1>
          <HRNav />
        </div>
      </header>
      <div className="flex-1 py-6 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Recommended Internships</h1>
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
          {/*
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
                  <Label>Internship Type</Label>
                  <div className="space-y-1">
                    <CheckboxItem id="summer" label="Summer Internship" defaultChecked />
                    <CheckboxItem id="fall" label="Fall Internship" defaultChecked />
                    <CheckboxItem id="spring" label="Spring Internship" defaultChecked />
                    <CheckboxItem id="year-round" label="Year-round" defaultChecked />
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
*/}
            <div className="space-y-4 md:col-span-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {filteredInternships.length} of {mockInternships.length} internships
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

              {filteredInternships.length > 0 ? (
                <div className="space-y-4">
                  {filteredInternships.map((internship) => (
                    <Card key={internship.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold">{internship.title}</h3>
                              <div className="flex items-center gap-2 mt-1 text-gray-500">
                                <Building className="w-4 h-4" />
                                <span>{internship.company}</span>
                                <span>•</span>
                                <MapPin className="w-4 h-4" />
                                <span>{internship.location}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className="px-3 py-1 text-lg font-bold">
                              {internship.match}%
                            </Badge>
                          </div>
                          <p className="mt-4 text-gray-600">{internship.description}</p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {internship.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-row justify-between p-4 border-t md:flex-col md:border-t-0 md:border-l md:p-6 md:w-48 bg-gray-50">
                          <Button className="w-full">View Details</Button>
                          <Button variant="outline" className="w-full mt-2">
                            Save
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
                  <p className="mt-2 text-gray-500">
                    Try adjusting your filters or search terms to find more internships.
                  </p>
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
