"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HRNav } from "@/components/hr-nav"

export default function HRProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Basic Info
  const [name, setName] = useState("Sarah Miller")
  const [companyName, setCompanyName] = useState("TechCorp")
  const [email, setEmail] = useState("sarah.miller@techcorp.com")
  const [jobTitle, setJobTitle] = useState("Talent Acquisition Specialist")

  const handleSave = () => {
    setIsLoading(true)

    // Simulate saving profile
    setTimeout(() => {
      setIsLoading(false)
      router.push("/hr/dashboard")
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 mx-auto">
          <h1 className="text-xl font-bold">JobMatch</h1>
          <HRNav />
        </div>
      </header>
      <div className="flex-1 py-6 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Your Profile</h1>
              <p className="text-gray-500">Manage your HR profile information</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/hr/dashboard")}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and company information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input id="job-title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
