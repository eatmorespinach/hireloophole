"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Mail,
  Linkedin,
  Copy,
  CheckCircle,
  PanelLeft,
  PanelLeftClose,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Navigation } from "@/components/navigation"
import { ResultsSidebar } from "@/components/results-sidebar"

interface OutreachData {
  jobDetails: {
    title: string
    company: string
    department: string
    location: string
    url: string
  }
  hiringManager: {
    name: string
    title: string
    email: string
    linkedinUrl: string
    profileImage: string
  }
  ceo: {
    name: string
    title: string
    email: string
    linkedinUrl: string
    profileImage: string
  }
  linkedinMessages: {
    standard: string
    personal: string
    silly: string
  }
  emailMessages: {
    standard: { subject: string; body: string }
    personal: { subject: string; body: string }
    silly: { subject: string; body: string }
  }
  personalizedMessage: {
    subject: string
    body: string
  }
  alternativeContacts: Array<{
    name: string
    title: string
    email: string
    linkedinUrl: string
  }>
  tips: string[]
}

// Mock CEO data since it's not in the current data structure
const mockCEO = {
  name: "David Kim",
  title: "CEO & Founder",
  email: "david.kim@techcorp.com",
  linkedinUrl: "https://linkedin.com/in/davidkim",
  profileImage: "/placeholder.svg?height=112&width=112",
}

// Mock LinkedIn messages
const mockLinkedInMessages = {
  standard:
    "Hi [Name], I saw the [Job Title] role at [Company] and I'm really excited about the opportunity. I'd love to connect and learn more about the position.",
  personal:
    "Hey [Name]! I've been following [Company]'s journey and I'm genuinely impressed by your recent work on [specific project]. I'd love to chat about the [Job Title] role.",
  silly:
    "Hi [Name]! 🚀 I promise I'm more professional than this emoji suggests, but I couldn't resist reaching out about the [Job Title] role at [Company]!",
}

// Mock Email messages - 50% shorter
const mockEmailMessages = {
  standard: {
    subject: "Excited about the Senior Frontend Developer role at TechCorp",
    body: `Hi [Name],

I came across the Senior Frontend Developer position at TechCorp and I'm genuinely excited about the opportunity.

I'd love to discuss how my experience with React and TypeScript could help drive TechCorp's frontend initiatives forward.

Would you be open to a brief conversation?

Best regards,
[Your Name]`,
  },
  personal: {
    subject: "Your recent work on micro-frontends caught my attention",
    body: `Hi [Name],

Your recent work on scaling TechCorp's platform architecture really caught my attention, especially the micro-frontends approach you shared on LinkedIn.

I'd love to chat about how my distributed systems experience could contribute to your team's success.

Best,
[Your Name]`,
  },
  silly: {
    subject: "🚀 Frontend Developer ready for takeoff at TechCorp!",
    body: `Hi [Name],

I promise I'm more professional than this emoji suggests! 😄

I'm genuinely excited about the Senior Frontend Developer role and would love to discuss how I can help TechCorp's frontend team reach new heights.

Ready when you are!
[Your Name]`,
  },
}

// Mock email addresses - 2 options
const mockEmailAddresses = {
  primary: "sarah.chen@techcorp.com",
  alternative: "s.chen@techcorp.com",
}

