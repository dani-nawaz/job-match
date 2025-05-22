export type StudentData = {
  name: string
  email: string
  major: string
  gpa: number
  skills: string[]
  certifications?: string[]
  location_preference?: string
  internship_history?: string[]
}

export function parseStudentCSV(csvContent: string): StudentData[] {
  // Split the CSV content into lines
  const lines = csvContent.split("\n")

  // Extract the header row and remove any quotes
  const headers = lines[0].split(",").map((header) => header.trim().replace(/^"(.*)"$/, "$1"))

  // Map the remaining lines to student objects
  const students: StudentData[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue // Skip empty lines

    // Split the line into values and handle quoted values
    const values: string[] = []
    let currentValue = ""
    let inQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        values.push(currentValue.trim().replace(/^"(.*)"$/, "$1"))
        currentValue = ""
      } else {
        currentValue += char
      }
    }

    // Add the last value
    values.push(currentValue.trim().replace(/^"(.*)"$/, "$1"))

    // Create a student object from the values
    const student: Partial<StudentData> = {}

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j].toLowerCase()
      const value = values[j]

      if (header === "name") {
        student.name = value
      } else if (header === "email") {
        student.email = value
      } else if (header === "major") {
        student.major = value
      } else if (header === "gpa") {
        student.gpa = Number.parseFloat(value)
      } else if (header === "skills") {
        student.skills = value.split(";").map((skill) => skill.trim())
      } else if (header === "certifications") {
        student.certifications = value ? value.split(";").map((cert) => cert.trim()) : []
      } else if (header === "location_preference") {
        student.location_preference = value
      } else if (header === "internship_history") {
        student.internship_history = value ? value.split(";").map((internship) => internship.trim()) : []
      }
    }

    // Validate required fields
    if (
      student.name &&
      student.email &&
      student.major &&
      !isNaN(student.gpa as number) &&
      student.skills &&
      student.skills.length > 0
    ) {
      students.push(student as StudentData)
    }
  }

  return students
}

export function getCSVTemplate(): string {
  return `Name,Email,Major,GPA,Skills,Certifications,Location_Preference,Internship_History
"John Doe","john.doe@example.com","Computer Science",3.8,"JavaScript;React;Node.js","AWS Certified Developer","San Francisco, CA","Summer Intern at Tech Co;Research Assistant"
"Jane Smith","jane.smith@example.com","Data Science",3.9,"Python;R;Machine Learning","Google Cloud Certified","New York, NY","Data Analyst at Analytics Inc"
`
}
