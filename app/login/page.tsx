"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showResendConfirmation, setShowResendConfirmation] = useState(false)
  const supabase = getSupabaseBrowserClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)
    setShowResendConfirmation(false)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Check if the error is due to email not being confirmed
        if (error.message.includes("Email not confirmed")) {
          setShowResendConfirmation(true)
          setErrorMessage(
            "Your email has not been confirmed. Please check your inbox or click below to resend the confirmation email.",
          )
        } else {
          setErrorMessage(error.message)
        }
        throw error
      }

      if (data.user) {
        // Fetch user profile to determine role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          throw profileError
        }

        // Redirect based on role
        if (profile.role === "university") {
          router.push("/university/dashboard")
        } else if (profile.role === "hr") {
          router.push("/hr/dashboard")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (error: any) {
      console.error("Login error:", error)
      // Error is handled above
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Confirmation email sent",
        description: "Please check your inbox for the confirmation email.",
      })
    } catch (error: any) {
      toast({
        title: "Failed to resend confirmation",
        description: error.message || "An error occurred while resending the confirmation email.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // For development: Auto-confirm email
  const handleDevConfirm = async () => {
    setIsLoading(true)
    try {
      // This is a workaround for development only
      // In production, you would use proper email confirmation
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Try to sign up again with the same credentials
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              email_confirmed: true,
            },
          },
        })

        if (signUpError) {
          throw signUpError
        }

        toast({
          title: "Development mode",
          description: "Account confirmed for development. Please try logging in again.",
        })
      } else if (data.user) {
        // User exists and can sign in
        // Fetch user profile to determine role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          throw profileError
        }

        // Redirect based on role
        if (profile.role === "university") {
          router.push("/university/dashboard")
        } else if (profile.role === "hr") {
          router.push("/hr/dashboard")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (error: any) {
      toast({
        title: "Development confirmation failed",
        description: error.message || "An error occurred during development confirmation",
        variant: "destructive",
      })
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
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                {showResendConfirmation && (
                  <div className="mt-2 flex flex-col gap-2">
                    <Button variant="outline" onClick={handleResendConfirmation} disabled={isLoading}>
                      Resend confirmation email
                    </Button>
                    <Button variant="secondary" onClick={handleDevConfirm} disabled={isLoading}>
                      Development: Skip confirmation
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
