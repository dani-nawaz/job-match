import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing required environment variables for Supabase client")
}

// Create a single supabase client for the browser
let supabaseBrowserClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseBrowserClient() {
  if (!supabaseBrowserClient && supabaseUrl && supabaseAnonKey) {
    supabaseBrowserClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
      },
    })
  }

  if (!supabaseBrowserClient) {
    throw new Error("Failed to initialize Supabase client. Check your environment variables.")
  }

  return supabaseBrowserClient
}

// Create a single supabase client for server components
export function getSupabaseServerClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing required environment variables for Supabase server client")
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// For backward compatibility
export const createServerSupabaseClient = getSupabaseServerClient
