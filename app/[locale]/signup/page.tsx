"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { LanguageToggle } from "@/components/language-toggle"

interface SignupPageProps {
  params: Promise<{ locale: string }>
}

export default function SignupPage({ params }: SignupPageProps) {
  const router = useRouter()
  const urlParams = useParams()
  const locale = urlParams.locale as string
  const { toast } = useToast()
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')
  const tValidation = useTranslations('validation')
  const tErrors = useTranslations('errors')
  
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
        throw error
      }

      if (data.user) {
        // Create profile record
        const profileData = {
          id: data.user.id,
          email: email,
          full_name: fullName,
          role: role,
          company_name: role === "hr" ? companyName : null,
        }

        const { error: profileError } = await supabase.from("profiles").insert(profileData)

        if (profileError) {
          throw profileError
        }

        // If university, create university record
        if (role === "university") {
          const universityData = {
            user_id: data.user.id,
            name: universityName,
            location: universityLocation,
          }

          const { error: universityError } = await supabase.from("universities").insert(universityData)

          if (universityError) {
            throw universityError
          }
        }

        toast({
          title: t('signup.success'),
          description: t('signup.successDescription'),
        })

        // For development, auto-confirm the email
        if (process.env.NODE_ENV === "development") {
          setTimeout(() => {
            if (role === "university") {
              router.push(`/${locale}/university/dashboard`)
            } else {
              router.push(`/${locale}/hr/profile/setup`)
            }
          }, 1000)
        } else {
          router.push(`/${locale}/login`)
        }
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      if (error.message?.includes("already registered")) {
        setErrorMessage(tErrors('emailAlreadyExists'))
      } else {
        setErrorMessage(error.message || tErrors('signupFailed'))
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-8">
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{t('signup.title')}</CardTitle>
          <CardDescription className="text-center">
            {t('signup.description')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{tErrors('error')}</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="fullName">{tCommon('fullName')}</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={tCommon('fullNamePlaceholder')}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">{tCommon('email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={tCommon('emailPlaceholder')}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">{tCommon('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tCommon('passwordPlaceholder')}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>{t('signup.accountType')}</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as "university" | "hr")}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="university" id="university" />
                  <Label htmlFor="university">{t('signup.university')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hr" id="hr" />
                  <Label htmlFor="hr">{t('signup.company')}</Label>
                </div>
              </RadioGroup>
            </div>

            {role === "university" ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="universityName">{t('signup.universityName')}</Label>
                  <Input
                    id="universityName"
                    value={universityName}
                    onChange={(e) => setUniversityName(e.target.value)}
                    placeholder={t('signup.universityNamePlaceholder')}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="universityLocation">{t('signup.universityLocation')}</Label>
                  <Input
                    id="universityLocation"
                    value={universityLocation}
                    onChange={(e) => setUniversityLocation(e.target.value)}
                    placeholder={t('signup.universityLocationPlaceholder')}
                    required
                  />
                </div>
              </>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="companyName">{t('signup.companyName')}</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={t('signup.companyNamePlaceholder')}
                  required
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? tCommon('loading') : t('signup.button')}
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t('signup.hasAccount')}{" "}
                <Link
                  href={`/${locale}/login`}
                  className="font-medium text-primary hover:underline"
                >
                  {t('signup.signInLink')}
                </Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