export default function ResultsPage() {
  const [data, setData] = useState<OutreachData | null>(null)
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [user, setUser] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [hmLinkedInMessageIndex, setHmLinkedInMessageIndex] = useState(0)
  const [ceoLinkedInMessageIndex, setCeoLinkedInMessageIndex] = useState(0)
  const [hmEmailMessageIndex, setHmEmailMessageIndex] = useState(0)
  const [ceoEmailMessageIndex, setCeoEmailMessageIndex] = useState(0)
  const [hmEmailAddressIndex, setHmEmailAddressIndex] = useState(0)
  const [ceoEmailAddressIndex, setCeoEmailAddressIndex] = useState(0)
  const [hmEmailExpanded, setHmEmailExpanded] = useState(true) // Default to expanded
  const [ceoEmailExpanded, setCeoEmailExpanded] = useState(true) // Default to expanded
  const router = useRouter()

  const messageTypes = ["standard", "personal", "silly"] as const
  const emailAddressOptions = [mockEmailAddresses.primary, mockEmailAddresses.alternative]

  useEffect(() => {
    const storedData = sessionStorage.getItem("outreachData")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      // Add mock data for CEO, LinkedIn messages, and email messages
      const enhancedData = {
        ...parsedData,
        ceo: mockCEO,
        linkedinMessages: mockLinkedInMessages,
        emailMessages: mockEmailMessages,
      }
      setData(enhancedData)
    } else {
      router.push("/")
    }
  }, [router])

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems((prev) => new Set(prev).add(itemId))
      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleLoadSearch = (searchData: any) => {
    const enhancedData = {
      ...searchData,
      ceo: mockCEO,
      linkedinMessages: mockLinkedInMessages,
      emailMessages: mockEmailMessages,
    }
    setData(enhancedData)
    sessionStorage.setItem("outreachData", JSON.stringify(enhancedData))
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const ContactSection = ({
    contact,
    sectionTitle,
    linkedInMessageIndex,
    setLinkedInMessageIndex,
    emailMessageIndex,
    setEmailMessageIndex,
    emailAddressIndex,
    setEmailAddressIndex,
    emailExpanded,
    setEmailExpanded,
    sectionId,
  }: {
    contact: any
    sectionTitle: string
    linkedInMessageIndex: number
    setLinkedInMessageIndex: (index: number) => void
    emailMessageIndex: number
    setEmailMessageIndex: (index: number) => void
    emailAddressIndex: number
    setEmailAddressIndex: (index: number) => void
    emailExpanded: boolean
    setEmailExpanded: (expanded: boolean) => void
    sectionId: string
  }) => {
    const currentLinkedInMessage = data?.linkedinMessages?.[messageTypes[linkedInMessageIndex]] || ""
    const currentEmailMessage = data?.emailMessages?.[messageTypes[emailMessageIndex]] || { subject: "", body: "" }
    const currentEmailAddress = emailAddressOptions[emailAddressIndex]

    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">👤 {sectionTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Info with LinkedIn Button - Smaller image with aligned spacing */}
          <div className="flex items-start gap-4">
            <img
              src={contact.profileImage || "/placeholder.svg?height=96&width=96"}
              alt={contact.name}
              className="w-24 h-24 rounded-full" // Reduced from w-28 h-28
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=96&width=96"
              }}
            />
            <div className="flex-1 flex flex-col justify-between h-24">
              {" "}
              {/* Match height of image */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{contact.name}</h3>
                <p className="text-gray-600 mb-1">{contact.title}</p> {/* Reduced from mb-2 to mb-1 */}
              </div>
              <div className="self-start">
                {" "}
                {/* Align button to bottom */}
                <Button
                  size="sm"
                  onClick={() => window.open(contact.linkedinUrl, "_blank")}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-xs"
                >
                  <Linkedin className="h-3 w-3" />
                  Open{" "}
                  {contact.linkedinUrl.split("/in/")[1] ? `/in/${contact.linkedinUrl.split("/in/")[1]}` : "Profile"}
                </Button>
              </div>
            </div>
          </div>

          {/* LinkedIn Section */}
          <div className="space-y-4">
            {/* LinkedIn Message Draft with Carousel */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Personalized LI Drafts</label>
              <div className="border rounded-lg bg-gray-50">
                {/* Message Type Indicator */}
                <div className="flex items-center justify-between p-3 border-b bg-white rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {messageTypes[linkedInMessageIndex]}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {linkedInMessageIndex + 1} of {messageTypes.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setLinkedInMessageIndex(Math.max(0, linkedInMessageIndex - 1))}
                      disabled={linkedInMessageIndex === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setLinkedInMessageIndex(Math.min(messageTypes.length - 1, linkedInMessageIndex + 1))
                      }
                      disabled={linkedInMessageIndex === messageTypes.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex items-start gap-2 p-3">
                  <div className="flex-1 text-gray-800 text-sm">{currentLinkedInMessage}</div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(currentLinkedInMessage, `${sectionId}-linkedin-${linkedInMessageIndex}`)
                    }
                  >
                    {copiedItems.has(`${sectionId}-linkedin-${linkedInMessageIndex}`) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Email Section - Added padding-top for visual separation */}
          <div className="space-y-4 pt-6">
            {/* Email Address with Carousel */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="border rounded-lg bg-gray-50">
                {/* Email Address Indicator */}
                <div className="flex items-center justify-between p-2 border-b bg-white rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {emailAddressIndex + 1} of {emailAddressOptions.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEmailAddressIndex(Math.max(0, emailAddressIndex - 1))}
                      disabled={emailAddressIndex === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEmailAddressIndex(Math.min(emailAddressOptions.length - 1, emailAddressIndex + 1))
                      }
                      disabled={emailAddressIndex === emailAddressOptions.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Email Address Content */}
                <div className="flex items-center gap-2 p-3">
                  <div className="flex-1 text-gray-800 text-sm">{currentEmailAddress}</div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(currentEmailAddress, `${sectionId}-email-${emailAddressIndex}`)}
                  >
                    {copiedItems.has(`${sectionId}-email-${emailAddressIndex}`) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Email Message Draft - Collapsible with Carousel */}
            <div className="space-y-2">
              <button
                onClick={() => setEmailExpanded(!emailExpanded)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Email Drafts
                {emailExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {emailExpanded && (
                <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                  {/* Email Type Indicator */}
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {messageTypes[emailMessageIndex]}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {emailMessageIndex + 1} of {messageTypes.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEmailMessageIndex(Math.max(0, emailMessageIndex - 1))}
                        disabled={emailMessageIndex === 0}
                        className="h-6 w-6 p-0"
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEmailMessageIndex(Math.min(messageTypes.length - 1, emailMessageIndex + 1))}
                        disabled={emailMessageIndex === messageTypes.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Subject Line</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-2 bg-gray-50 rounded border text-sm">{currentEmailMessage.subject}</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(
                            currentEmailMessage.subject,
                            `${sectionId}-email-subject-${emailMessageIndex}`,
                          )
                        }
                      >
                        {copiedItems.has(`${sectionId}-email-subject-${emailMessageIndex}`) ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Message Body</label>
                    <div className="flex gap-2">
                      <div className="flex-1 p-2 bg-gray-50 rounded border text-sm">
                        <pre className="whitespace-pre-wrap font-sans text-xs">{currentEmailMessage.body}</pre>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(currentEmailMessage.body, `${sectionId}-email-body-${emailMessageIndex}`)
                        }
                        className="self-start"
                      >
                        {copiedItems.has(`${sectionId}-email-body-${emailMessageIndex}`) ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your outreach kit...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      {/* Navigation */}
      <Navigation />

      <div className="flex">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? "w-0" : "w-80"} overflow-hidden`}>
          <ResultsSidebar currentData={data} onLoadSearch={handleLoadSearch} isCollapsed={sidebarCollapsed} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="px-6 py-8 max-w-4xl mx-auto">
            {/* Header with Sidebar Toggle */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/")}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </div>

              {/* Sidebar Toggle Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSidebar}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
              >
                {sidebarCollapsed ? (
                  <>
                    <PanelLeft className="h-4 w-4" />
                    Show History
                  </>
                ) : (
                  <>
                    <PanelLeftClose className="h-4 w-4" />
                    Hide History
                  </>
                )}
              </Button>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">🎉 Your Outreach Kit is Ready!</h1>
              <div className="text-gray-600">
                <p>Here's everything you need to bypass the resume pile</p>
                <p className="text-center">
                  for your{" "}
                  <a
                    href={data.jobDetails.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 font-medium underline"
                  >
                    {data.jobDetails.title}
                  </a>{" "}
                  role.
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              {/* Hiring Manager Section */}
              <ContactSection
                contact={data.hiringManager}
                sectionTitle="Hiring Manager"
                linkedInMessageIndex={hmLinkedInMessageIndex}
                setLinkedInMessageIndex={setHmLinkedInMessageIndex}
                emailMessageIndex={hmEmailMessageIndex}
                setEmailMessageIndex={setHmEmailMessageIndex}
                emailAddressIndex={hmEmailAddressIndex}
                setEmailAddressIndex={setHmEmailAddressIndex}
                emailExpanded={hmEmailExpanded}
                setEmailExpanded={setHmEmailExpanded}
                sectionId="hm"
              />

              {/* CEO Section */}
              <ContactSection
                contact={data.ceo}
                sectionTitle="CEO"
                linkedInMessageIndex={ceoLinkedInMessageIndex}
                setLinkedInMessageIndex={setCeoLinkedInMessageIndex}
                emailMessageIndex={ceoEmailMessageIndex}
                setEmailMessageIndex={setCeoEmailMessageIndex}
                emailAddressIndex={ceoEmailAddressIndex}
                setEmailAddressIndex={setCeoEmailAddressIndex}
                emailExpanded={ceoEmailExpanded}
                setEmailExpanded={setCeoEmailExpanded}
                sectionId="ceo"
              />

              {/* Alternative Contacts - Keep as is */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">👥 Alternative Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.alternativeContacts.map((contact, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">{contact.name}</h4>
                          <p className="text-sm text-gray-600">{contact.title}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(contact.email, `alt-email-${index}`)}
                          >
                            {copiedItems.has(`alt-email-${index}`) ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Mail className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(contact.linkedinUrl, "_blank")}
                          >
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pro Tips - Keep as is */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">💡 Pro Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Badge variant="secondary" className="mt-0.5 bg-orange-100 text-orange-700">
                          {index + 1}
                        </Badge>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="text-center mt-8">
              <Button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Generate Another Kit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
