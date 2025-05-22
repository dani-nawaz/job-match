export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string
          role: "university" | "hr"
          company_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email: string
          role: "university" | "hr"
          company_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string
          role?: "university" | "hr"
          company_name?: string | null
          created_at?: string
        }
      }
      universities: {
        Row: {
          id: string
          name: string
          location: string
          description: string | null
          admin_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          description?: string | null
          admin_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          description?: string | null
          admin_id?: string
          created_at?: string
        }
      }
      students: {
        Row: {
          id: string
          name: string
          email: string
          university_id: string
          major: string | null
          gpa: number | null
          skills: string[]
          certifications: string[]
          location_preference: string | null
          internship_history: string[]
          meta_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          university_id: string
          major?: string | null
          gpa?: number | null
          skills?: string[]
          certifications?: string[]
          location_preference?: string | null
          internship_history?: string[]
          meta_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          university_id?: string
          major?: string | null
          gpa?: number | null
          skills?: string[]
          certifications?: string[]
          location_preference?: string | null
          internship_history?: string[]
          meta_data?: Json | null
          created_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          title: string
          company: string
          hr_id: string
          location: string
          description: string
          skills_required: string[]
          min_gpa: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          company: string
          hr_id: string
          location: string
          description: string
          skills_required?: string[]
          min_gpa?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          company?: string
          hr_id?: string
          location?: string
          description?: string
          skills_required?: string[]
          min_gpa?: number | null
          created_at?: string
        }
      }
      recommendations: {
        Row: {
          id: string
          job_id: string
          student_id: string
          match_score: number
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          student_id: string
          match_score: number
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          student_id?: string
          match_score?: number
          reason?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type University = Database["public"]["Tables"]["universities"]["Row"]
export type Student = Database["public"]["Tables"]["students"]["Row"]
export type Job = Database["public"]["Tables"]["jobs"]["Row"]
export type Recommendation = Database["public"]["Tables"]["recommendations"]["Row"]
