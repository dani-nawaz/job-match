"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function HRProfileSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 2

  // Basic Info
  const [name, setName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [jobTitle, setJobTitle] = useState("")

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
      router.push("/hr/dashboard")
    }, 1000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-3xl p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Set Up Your HR Profile</CardTitle>
            <CardDescription>Complete your profile to start posting jobs and finding candidates</CardDescription>
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
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sarah Miller" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.miller@techcorp.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input
                    id="job-title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Talent Acquisition Specialist"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Company Information</h2>
                <div className="grid gap-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="TechCorp"
                  />
                </div>
                <div className="p-4 mt-4 border rounded-md bg-gray-50">
                  <h3 className="font-medium">What happens after setup?</h3>
                  <ul className="mt-2 ml-6 text-sm text-gray-500 list-disc">
                    <li>You'll be able to post job listings</li>
                    <li>View and contact qualified candidates</li>
                    <li>Manage your recruitment process</li>
                    <li>Receive notifications about new applicants</li>
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
