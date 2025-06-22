"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Key } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { User } from '@supabase/supabase-js'

export function Navigation() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we're in demo mode
    const demoMode =
      process.env.NEXT_PUBLIC_SUPABASE_URL === undefined ||
      process.env.NEXT_PUBLIC_SUPABASE_URL === "https://demo.supabase.co"

    setIsDemo(demoMode)

    if (demoMode) {
      // In demo mode, check localStorage for demo user
      const demoUser = localStorage.getItem("demo_user")
      if (demoUser) {
        setUser(JSON.parse(demoUser))
      }
      setLoading(false)
      return
    }

    // Real Supabase mode
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        console.log("Navigation: Got user", user?.email || "none")
        setUser(user)
      } catch (error) {
        console.error("Navigation: Error getting user:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Navigation: Auth state changed:", event, session?.user?.email || "none")
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      console.log("Navigation: Logging out user")

      if (isDemo) {
        // Demo mode - clear localStorage and state
        localStorage.removeItem("demo_user")
        setUser(null)
        console.log("Navigation: Demo logout complete, redirecting to home")
        router.push("/")
        return
      }

      // Real Supabase logout
      await supabase.auth.signOut()
      setUser(null)
      console.log("Navigation: Supabase logout complete, redirecting to home")
      router.push("/")
    } catch (error) {
      console.error("Navigation: Error logging out:", error)
      // Still clear state and redirect even if there's an error
      setUser(null)
      router.push("/")
    }
  }

  return (
    <nav className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="px-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-10 col-start-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <Key className="h-6 w-6 text-black" />
            <span className="text-xl font-bold text-black">
              Your Hiring Advantage
            </span>
          </div>

          {/* Center Navigation Links */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm tracking-wide uppercase transition-colors"
            >
              OUTREACH KIT
            </button>
            <button
              className="text-gray-600 hover:text-gray-800 font-medium text-sm tracking-wide uppercase transition-colors cursor-not-allowed opacity-60"
              disabled
            >
              SMART REFERRAL
            </button>
          </div>

          {/* Auth Links */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/about")}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm tracking-wide uppercase transition-colors mr-4"
            >
              ABOUT
            </button>
            {loading ? (
              <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 font-medium text-sm tracking-wide uppercase transition-colors"
              >
                LOG OUT
              </button>
            ) : (
              <>
              <button
                onClick={() => router.push("/login")}
                className="text-gray-600 hover:text-gray-800 font-medium text-sm tracking-wide uppercase transition-colors"
              >
                LOG IN
              </button>
                <button
                  onClick={() => router.push("/signup")}
                  className="text-gray-600 hover:text-gray-800 font-medium text-sm tracking-wide uppercase transition-colors ml-2"
                >
                  SIGN UP
                </button>
              </>
            )}
          </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
