"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { parseStudentCSV, getCSVTemplate, type StudentData } from "@/lib/csv-parser"
import { useAuth } from "@/contexts/auth-context"
import { CSVFileUpload } from "@/components/csv-file-upload"
import { CheckCircle, AlertCircle, Users, UploadIcon } from "lucide-react"

interface StudentUploadPageProps {
  params: {
    locale: string
  }
}

export default function StudentUploadPage({ params: { locale } }: StudentUploadPageProps) {
  const t = useTranslations('university')
  const tCommon = useTranslations('common')
  const tValidation = useTranslations('validation')
  const { profile, user } = useAuth()
  const [parsedStudents, setParsedStudents] = useState<StudentData[]>([])
  const [activeTab, setActiveTab] = useState("csv")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  // Loading and error states
  const [isParsingFile, setIsParsingFile] = useState(false)
  const [isUploadingStudents, setIsUploadingStudents] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Manual entry form state
  const [studentName, setStudentName] = useState("")
  const [studentEmail, setStudentEmail] = useState("")
  const [studentMajor, setStudentMajor] = useState("")
  const [studentGPA, setStudentGPA] = useState("")
  const [studentSkills, setStudentSkills] = useState("")
  const [studentCertifications, setStudentCertifications] = useState("")
  const [studentLocation, setStudentLocation] = useState("")
  const [studentInternships, setStudentInternships] = useState("")

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setFileError(null)
    setUploadError(null)
    setIsParsingFile(true)
    setUploadProgress(10)

    try {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(tValidation('fileSizeLimit'))
      }

      // Validate file type
      if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
        throw new Error(tValidation('csvFileRequired'))
      }

      setUploadProgress(30)

      const text = await file.text()
      setUploadProgress(60)

      const students = parseStudentCSV(text)
      setUploadProgress(90)

      if (students.length === 0) {
        throw new Error(t('noValidRecords'))
      }

      setParsedStudents(students)
      setUploadProgress(100)

      toast({
        title: t('csvParsedSuccess'),
        description: t('foundRecords', { count: students.length }),
      })
    } catch (error: any) {
      console.error("Error parsing CSV:", error)
      setFileError(error.message || t('csvParseError'))
      setParsedStudents([])
    } finally {
      setIsParsingFile(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
    setParsedStudents([])
    setFileError(null)
    setUploadError(null)
    setUploadProgress(0)
  }

  const handleDownloadTemplate = () => {
    const template = getCSVTemplate()
    const blob = new Blob([template], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "student_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleUploadStudents = async () => {
    if (parsedStudents.length === 0) {
      toast({
        title: t('noStudentsToUpload'),
        description: t('uploadFileFirst'),
        variant: "destructive",
      })
      return
    }

    setIsUploadingStudents(true)
    setUploadError(null)
    setUploadProgress(0)

    try {
      setUploadProgress(10)

      // Get university ID for the current user
      const { data: universityData, error: universityError } = await supabase
        .from("universities")
        .select("id")
        .eq("admin_id", user?.id)
        .single()

      if (universityError) {
        throw new Error(t('universityNotFound'))
      }

      const universityId = universityData.id
      setUploadProgress(20)

      // Prepare student records for insertion
      const studentRecords = parsedStudents.map((student) => ({
        name: student.name,
        email: student.email,
        university_id: universityId,
        major: student.major,
        gpa: student.gpa,
        skills: student.skills,
        certifications: student.certifications || [],
        location_preference: student.location_preference || undefined,
        internship_history: student.internship_history || [],
      }))

      setUploadProgress(30)

      // Insert students in batches of 10
      const batchSize = 10
      const totalBatches = Math.ceil(studentRecords.length / batchSize)

      for (let i = 0; i < studentRecords.length; i += batchSize) {
        const batch = studentRecords.slice(i, i + batchSize)
        const { error } = await supabase.from("students").insert(batch)

        if (error) {
          console.error("Error inserting students:", error)
          throw new Error(t('uploadFailed', { error: error.message }))
        }

        // Update progress
        const currentBatch = Math.floor(i / batchSize) + 1
        const progress = 30 + (currentBatch / totalBatches) * 60
        setUploadProgress(progress)
      }

      setUploadProgress(100)

      toast({
        title: t('studentsUploadedSuccess'),
        description: t('studentsAdded', { count: studentRecords.length }),
      })

      // Clear the form
      setParsedStudents([])
      setSelectedFile(null)

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push(`/${locale}/university/dashboard`)
      }, 2000)
    } catch (error: any) {
      console.error("Error uploading students:", error)
      setUploadError(error.message || t('unexpectedError'))
      toast({
        title: t('uploadFailed'),
        description: error.message || tCommon('unexpectedError'),
        variant: "destructive",
      })
    } finally {
      setIsUploadingStudents(false)
      setTimeout(() => setUploadProgress(0), 2000)
    }
  }

  const handleAddManualStudent = () => {
    // Validate required fields
    if (!studentName || !studentEmail || !studentMajor || !studentGPA || !studentSkills) {
      toast({
        title: tValidation('missingFields'),
        description: t('fillRequiredFields'),
        variant: "destructive",
      })
      return
    }

    const gpa = Number.parseFloat(studentGPA)
    if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
      toast({
        title: tValidation('invalidGPA'),
        description: tValidation('gpaRange'),
        variant: "destructive",
      })
      return
    }

    // Create student object
    const student: StudentData = {
      name: studentName,
      email: studentEmail,
      major: studentMajor,
      gpa: gpa,
      skills: studentSkills.split(",").map((skill) => skill.trim()),
      certifications: studentCertifications ? studentCertifications.split(",").map((cert) => cert.trim()) : [],
      location_preference: studentLocation || undefined,
      internship_history: studentInternships
        ? studentInternships.split(",").map((internship) => internship.trim())
        : [],
    }

    // Add to parsed students
    setParsedStudents([...parsedStudents, student])

    // Clear form
    setStudentName("")
    setStudentEmail("")
    setStudentMajor("")
    setStudentGPA("")
    setStudentSkills("")
    setStudentCertifications("")
    setStudentLocation("")
    setStudentInternships("")

    toast({
      title: t('studentAdded'),
      description: t('studentAddedDescription'),
    })
  }

  if (!user || !profile) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>{tCommon('loading')}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('uploadStudents')}</h1>
        <p className="text-gray-600">
          {t('uploadDescription')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadIcon className="h-5 w-5" />
            {t('studentDataUpload')}
          </CardTitle>
          <CardDescription>{t('chooseUploadMethod')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="csv">{t('csvUpload')}</TabsTrigger>
              <TabsTrigger value="manual">{t('manualEntry')}</TabsTrigger>
            </TabsList>

            <TabsContent value="csv" className="space-y-6 mt-6">
              <CSVFileUpload
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                isLoading={isParsingFile}
                error={fileError}
                selectedFile={selectedFile}
                onDownloadTemplate={handleDownloadTemplate}
                progress={uploadProgress}
              />

              {/* Upload Error Display */}
              {uploadError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{t('uploadFailed')}:</strong> {uploadError}
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="manual" className="space-y-4 mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="student-name">{t('name')} *</Label>
                  <Input
                    id="student-name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="John Doe"
                    disabled={isUploadingStudents}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="student-email">{t('email')} *</Label>
                  <Input
                    id="student-email"
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    disabled={isUploadingStudents}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="student-major">{t('major')} *</Label>
                  <Input
                    id="student-major"
                    value={studentMajor}
                    onChange={(e) => setStudentMajor(e.target.value)}
                    placeholder={t('majorPlaceholder')}
                    disabled={isUploadingStudents}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="student-gpa">{t('gpa')} (0-4.0) *</Label>
                  <Input
                    id="student-gpa"
                    value={studentGPA}
                    onChange={(e) => setStudentGPA(e.target.value)}
                    placeholder="3.5"
                    disabled={isUploadingStudents}
                  />
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="student-skills">{t('skillsCommaSeparated')} *</Label>
                  <Input
                    id="student-skills"
                    value={studentSkills}
                    onChange={(e) => setStudentSkills(e.target.value)}
                    placeholder={t('skillsPlaceholder')}
                    disabled={isUploadingStudents}
                  />
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="student-certifications">{t('certificationsCommaSeparated')}</Label>
                  <Input
                    id="student-certifications"
                    value={studentCertifications}
                    onChange={(e) => setStudentCertifications(e.target.value)}
                    placeholder={t('certificationsPlaceholder')}
                    disabled={isUploadingStudents}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="student-location">{t('locationPreference')}</Label>
                  <Input
                    id="student-location"
                    value={studentLocation}
                    onChange={(e) => setStudentLocation(e.target.value)}
                    placeholder={t('locationPlaceholder')}
                    disabled={isUploadingStudents}
                  />
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="student-internships">{t('internshipHistoryCommaSeparated')}</Label>
                  <Input
                    id="student-internships"
                    value={studentInternships}
                    onChange={(e) => setStudentInternships(e.target.value)}
                    placeholder={t('internshipPlaceholder')}
                    disabled={isUploadingStudents}
                  />
                </div>

                <Button className="md:col-span-2" onClick={handleAddManualStudent} disabled={isUploadingStudents}>
                  {t('addStudent')}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Preview Section */}
          {parsedStudents.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-medium">{t('studentsReadyForUpload', { count: parsedStudents.length })}</h3>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('name')}</TableHead>
                        <TableHead>{t('email')}</TableHead>
                        <TableHead>{t('major')}</TableHead>
                        <TableHead>{t('gpa')}</TableHead>
                        <TableHead>{t('skills')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedStudents.map((student, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.major}</TableCell>
                          <TableCell>{student.gpa}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {student.skills.slice(0, 3).map((skill, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                                >
                                  {skill}
                                </span>
                              ))}
                              {student.skills.length > 3 && (
                                <span className="text-xs text-gray-500">+{student.skills.length - 3} {tCommon('more')}</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {parsedStudents.length > 0 && (
          <CardFooter>
            <Button onClick={handleUploadStudents} disabled={isUploadingStudents} className="w-full" size="lg">
              {isUploadingStudents ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  {t('uploadingStudents', { count: parsedStudents.length })}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {t('uploadStudentsCount', { count: parsedStudents.length })}
                </div>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
