"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function HRProfileSetupPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('hrProfileSetup')
  const tCommon = useTranslations('common')
  
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  // Step 1: Basic Info
  const [name, setName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [phone, setPhone] = useState("")

  // Step 2: Company Details
  const [industry, setIndustry] = useState("")
  const [companySize, setCompanySize] = useState("")
  const [location, setLocation] = useState("")
  const [website, setWebsite] = useState("")
  const [description, setDescription] = useState("")

  // Step 3: Preferences
  const [hiringGoals, setHiringGoals] = useState("")
  const [preferredSkills, setPreferredSkills] = useState("")
  const [internshipDuration, setInternshipDuration] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to HR dashboard
      router.push(`/${locale}/hr/dashboard`)
    } catch (error) {
      console.error("Error setting up profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">{t('fullName')}</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('fullNamePlaceholder')}
            className={locale === 'ar' ? 'text-right' : ''}
          />
        </div>
        <div>
          <Label htmlFor="jobTitle">{t('jobTitle')}</Label>
          <Input
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder={t('jobTitlePlaceholder')}
            className={locale === 'ar' ? 'text-right' : ''}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="companyName">{t('companyName')}</Label>
        <Input
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder={t('companyNamePlaceholder')}
          className={locale === 'ar' ? 'text-right' : ''}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">{tCommon('email')}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
          />
        </div>
        <div>
          <Label htmlFor="phone">{tCommon('phone')}</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('phonePlaceholder')}
          />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="industry">{t('industry')}</Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectIndustry')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">{t('industries.technology')}</SelectItem>
              <SelectItem value="finance">{t('industries.finance')}</SelectItem>
              <SelectItem value="healthcare">{t('industries.healthcare')}</SelectItem>
              <SelectItem value="education">{t('industries.education')}</SelectItem>
              <SelectItem value="manufacturing">{t('industries.manufacturing')}</SelectItem>
              <SelectItem value="retail">{t('industries.retail')}</SelectItem>
              <SelectItem value="other">{t('industries.other')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="companySize">{t('companySize')}</Label>
          <Select value={companySize} onValueChange={setCompanySize}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectCompanySize')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">{t('companySizes.small')}</SelectItem>
              <SelectItem value="11-50">{t('companySizes.medium')}</SelectItem>
              <SelectItem value="51-200">{t('companySizes.large')}</SelectItem>
              <SelectItem value="201-1000">{t('companySizes.enterprise')}</SelectItem>
              <SelectItem value="1000+">{t('companySizes.corporation')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="location">{tCommon('location')}</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={t('locationPlaceholder')}
          className={locale === 'ar' ? 'text-right' : ''}
        />
      </div>

      <div>
        <Label htmlFor="website">{t('website')}</Label>
        <Input
          id="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder={t('websitePlaceholder')}
        />
      </div>

      <div>
        <Label htmlFor="description">{t('companyDescription')}</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('companyDescriptionPlaceholder')}
          rows={4}
          className={locale === 'ar' ? 'text-right' : ''}
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div>
        <Label htmlFor="hiringGoals">{t('hiringGoals')}</Label>
        <Textarea
          id="hiringGoals"
          value={hiringGoals}
          onChange={(e) => setHiringGoals(e.target.value)}
          placeholder={t('hiringGoalsPlaceholder')}
          rows={3}
          className={locale === 'ar' ? 'text-right' : ''}
        />
      </div>

      <div>
        <Label htmlFor="preferredSkills">{t('preferredSkills')}</Label>
        <Textarea
          id="preferredSkills"
          value={preferredSkills}
          onChange={(e) => setPreferredSkills(e.target.value)}
          placeholder={t('preferredSkillsPlaceholder')}
          rows={3}
          className={locale === 'ar' ? 'text-right' : ''}
        />
      </div>

      <div>
        <Label htmlFor="internshipDuration">{t('typicalInternshipDuration')}</Label>
        <Select value={internshipDuration} onValueChange={setInternshipDuration}>
          <SelectTrigger>
            <SelectValue placeholder={t('selectDuration')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-3">{t('durations.short')}</SelectItem>
            <SelectItem value="3-6">{t('durations.medium')}</SelectItem>
            <SelectItem value="6-12">{t('durations.long')}</SelectItem>
            <SelectItem value="12+">{t('durations.extended')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      default:
        return renderStep1()
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return name && companyName && email && jobTitle
      case 2:
        return industry && companySize && location
      case 3:
        return hiringGoals && preferredSkills && internshipDuration
      default:
        return false
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return t('steps.basicInfo')
      case 2:
        return t('steps.companyDetails')
      case 3:
        return t('steps.preferences')
      default:
        return t('steps.basicInfo')
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return t('stepDescriptions.basicInfo')
      case 2:
        return t('stepDescriptions.companyDetails')
      case 3:
        return t('stepDescriptions.preferences')
      default:
        return t('stepDescriptions.basicInfo')
    }
  }

  return (
    <div 
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${locale === 'ar' ? 'font-arabic' : ''}`}>
            {t('title')}
          </h1>
          <p className={`text-gray-600 ${locale === 'ar' ? 'font-arabic' : ''}`}>
            {t('subtitle')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className={locale === 'ar' ? 'font-arabic' : ''}>{getStepTitle()}</CardTitle>
                <CardDescription className={locale === 'ar' ? 'font-arabic' : ''}>{getStepDescription()}</CardDescription>
              </div>
              <div className={`text-sm font-medium text-gray-500 ${locale === 'ar' ? 'font-arabic' : ''}`}>
                {t('stepProgress', { current: currentStep, total: totalSteps })}
              </div>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
          </CardHeader>
          
          <CardContent>
            {renderCurrentStep()}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={locale === 'ar' ? 'font-arabic' : ''}
            >
              {tCommon('previous')}
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isLoading}
              className={locale === 'ar' ? 'font-arabic' : ''}
            >
              {isLoading ? (
                <span className={locale === 'ar' ? 'font-arabic' : ''}>{tCommon('loading')}</span>
              ) : currentStep === totalSteps ? (
                <span className={locale === 'ar' ? 'font-arabic' : ''}>{t('completeSetup')}</span>
              ) : (
                <span className={locale === 'ar' ? 'font-arabic' : ''}>{tCommon('next')}</span>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
