"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isDemo, setIsDemo] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we're in demo mode
    const demoMode =
      process.env.NEXT_PUBLIC_SUPABASE_URL === undefined ||
      process.env.NEXT_PUBLIC_SUPABASE_URL === "https://demo.supabase.co"

    setIsDemo(demoMode)

    // Check if user is already logged in
    const checkUser = async () => {
      if (demoMode) {
        const demoUser = localStorage.getItem("demo_user")
        if (demoUser) {
          console.log("Login: Demo user already logged in, redirecting")
          router.push("/")
        }
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        console.log("Login: User already logged in, redirecting")
        router.push("/")
      }
    }
    checkUser()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("Login: Attempting login with email:", email)

    try {
      if (isDemo) {
        // Demo mode - simulate successful login
        console.log("Login: Demo mode - simulating login")
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Create a demo user object
        const demoUser = {
          id: "demo-user-id",
          email: email,
          created_at: new Date().toISOString(),
        }

        // Store in localStorage to persist across page reloads
        localStorage.setItem("demo_user", JSON.stringify(demoUser))
        console.log("Login: Demo user stored, redirecting to home")
        router.push("/")
        return
      }

      // Real Supabase login
      console.log("Login: Attempting Supabase login")
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login: Supabase error:", error.message)
        setError(error.message)
      } else {
        console.log("Login: Supabase login successful, redirecting")
        router.push("/")
      }
    } catch (err) {
      console.error("Login: Unexpected error:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      {/* Header */}
      <div className="pt-8 pb-4 px-4">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 p-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Image 
                src="/favicon-32x32.png" 
                alt="Hoodwink the hamster" 
                width={24} 
                height={24}
                className="w-6 h-6"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Your Hiring Advantage
              </span>
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">Welcome back</CardTitle>
            <p className="text-gray-600 text-sm">Sign in to your account</p>
            {isDemo && (
              <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded mt-2">
                Demo Mode: Use any email/password to login
              </p>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-orange-400 focus:ring-orange-400 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-orange-400 focus:ring-orange-400 rounded-lg"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/signup")}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Decorative elements */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-pulse" />
      <div className="fixed bottom-20 right-10 w-16 h-16 bg-pink-200 rounded-full opacity-20 animate-pulse delay-1000" />
    </div>
  )
}
