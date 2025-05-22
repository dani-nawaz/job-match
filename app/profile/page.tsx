"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/user-nav"
import { MultiSelect } from "@/components/multi-select"
import { ResumeUpload } from "@/components/resume-upload"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Basic Info
  const [name, setName] = useState("Alex Johnson")
  const [email, setEmail] = useState("alex.johnson@example.com")

  // Skills & Interests
  const [skills, setSkills] = useState<string[]>(["JavaScript", "React", "Node.js"])
  const [interests, setInterests] = useState<string[]>(["Web Development", "Machine Learning"])

  // Aspirations
  const [dreamCompanies, setDreamCompanies] = useState<string[]>(["Google", "Microsoft"])
  const [careerGoals, setCareerGoals] = useState(
    "I want to become a full-stack developer working on innovative products that make a difference.",
  )

  // Merit Info
  const [gpa, setGpa] = useState("3.8")
  const [internships, setInternships] = useState("Summer Web Developer at LocalTech")
  const [certifications, setCertifications] = useState<string[]>(["AWS Certified Developer", "Google Cloud Associate"])

  // Hiring Status
  const [hiringStatus, setHiringStatus] = useState("part-time")

  const handleSave = () => {
    setIsLoading(true)

    // Simulate saving profile
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  // Available options for multi-select
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
  ]

  const interestOptions = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Cybersecurity",
    "Blockchain",
    "Game Development",
    "IoT",
    "AR/VR",
    "Product Management",
    "UX Research",
    "Digital Marketing",
    "E-commerce",
  ]

  const companyOptions = [
    "Google",
    "Microsoft",
    "Apple",
    "Amazon",
    "Facebook",
    "Netflix",
    "Tesla",
    "IBM",
    "Intel",
    "Adobe",
    "Salesforce",
    "Twitter",
    "Spotify",
    "Airbnb",
  ]

  const certificationOptions = [
    "AWS Certified Developer",
    "AWS Solutions Architect",
    "Google Cloud Associate",
    "Microsoft Azure Fundamentals",
    "CompTIA A+",
    "CompTIA Network+",
    "CompTIA Security+",
    "Cisco CCNA",
    "PMP",
    "Scrum Master",
    "Oracle Certified Professional",
    "MongoDB Certified Developer",
  ]

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
              <h1 className="text-3xl font-bold">Your Profile</h1>
              <p className="text-gray-500">Complete your profile to get better internship matches</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="basic-info" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              <TabsTrigger value="skills-interests">Skills & Interests</TabsTrigger>
              <TabsTrigger value="aspirations">Aspirations</TabsTrigger>
              <TabsTrigger value="merit">Merit Info</TabsTrigger>
              <TabsTrigger value="resume">Resume</TabsTrigger>
            </TabsList>

            <TabsContent value="basic-info">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="hiring-status">Hiring Status</Label>
                    <Select value={hiringStatus} onValueChange={setHiringStatus}>
                      <SelectTrigger id="hiring-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Looking for Full-time</SelectItem>
                        <SelectItem value="part-time">Looking for Part-time</SelectItem>
                        <SelectItem value="not-interested">Not Currently Interested</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills-interests">
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Interests</CardTitle>
                  <CardDescription>Tell us about your skills and what you're interested in</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="skills">Skills</Label>
                    <MultiSelect
                      options={skillOptions.map((skill) => ({ label: skill, value: skill }))}
                      selected={skills}
                      onChange={setSkills}
                      placeholder="Select skills..."
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="interests">Interests</Label>
                    <MultiSelect
                      options={interestOptions.map((interest) => ({ label: interest, value: interest }))}
                      selected={interests}
                      onChange={setInterests}
                      placeholder="Select interests..."
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {interests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aspirations">
              <Card>
                <CardHeader>
                  <CardTitle>Aspirations</CardTitle>
                  <CardDescription>Share your career goals and dream companies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dream-companies">Dream Companies</Label>
                    <MultiSelect
                      options={companyOptions.map((company) => ({ label: company, value: company }))}
                      selected={dreamCompanies}
                      onChange={setDreamCompanies}
                      placeholder="Select companies..."
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {dreamCompanies.map((company) => (
                        <Badge key={company} variant="secondary">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="career-goals">Career Goals</Label>
                    <Textarea
                      id="career-goals"
                      value={careerGoals}
                      onChange={(e) => setCareerGoals(e.target.value)}
                      placeholder="Describe your career goals..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="merit">
              <Card>
                <CardHeader>
                  <CardTitle>Merit Information</CardTitle>
                  <CardDescription>Add details about your academic achievements and experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="gpa">GPA</Label>
                    <Input id="gpa" value={gpa} onChange={(e) => setGpa(e.target.value)} placeholder="e.g., 3.5" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="internships">Previous Internships</Label>
                    <Textarea
                      id="internships"
                      value={internships}
                      onChange={(e) => setInternships(e.target.value)}
                      placeholder="List your previous internships..."
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="certifications">Certifications</Label>
                    <MultiSelect
                      options={certificationOptions.map((cert) => ({ label: cert, value: cert }))}
                      selected={certifications}
                      onChange={setCertifications}
                      placeholder="Select certifications..."
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {certifications.map((cert) => (
                        <Badge key={cert} variant="secondary">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resume">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Upload</CardTitle>
                  <CardDescription>
                    Upload your resume to automatically fill in your profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResumeUpload />
                </CardContent>
                <CardFooter className="border-t bg-gray-50">
                  <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX. Maximum file size: 5MB.</p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
