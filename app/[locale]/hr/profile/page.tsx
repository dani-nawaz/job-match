"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { HRNav } from "@/components/hr-nav"
import { Loader2, User, Building, Mail, Phone, MapPin, Briefcase } from "lucide-react"
import { toast } from "sonner"

export default function HRProfilePage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations()
  const { profile, refreshProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = getSupabaseBrowserClient()

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    job_title: "",
    company_description: "",
    company_location: "",
    company_website: "",
    company_size: "",
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        company_name: profile.company_name || "",
        job_title: profile.job_title || "",
        company_description: profile.company_description || "",
        company_location: profile.company_location || "",
        company_website: profile.company_website || "",
        company_size: profile.company_size || "",
      })
    }
  }, [profile])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    if (!profile) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from("hr_profiles")
        .update({
          name: formData.name,
          phone: formData.phone,
          company_name: formData.company_name,
          job_title: formData.job_title,
          company_description: formData.company_description,
          company_location: formData.company_location,
          company_website: formData.company_website,
          company_size: formData.company_size,
        })
        .eq("id", profile.id)

      if (error) throw error

      toast.success(t('hr.profile.profileUpdated'))
      await refreshProfile()
      router.push(`/${locale}/hr/dashboard`)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(t('hr.profile.updateError'))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container flex items-center justify-between h-16 mx-auto">
            <h1 className="text-xl font-bold">TalentBridge</h1>
            <HRNav />
          </div>
        </header>
        <div className="flex items-center justify-center flex-1">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 mx-auto">
          <h1 className="text-xl font-bold">TalentBridge</h1>
          <HRNav />
        </div>
      </header>
      
      <div className="flex-1 py-6 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">{t('hr.profile.title')}</h1>
              <p className="text-muted-foreground">{t('hr.profile.description')}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push(`/${locale}/hr/dashboard`)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('hr.profile.saving')}
                  </>
                ) : (
                  t('hr.profile.saveProfile')
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t('hr.profile.personalInfo')}
                </CardTitle>
                <CardDescription>{t('hr.profile.personalInfoDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t('hr.profile.fullName')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={t('hr.profile.fullNamePlaceholder')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('hr.profile.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">{t('hr.profile.emailDisabled')}</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">{t('hr.profile.phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder={t('hr.profile.phonePlaceholder')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="job-title">{t('hr.profile.jobTitle')}</Label>
                  <Input
                    id="job-title"
                    value={formData.job_title}
                    onChange={(e) => handleInputChange("job_title", e.target.value)}
                    placeholder={t('hr.profile.jobTitlePlaceholder')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  {t('hr.profile.companyInfo')}
                </CardTitle>
                <CardDescription>{t('hr.profile.companyInfoDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="company-name">{t('hr.profile.companyName')}</Label>
                  <Input
                    id="company-name"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange("company_name", e.target.value)}
                    placeholder={t('hr.profile.companyNamePlaceholder')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-location">{t('hr.profile.companyLocation')}</Label>
                  <Input
                    id="company-location"
                    value={formData.company_location}
                    onChange={(e) => handleInputChange("company_location", e.target.value)}
                    placeholder={t('hr.profile.companyLocationPlaceholder')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-website">{t('hr.profile.companyWebsite')}</Label>
                  <Input
                    id="company-website"
                    type="url"
                    value={formData.company_website}
                    onChange={(e) => handleInputChange("company_website", e.target.value)}
                    placeholder={t('hr.profile.companyWebsitePlaceholder')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-size">{t('hr.profile.companySize')}</Label>
                  <Input
                    id="company-size"
                    value={formData.company_size}
                    onChange={(e) => handleInputChange("company_size", e.target.value)}
                    placeholder={t('hr.profile.companySizePlaceholder')}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Description */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {t('hr.profile.companyDescription')}
              </CardTitle>
              <CardDescription>{t('hr.profile.companyDescriptionHelper')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Label htmlFor="company-description">{t('hr.profile.aboutCompany')}</Label>
                <Textarea
                  id="company-description"
                  value={formData.company_description}
                  onChange={(e) => handleInputChange("company_description", e.target.value)}
                  placeholder={t('hr.profile.companyDescriptionPlaceholder')}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('hr.profile.saving')}
                  </>
                ) : (
                  t('hr.profile.saveProfile')
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
