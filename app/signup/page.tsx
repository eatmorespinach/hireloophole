"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, CheckCircle, Target, Clock, Sparkles } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Navigation } from "@/components/navigation"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [outreachData, setOutreachData] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Get the outreach data from sessionStorage
    const storedData = sessionStorage.getItem("outreachData")
    if (storedData) {
      setOutreachData(JSON.parse(storedData))
    } else {
      // If no data, redirect back to home
      router.push("/")
    }
  }, [router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Check if we're in demo mode (no real Supabase configured)
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL === undefined ||
        process.env.NEXT_PUBLIC_SUPABASE_URL === "https://demo.supabase.co"
      ) {
        // Demo mode - simulate successful signup
        await new Promise((resolve) => setTimeout(resolve, 1000))
        router.push("/results")
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        // Successful signup, redirect to results
        router.push("/results")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    // Allow users to skip signup and go directly to results
    router.push("/results")
  }

  if (!outreachData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      {/* Navigation */}
      <Navigation />

      <div className="w-full min-h-screen grid lg:grid-cols-2">
        {/* Left Side - Signup Form */}
        <div className="flex items-center justify-center bg-white w-full h-full min-h-screen p-0">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center pb-4">
              <h2 className="text-xl font-bold text-gray-800">Sign Up</h2>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
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
                    minLength={6}
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
                    Creating Account...
                  </div>
                ) : (
                  "Create Free Account"
                )}
              </Button>

              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                  Not ready? See a preview
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Value Props */}
        <div className="space-y-8 px-8 lg:px-16 py-10">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Skip the line to your dream job</h3>
            <p className="text-gray-600">Forget the resume black hole and land interviews this week</p>
          </div>

          <div className="space-y-6">
            {/* Value Prop 1 */}
            <div className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-orange-100">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">10x Higher Response Rate</h4>
                <p className="text-gray-600 text-sm">
                  Get 10x more replies by reaching out directly to hiring managers—skip the job board black hole.
                </p>
              </div>
            </div>

            {/* Value Prop 2 */}
            <div className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-orange-100">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Save 5+ Hours Per Application</h4>
                <p className="text-gray-600 text-sm">
                  No more searching or writing from scratch. Instantly get everything you need.
                </p>
              </div>
            </div>

            {/* Value Prop 3 */}
            <div className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-orange-100">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">AI-Powered Personalization</h4>
                <p className="text-gray-600 text-sm">
                  Every message is tailored to you and the job—stand out with custom outreach.
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center lg:text-left p-6 bg-gradient-to-r from-orange-100 to-pink-100 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-semibold text-gray-800">Join 10,000+ job seekers</span>
            </div>
            <p className="text-sm text-gray-600">
              "I got 3 interviews in my first week using Hire Loophole. This completely changed my job search game!" -
              Sarah M.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-pulse" />
      <div className="fixed bottom-20 right-10 w-16 h-16 bg-pink-200 rounded-full opacity-20 animate-pulse delay-1000" />
    </div>
  )
}
