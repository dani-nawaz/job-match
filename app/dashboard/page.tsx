"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { UserNav } from "@/components/user-nav"

export default function DashboardPage() {
  const [profileCompletion, setProfileCompletion] = useState(65)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 mx-auto">
          <h1 className="text-xl font-bold">JobMatch</h1>
          <UserNav />
        </div>
      </header>
      <div className="flex-1 py-6 bg-gray-50">
        <div className="container grid gap-6 px-4 mx-auto md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-full">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-gray-500">Here's what's happening with your job search</p>
          </div>

          <Card className="col-span-full md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Profile Completion</CardTitle>
                <CardDescription>Complete your profile to get better matches</CardDescription>
              </div>
              <Link href="/profile">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{profileCompletion}% complete</span>
                  <span className="text-sm text-gray-500">7/10 sections</span>
                </div>
                <Progress value={profileCompletion} className="h-2" />
                <div className="grid gap-2 mt-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Basic Information</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Skills</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Interests</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Resume Upload</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Career Goals</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Dream Companies</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Match Statistics</CardTitle>
              <CardDescription>Your job matching overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Matches</span>
                  <span className="font-bold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">High Match Rate &gt;80% </span>
                  <span className="font-bold">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">New This Week</span>
                  <span className="font-bold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Saved Jobs</span>
                  <span className="font-bold">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Applied Jobs</span>
                  <span className="font-bold">2</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-4">
                  <Link href="/jobs">
                    <Button className="w-full">View Jobs</Button>
                  </Link>
                  <Link href="/saved-jobs">
                    <Button variant="outline" className="w-full">
                      Saved Jobs
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Recent Matches</CardTitle>
              <CardDescription>Your latest job opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="high-match">High Match</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  {[
                    {
                      id: 1,
                      title: "Software Engineering Position",
                      company: "TechCorp",
                      location: "San Francisco, CA",
                      match: 92,
                      tags: ["Skills match", "Goals match", "Merit match"],
                    },
                    {
                      id: 2,
                      title: "Data Science Role",
                      company: "DataWorks",
                      location: "Remote",
                      match: 87,
                      tags: ["Skills match", "Merit match"],
                    },
                    {
                      id: 3,
                      title: "UX Designer",
                      company: "DesignHub",
                      location: "New York, NY",
                      match: 78,
                      tags: ["Goals match", "Skills match"],
                    },
                  ].map((job) => (
                    <div key={job.id} className="p-4 border rounded">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/jobs/${job.id}`} className="hover:underline">
                            <h3 className="font-semibold">{job.title}</h3>
                          </Link>
                          <p className="text-sm text-gray-500">
                            {job.company} • {job.location}
                          </p>
                        </div>
                        <Badge variant="outline" className="px-2 py-1 font-bold">
                          {job.match}% Match
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-end mt-3">
                        <Link href={`/jobs/${job.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  <div className="text-center">
                    <Link href="/jobs">
                      <Button variant="outline">View All Jobs</Button>
                    </Link>
                  </div>
                </TabsContent>
                <TabsContent value="high-match" className="space-y-4">
                  {[
                    {
                      id: 1,
                      title: "Software Engineering Position",
                      company: "TechCorp",
                      location: "San Francisco, CA",
                      match: 92,
                      tags: ["Skills match", "Goals match", "Merit match"],
                    },
                    {
                      id: 2,
                      title: "Data Science Role",
                      company: "DataWorks",
                      location: "Remote",
                      match: 87,
                      tags: ["Skills match", "Merit match"],
                    },
                  ].map((job) => (
                    <div key={job.id} className="p-4 border rounded">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/jobs/${job.id}`} className="hover:underline">
                            <h3 className="font-semibold">{job.title}</h3>
                          </Link>
                          <p className="text-sm text-gray-500">
                            {job.company} • {job.location}
                          </p>
                        </div>
                        <Badge variant="outline" className="px-2 py-1 font-bold">
                          {job.match}% Match
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-end mt-3">
                        <Link href={`/jobs/${job.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="new" className="space-y-4">
                  {[
                    {
                      id: 4,
                      title: "Frontend Developer",
                      company: "WebSolutions",
                      location: "Boston, MA",
                      match: 83,
                      tags: ["Skills match", "New"],
                    },
                    {
                      id: 5,
                      title: "Product Manager",
                      company: "ProductLabs",
                      location: "Chicago, IL",
                      match: 76,
                      tags: ["Goals match", "New"],
                    },
                  ].map((job) => (
                    <div key={job.id} className="p-4 border rounded">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/jobs/${job.id}`} className="hover:underline">
                            <h3 className="font-semibold">{job.title}</h3>
                          </Link>
                          <p className="text-sm text-gray-500">
                            {job.company} • {job.location}
                          </p>
                        </div>
                        <Badge variant="outline" className="px-2 py-1 font-bold">
                          {job.match}% Match
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-end mt-3">
                        <Link href={`/jobs/${job.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
