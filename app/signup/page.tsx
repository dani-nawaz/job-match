"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"university" | "hr">("university")
  const [companyName, setCompanyName] = useState("")
  const [universityName, setUniversityName] = useState("")
  const [universityLocation, setUniversityLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // Create user in auth with email confirmation disabled for development
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            company_name: role === "hr" ? companyName : null,
          },
          // This would normally be handled by email confirmation
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setErrorMessage(error.message)
        throw error
      }

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: fullName,
          email,
          role,
          company_name: role === "hr" ? companyName : null,
        })

        if (profileError) {
          setErrorMessage(profileError.message)
          throw profileError
        }

        // If university role, create university record
        if (role === "university") {
          const { error: universityError } = await supabase.from("universities").insert({
            name: universityName,
            location: universityLocation,
            admin_id: data.user.id,
            description: `${universityName} is a university located in ${universityLocation}.`,
          })

          if (universityError) {
            setErrorMessage(universityError.message)
            throw universityError
          }
        }

        // For development: Auto-login after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          toast({
            title: "Account created",
            description:
              "Your account has been created. Please check your email to confirm your account before logging in.",
          })
          router.push("/login")
        } else {
          toast({
            title: "Account created",
            description: "Your account has been created and you've been automatically logged in.",
          })

          if (role === "university") {
            router.push("/university/students/upload")
          } else {
            router.push("/hr/jobs/create")
          }
        }
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      // Error is handled above
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">InternMatch</h1>
          <p className="mt-2 text-gray-600">Connecting universities and companies with AI-powered matching</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignup}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Account Type</Label>
                  <RadioGroup
                    value={role}
                    onValueChange={(value) => setRole(value as "university" | "hr")}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="university" id="university" />
                      <Label htmlFor="university">University</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hr" id="hr" />
                      <Label htmlFor="hr">HR / Company</Label>
                    </div>
                  </RadioGroup>
                </div>

                {role === "university" ? (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="universityName">University Name</Label>
                      <Input
                        id="universityName"
                        value={universityName}
                        onChange={(e) => setUniversityName(e.target.value)}
                        placeholder="Stanford University"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="universityLocation">University Location</Label>
                      <Input
                        id="universityLocation"
                        value={universityLocation}
                        onChange={(e) => setUniversityLocation(e.target.value)}
                        placeholder="Stanford, CA"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Inc."
                      required
                    />
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
