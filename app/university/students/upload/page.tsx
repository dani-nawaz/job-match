"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

export default function StudentUploadPage() {
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
        throw new Error("File size must be less than 10MB")
      }

      // Validate file type
      if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
        throw new Error("Please select a valid CSV file")
      }

      setUploadProgress(30)

      const text = await file.text()
      setUploadProgress(60)

      const students = parseStudentCSV(text)
      setUploadProgress(90)

      if (students.length === 0) {
        throw new Error("No valid student records found in the CSV file")
      }

      setParsedStudents(students)
      setUploadProgress(100)

      toast({
        title: "CSV parsed successfully",
        description: `Found ${students.length} valid student records.`,
      })
    } catch (error: any) {
      console.error("Error parsing CSV:", error)
      setFileError(error.message || "Failed to parse CSV file")
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
        title: "No students to upload",
        description: "Please upload a CSV file or add students manually first.",
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
        throw new Error("Could not find your university. Please make sure your account is set up correctly.")
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
          throw new Error(`Failed to upload students: ${error.message}`)
        }

        // Update progress
        const currentBatch = Math.floor(i / batchSize) + 1
        const progress = 30 + (currentBatch / totalBatches) * 60
        setUploadProgress(progress)
      }

      setUploadProgress(100)

      toast({
        title: "Students uploaded successfully",
        description: `${studentRecords.length} students have been added to your university.`,
      })

      // Clear the form
      setParsedStudents([])
      setSelectedFile(null)

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/university/dashboard")
      }, 2000)
    } catch (error: any) {
      console.error("Error uploading students:", error)
      setUploadError(error.message || "An unexpected error occurred while uploading students")
      toast({
        title: "Upload failed",
        description: error.message || "An unexpected error occurred.",
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
        title: "Missing required fields",
        description: "Please fill in all required fields (name, email, major, GPA, and skills).",
        variant: "destructive",
      })
      return
    }

    const gpa = Number.parseFloat(studentGPA)
    if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
      toast({
        title: "Invalid GPA",
        description: "GPA must be a number between 0 and 4.0.",
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
      title: "Student added",
      description: "The student has been added to the list. Don't forget to upload when you're done.",
    })
  }

  if (!user || !profile) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Upload Students</h1>
        <p className="text-gray-600">
          Add students to your university by uploading a CSV file or entering them manually.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadIcon className="h-5 w-5" />
            Student Data Upload
          </CardTitle>
          <CardDescription>Choose how you'd like to add students to your university database.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="csv">CSV Upload</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
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
                    <strong>Upload Failed:</strong> {uploadError}
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="manual" className="space-y-4 mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="student-name">Name *</Label>
                  <Input
                    id="student-name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="John Doe"
                    disabled={isUploadingStudents}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="student-email">Email *</Label>
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
                  <Label htmlFor="student-major">Major *</Label>
                  <Input
                    id="student-major"
                    value={studentMajor}
                    onChange={(e) => setStudentMajor(e.target.value)}
                    placeholder="Computer Science"
                    disabled={isUploadingStudents}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="student-gpa">GPA (0-4.0) *</Label>
                  <Input
                    id="student-gpa"
                    value={studentGPA}
                    onChange={(e) => setStudentGPA(e.target.value)}
                    placeholder="3.5"
                    disabled={isUploadingStudents}
                  />
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="student-skills">Skills (comma separated) *</Label>
                  <Input
                    id="student-skills"
                    value={studentSkills}
                    onChange={(e) => setStudentSkills(e.target.value)}
                    placeholder="JavaScript, React, Node.js"
                    disabled={isUploadingStudents}
                  />
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="student-certifications">Certifications (comma separated)</Label>
                  <Input
                    id="student-certifications"
                    value={studentCertifications}
                    onChange={(e) => setStudentCertifications(e.target.value)}
                    placeholder="AWS Certified Developer, Google Cloud Certified"
                    disabled={isUploadingStudents}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="student-location">Location Preference</Label>
                  <Input
                    id="student-location"
                    value={studentLocation}
                    onChange={(e) => setStudentLocation(e.target.value)}
                    placeholder="San Francisco, CA"
                    disabled={isUploadingStudents}
                  />
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="student-internships">Internship History (comma separated)</Label>
                  <Input
                    id="student-internships"
                    value={studentInternships}
                    onChange={(e) => setStudentInternships(e.target.value)}
                    placeholder="Summer Intern at Tech Co, Research Assistant"
                    disabled={isUploadingStudents}
                  />
                </div>

                <Button className="md:col-span-2" onClick={handleAddManualStudent} disabled={isUploadingStudents}>
                  Add Student
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Preview Section */}
          {parsedStudents.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-medium">Students Ready for Upload ({parsedStudents.length})</h3>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Major</TableHead>
                        <TableHead>GPA</TableHead>
                        <TableHead>Skills</TableHead>
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
                                <span className="text-xs text-gray-500">+{student.skills.length - 3} more</span>
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
                  Uploading {parsedStudents.length} Students...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Upload {parsedStudents.length} Students
                </div>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
