"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/multi-select"
import { ResumeUpload } from "@/components/resume-upload"
import { Progress } from "@/components/ui/progress"

export default function ProfileSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  // Basic Info
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  // Skills & Interests
  const [skills, setSkills] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])

  // Aspirations
  const [dreamCompanies, setDreamCompanies] = useState<string[]>([])
  const [careerGoals, setCareerGoals] = useState("")

  // Merit Info
  const [gpa, setGpa] = useState("")
  const [internships, setInternships] = useState("")
  const [certifications, setCertifications] = useState<string[]>([])

  // Hiring Status
  const [hiringStatus, setHiringStatus] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsLoading(true)

    // Simulate profile creation
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-3xl p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Set Up Your Profile</CardTitle>
            <CardDescription>Complete your profile to get personalized internship recommendations</CardDescription>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  Step {currentStep} of {totalSteps}
                </span>
                <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
              </div>
              <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                  />
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
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Skills & Interests</h2>
                <div className="grid gap-2">
                  <Label htmlFor="skills">Skills</Label>
                  <MultiSelect
                    options={skillOptions.map((skill) => ({ label: skill, value: skill }))}
                    selected={skills}
                    onChange={setSkills}
                    placeholder="Select skills..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="interests">Interests</Label>
                  <MultiSelect
                    options={interestOptions.map((interest) => ({ label: interest, value: interest }))}
                    selected={interests}
                    onChange={setInterests}
                    placeholder="Select interests..."
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Aspirations</h2>
                <div className="grid gap-2">
                  <Label htmlFor="dream-companies">Dream Companies</Label>
                  <MultiSelect
                    options={companyOptions.map((company) => ({ label: company, value: company }))}
                    selected={dreamCompanies}
                    onChange={setDreamCompanies}
                    placeholder="Select companies..."
                  />
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
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Merit Information</h2>
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
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Resume Upload</h2>
                <p className="text-gray-500">Upload your resume to automatically fill in your profile information</p>
                <ResumeUpload />
                <div className="p-4 mt-4 border rounded-md bg-gray-50">
                  <h3 className="font-medium">What happens when you upload your resume?</h3>
                  <ul className="mt-2 ml-6 text-sm text-gray-500 list-disc">
                    <li>We'll extract your skills, experience, and education</li>
                    <li>Your profile will be automatically updated</li>
                    <li>You can always edit the extracted information</li>
                    <li>Your resume will be stored securely</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={isLoading}>
              {currentStep === totalSteps ? (isLoading ? "Completing..." : "Complete Setup") : "Next Step"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
