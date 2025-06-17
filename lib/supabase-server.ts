import { createClient } from "@supabase/supabase-js"

// Use fallback values for development/demo purposes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "demo-service-key"

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)
