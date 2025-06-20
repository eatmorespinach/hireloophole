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
  companyName: string
  ceoLinkedInUrl: string
  ceoEmail: string
  departmentHeadLinkedInUrl: string
  departmentHeadEmail: string
  departmentHeadFirstName?: string
  departmentHeadLastName?: string
  ceoFirstName?: string
  ceoLastName?: string
  jobPostUrl?: string
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

export default function ResultsPage() {
  const [data, setData] = useState<OutreachData | null>(null)
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [user, setUser] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [hmLinkedInMessageIndex, setHmLinkedInMessageIndex] = useState(0)
  const [ceoLinkedInMessageIndex, setCeoLinkedInMessageIndex] = useState(0)
  const [hmEmailMessageIndex, setHmEmailMessageIndex] = useState(0)
  const [ceoEmailMessageIndex, setCeoEmailMessageIndex] = useState(0)
  const [hmEmailExpanded, setHmEmailExpanded] = useState(true) // Default to expanded
  const [ceoEmailExpanded, setCeoEmailExpanded] = useState(true) // Default to expanded
  const router = useRouter()

  const messageTypes = ["standard", "personal", "silly"] as const

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
    emailExpanded: boolean
    setEmailExpanded: (expanded: boolean) => void
    sectionId: string
  }) => {
    const currentLinkedInMessage = data?.linkedinMessages?.[messageTypes[linkedInMessageIndex]] || ""
    const currentEmailMessage = data?.emailMessages?.[messageTypes[emailMessageIndex]] || { subject: "", body: "" }

    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">👤 {sectionTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Info with LinkedIn Button - Smaller image with aligned spacing */}
          <div className="flex items-start gap-4">
            {contact ? (
              <img
                src={contact.profileImage || "/placeholder.svg?height=96&width=96"}
                alt={contact.name || "Contact"}
                className="w-24 h-24 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=96&width=96"
                }}
              />
            ) : (
              <img
                src="/placeholder.svg?height=96&width=96"
                alt="No contact"
                className="w-24 h-24 rounded-full"
              />
            )}
            <div className="flex-1 flex flex-col justify-between h-24">
              {" "}
              {/* Match height of image */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{contact?.name || "Contact"}</h3>
                <p className="text-gray-600 mb-1">{contact?.title || "No title"}</p> {/* Reduced from mb-2 to mb-1 */}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-blue-600"
                onClick={() => {
                  console.log("LinkedIn button clicked for", sectionTitle, "URL:", contact?.linkedinUrl)
                  if (contact?.linkedinUrl) {
                    window.open(contact.linkedinUrl, "_blank")
                  } else {
                    console.log("No LinkedIn URL available for", sectionTitle)
                  }
                }}
                disabled={!contact?.linkedinUrl}
              >
                <Linkedin className="mr-2 h-4 w-4" /> 
                {contact?.linkedinUrl ? "View on LinkedIn" : "No LinkedIn Available"}
              </Button>
            </div>
          </div>

          {/* Email Section - Added padding-top for visual separation */}
          <div className="space-y-4 pt-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="border rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 p-3">
                  <div className="flex-1 text-gray-800 text-sm">{contact?.email || "N/A"}</div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(contact?.email || "", `${sectionId}-email`)}
                  >
                    {copiedItems.has(`${sectionId}-email`) ? (
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
              <div
                className="flex items-center justify-between cursor-pointer p-2 border-b"
                onClick={() => setEmailExpanded(!emailExpanded)}
              >
                <label className="text-sm font-medium text-gray-700">Email Draft</label>
                {emailExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
              {emailExpanded && (
                <div className="border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between p-2 border-b bg-white rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 capitalize">{messageTypes[emailMessageIndex]}</span>
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
                  <div className="p-4 bg-white rounded-b-lg border-t">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">{currentEmailMessage.subject}</h4>
                    <p
                      className="text-gray-700 whitespace-pre-wrap text-sm"
                      dangerouslySetInnerHTML={{ __html: currentEmailMessage.body.replace(/\n/g, "<br />") }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* LinkedIn Message Draft - No collapsible, just carousel */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">LinkedIn Draft</label>
              <div className="border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between p-2 border-b bg-white rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 capitalize">{messageTypes[linkedInMessageIndex]}</span>
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
                <div className="p-4 bg-white rounded-b-lg border-t">
                  <p
                    className="text-gray-700 whitespace-pre-wrap text-sm"
                    dangerouslySetInnerHTML={{
                      __html: currentLinkedInMessage
                        .replace(/\[Name\]/g, `<strong>${contact?.name || "there"}</strong>`)
                        .replace(/\[Job Title\]/g, `<strong>${data?.jobDetails?.title || "the role"}</strong>`)
                        .replace(/\[Company\]/g, `<strong>${data?.jobDetails?.company || "your company"}</strong>`)
                        .replace(/\n/g, "<br />"),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )

  const { jobDetails, hiringManager, ceo, tips, alternativeContacts, ceoEmail, ceoLinkedInUrl } = data

  // Debug: Log the data to see what we're working with
  console.log("Results page data:", {
    ceoEmail,
    ceoLinkedInUrl,
    departmentHeadEmail: data.departmentHeadEmail,
    departmentHeadLinkedInUrl: data.departmentHeadLinkedInUrl
  })

  return (
    <>
      <Navigation />
      <div className="flex h-screen bg-gray-50/90">
        <ResultsSidebar currentData={data} onLoadSearch={handleLoadSearch} isCollapsed={sidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <div className="p-6 space-y-8 h-full overflow-y-auto">
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => router.push("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
              </Button>
              <Button variant="ghost" onClick={toggleSidebar}>
                {sidebarCollapsed ? <PanelLeft /> : <PanelLeftClose />}
              </Button>
            </div>

            {/* Job Details Card */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>🎯 Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobDetails ? (
                  <>
                    <div className="text-2xl font-bold text-gray-900">{jobDetails.title}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-lg text-gray-700">{jobDetails.company}</div>
                      <Badge variant="secondary">{jobDetails.department}</Badge>
                    </div>
                    <div className="text-gray-600">{jobDetails.location}</div>
                    <a
                      href={jobDetails.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Job Post
                    </a>
                  </>
                ) : (
                  <div className="italic text-gray-500">Job details not available.</div>
                )}
              </CardContent>
            </Card>

            {/* Hiring Manager & CEO Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Hiring Manager Section */}
              {data.departmentHeadEmail && (
                <ContactSection
                  contact={{
                    name: `${data.departmentHeadFirstName || ''} ${data.departmentHeadLastName || ''}`.trim() || "LikelyHiring Manager",
                    title: "Department Head",
                    email: data.departmentHeadEmail,
                    linkedinUrl: data.departmentHeadLinkedInUrl,
                  }}
                  sectionTitle="Likely Hiring Manager"
                  linkedInMessageIndex={hmLinkedInMessageIndex}
                  setLinkedInMessageIndex={setHmLinkedInMessageIndex}
                  emailMessageIndex={hmEmailMessageIndex}
                  setEmailMessageIndex={setHmEmailMessageIndex}
                  emailExpanded={hmEmailExpanded}
                  setEmailExpanded={setHmEmailExpanded}
                  sectionId="hm"
                />
              )}

              {/* CEO Section */}
              {data.ceoEmail && (
                <ContactSection
                  contact={{
                    name: `${data.ceoFirstName || ''} ${data.ceoLastName || ''}`.trim() || "CEO",
                    title: "CEO",
                    email: data.ceoEmail,
                    linkedinUrl: data.ceoLinkedInUrl,
                  }}
                  sectionTitle="CEO"
                  linkedInMessageIndex={ceoLinkedInMessageIndex}
                  setLinkedInMessageIndex={setCeoLinkedInMessageIndex}
                  emailMessageIndex={ceoEmailMessageIndex}
                  setEmailMessageIndex={setCeoEmailMessageIndex}
                  emailExpanded={ceoEmailExpanded}
                  setEmailExpanded={setCeoEmailExpanded}
                  sectionId="ceo"
                />
              )}
            </div>

            {/* Alternative Contacts */}
            {Array.isArray(data.alternativeContacts) && data.alternativeContacts.length > 0 && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>👥 Alternative Contacts</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.alternativeContacts.map((contact, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-white">
                      <div className="font-semibold">{contact.name}</div>
                      <div className="text-sm text-gray-600">{contact.title}</div>
                      <div className="text-sm text-blue-600 mt-2">
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      </div>
                      <div className="text-sm text-blue-600">
                        <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Tips Section */}
            {Array.isArray(data.tips) && data.tips.length > 0 && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>💡 Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {data.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
