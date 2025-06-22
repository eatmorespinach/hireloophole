"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Key, Target, Users, Mail, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50/90 flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <header className="pt-16 pb-12 text-center bg-white">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6 col-start-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Key className="h-12 w-12 text-black" />
              <h1 className="text-5xl font-bold text-black">About Hire Loophole</h1>
            </div>
            <p className="text-xl text-gray-600 font-medium leading-relaxed">
              We believe the best opportunities shouldn't be buried in resume piles. 
              <br />
              Skip the line and reach decision-makers directly.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6 col-start-4 space-y-12">
          
            {/* Mission Section */}
            <section className="text-center bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Job searching shouldn't feel like throwing your resume into a black hole. 
                We built Hire Loophole to help talented people connect directly with hiring managers and CEOs, 
                cutting through the noise to land interviews that matter.
              </p>
            </section>

            {/* How It Works */}
            <section className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <Target className="h-16 w-16 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Find the Job</h3>
                    <p className="text-gray-700">
                      Paste any job posting URL and we'll analyze the company structure to identify key decision-makers.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <Users className="h-16 w-16 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Find the People</h3>
                    <p className="text-gray-700">
                      We identify hiring managers, department heads, and CEOs with their contact information and LinkedIn profiles.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <Mail className="h-16 w-16 text-purple-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Craft the Message</h3>
                    <p className="text-gray-700">
                      Get personalized email and LinkedIn message templates that you can customize and send directly.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Why It Works */}
            <section className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Direct Outreach Works</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
                  <Zap className="h-8 w-8 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Stand Out From the Crowd</h3>
                    <p className="text-gray-700">
                      While hundreds of candidates apply through job boards, direct outreach gets you noticed by decision-makers.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                  <Target className="h-8 w-8 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Skip the Gatekeepers</h3>
                    <p className="text-gray-700">
                      Reach hiring managers and executives directly, bypassing HR filters and applicant tracking systems.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                  <Users className="h-8 w-8 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Real Connections</h3>
                    <p className="text-gray-700">
                      Personal outreach creates genuine relationships that can lead to opportunities beyond just one role.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                  <Mail className="h-8 w-8 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Higher Response Rates</h3>
                    <p className="text-gray-700">
                      Personalized messages to key contacts typically see 10x higher response rates than mass applications.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Company Values */}
            <section className="text-center bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Built for Job Seekers</h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  We're not another recruitment platform trying to monetize your data. 
                  We're a tool built by people who've been through the job search grind and wanted something better.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Every feature is designed to give you the advantage you deserve: 
                  direct access to decision-makers, personalized messaging, and the confidence that comes with knowing 
                  your application won't get lost in the shuffle.
                </p>
              </div>
            </section>
            
          </div>
        </div>
      </main>

      {/* Footer with extra spacing */}
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  )
} 