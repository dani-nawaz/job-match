"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function generateRecommendations(jobId: string) {
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    return {
      success: false,
      message: "OpenAI API key is not configured. Please add it to your environment variables.",
    }
  }

  const supabase = createServerSupabaseClient()

  // Fetch job details
  const { data: job, error: jobError } = await supabase.from("jobs").select("*").eq("id", jobId).single()

  if (jobError || !job) {
    throw new Error(`Failed to fetch job: ${jobError?.message || "Job not found"}`)
  }

  // Fetch all students
  const { data: students, error: studentsError } = await supabase.from("students").select(`
      *,
      universities(name, location)
    `)

  if (studentsError || !students) {
    throw new Error(`Failed to fetch students: ${studentsError?.message || "No students found"}`)
  }

  // Prepare the prompt for GPT
  const prompt = `
    I need to match students with a job opportunity. Here are the job details:
    
    Job Title: ${job.title}
    Company: ${job.company}
    Location: ${job.location}
    Description: ${job.description}
    Required Skills: ${job.skills_required.join(", ")}
    Minimum GPA: ${job.min_gpa || "Not specified"}
    
    I'll provide details about each student, and I need you to:
    1. Rate each student's match with this job on a scale of 0-100
    2. Provide a brief explanation for the rating
    3. Return the results in a valid JSON format
    
    Here are the students:
    ${students
      .map(
        (student, index) => `
      Student ${index + 1}:
      ID: ${student.id}
      Name: ${student.name}
      University: ${student.universities?.name || "Unknown"}
      Major: ${student.major || "Not specified"}
      GPA: ${student.gpa || "Not specified"}
      Skills: ${student.skills.join(", ")}
      Certifications: ${student.certifications.join(", ")}
      Location Preference: ${student.location_preference || "Not specified"}
      Internship History: ${student.internship_history.join(", ")}
    `,
      )
      .join("\n")}
    
    Return the results as a JSON array with objects containing:
    {
      "student_id": "uuid of the student",
      "match_score": number between 0-100,
      "reason": "brief explanation for the score"
    }
    
    Only include students with a match score of 50 or higher.
    IMPORTANT: Return ONLY the raw JSON array without any markdown formatting or code blocks.
  `

  try {
    // Generate recommendations using GPT
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      // The API key is automatically used from the environment variable
    })

    // Extract JSON from the response (in case it's wrapped in markdown code blocks)
    let jsonText = text.trim()

    // Check if the response is wrapped in a markdown code block
    const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/
    const match = jsonText.match(codeBlockRegex)

    if (match && match[1]) {
      // Extract the content inside the code block
      jsonText = match[1].trim()
    }

    console.log("Parsed JSON text:", jsonText)

    // Parse the response
    const recommendations = JSON.parse(jsonText)

    // Insert recommendations into the database
    for (const rec of recommendations) {
      // Check if recommendation already exists
      const { data: existingRec } = await supabase
        .from("recommendations")
        .select("id")
        .eq("job_id", jobId)
        .eq("student_id", rec.student_id)
        .single()

      if (existingRec) {
        // Update existing recommendation
        await supabase
          .from("recommendations")
          .update({
            match_score: rec.match_score,
            reason: rec.reason,
          })
          .eq("id", existingRec.id)
      } else {
        // Insert new recommendation
        await supabase.from("recommendations").insert({
          job_id: jobId,
          student_id: rec.student_id,
          match_score: rec.match_score,
          reason: rec.reason,
        })
      }
    }

    revalidatePath(`/hr/jobs/${jobId}/recommendations`)
    return {
      success: true,
      message: `Generated ${recommendations.length} recommendations`,
      count: recommendations.length,
    }
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
