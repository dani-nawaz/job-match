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
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { LanguageToggle } from "@/components/language-toggle"

interface LoginPageProps {
  params: Promise<{ locale: string }>
}

export default function LoginPage({ params }: LoginPageProps) {
  const router = useRouter()
  const urlParams = useParams()
  const locale = urlParams.locale as string
  const { toast } = useToast()
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')
  const tValidation = useTranslations('validation')
  const tErrors = useTranslations('errors')
  
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
          setErrorMessage(t('emailNotConfirmed'))
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
          router.push(`/${locale}/university/dashboard`)
        } else if (profile.role === "hr") {
          router.push(`/${locale}/hr/dashboard`)
        } else {
          router.push(`/${locale}/dashboard`)
        }
      }
    } catch (error: any) {
      console.error("Login error:", error)
      if (error.message === "Invalid login credentials") {
        setErrorMessage(tErrors('invalidCredentials'))
      } else if (!errorMessage) {
        setErrorMessage(error.message || tErrors('loginFailed'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (error) {
        throw error
      }

      toast({
        title: t('confirmationSent'),
        description: t('checkEmail'),
      })
      setShowResendConfirmation(false)
    } catch (error: any) {
      setErrorMessage(error.message || tErrors('resendFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDevelopmentSignup = async () => {
    if (!email || !password) {
      setErrorMessage(tValidation('emailPasswordRequired'))
      return
    }

    setIsLoading(true)
    try {
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
        title: t('developmentMode'),
        description: t('accountConfirmed'),
      })
    } catch (error: any) {
      setErrorMessage(error.message || tErrors('signupFailed'))
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{t('login.title')}</CardTitle>
          <CardDescription className="text-center">
            {t('login.description')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{tErrors('error')}</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
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
            <div className="space-y-2">
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? tCommon('loading') : t('login.button')}
            </Button>
            {showResendConfirmation && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendConfirmation}
                disabled={isLoading}
              >
                {t('resendConfirmation')}
              </Button>
            )}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t('login.noAccount')}{" "}
                <Link
                  href={`/${locale}/signup`}
                  className="font-medium text-primary hover:underline"
                >
                  {t('login.signUpLink')}
                </Link>
              </p>
            </div>
            {process.env.NODE_ENV === "development" && (
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">
                  {t('developmentHelper')}
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={handleDevelopmentSignup}
                  disabled={isLoading}
                >
                  {t('createDevAccount')}
                </Button>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
