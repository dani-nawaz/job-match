"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function devConfirmEmail(email: string) {
  const supabase = createServerActionClient({ cookies })

  try {
    // This is a development-only function to bypass email confirmation
    // In production, you would use proper email confirmation

    // Get user by email
    const { data: userData, error: userError } = await supabase
      .from("auth.users")
      .select("id, email")
      .eq("email", email)
      .single()

    if (userError) {
      return { success: false, error: "User not found" }
    }

    // Update email_confirmed_at
    const now = new Date().toISOString()
    const { error: updateError } = await supabase
      .from("auth.users")
      .update({ email_confirmed_at: now })
      .eq("id", userData.id)

    if (updateError) {
      return { success: false, error: "Failed to confirm email" }
    }

    return { success: true }
  } catch (error) {
    console.error("Dev confirm email error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
