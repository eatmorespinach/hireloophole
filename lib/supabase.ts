import { createClient } from "@supabase/supabase-js"

// Use fallback values for development/demo purposes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
