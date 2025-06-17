import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { jobUrl } = await request.json()

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock generated data with proper placeholder images
    const mockData = {
      jobDetails: {
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        department: "Engineering",
        location: "San Francisco, CA",
        url: jobUrl,
      },
      hiringManager: {
        name: "Sarah Chen",
        title: "VP of Engineering",
        email: "sarah.chen@techcorp.com",
        linkedinUrl: "https://linkedin.com/in/sarahchen",
        profileImage: "/placeholder.svg?height=112&width=112",
      },
      personalizedMessage: {
        subject: "Excited about the Senior Frontend Developer role at TechCorp",
        body: `Hi Sarah,

I came across the Senior Frontend Developer position at TechCorp and I'm genuinely excited about the opportunity to contribute to your engineering team.

Your recent work on scaling TechCorp's platform architecture really caught my attention, especially the innovative approach to micro-frontends that you shared in your LinkedIn post last month.

I'd love to discuss how my experience with React, TypeScript, and distributed systems could help drive TechCorp's frontend initiatives forward.

Would you be open to a brief conversation about this role?

Best regards,
[Your Name]`,
      },
      alternativeContacts: [
        {
          name: "Mike Rodriguez",
          title: "Senior Engineering Manager",
          email: "mike.rodriguez@techcorp.com",
          linkedinUrl: "https://linkedin.com/in/mikerodriguez",
        },
        {
          name: "Lisa Park",
          title: "Head of Talent Acquisition",
          email: "lisa.park@techcorp.com",
          linkedinUrl: "https://linkedin.com/in/lisapark",
        },
      ],
      tips: [
        "Best time to reach out: Tuesday-Thursday, 10-11 AM PST",
        "Sarah is active on LinkedIn and responds well to thoughtful messages",
        "Mention TechCorp's recent Series B funding round to show you're informed",
        "Follow up after 1 week if no response",
      ],
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error in mockGenerator:", error)
    return NextResponse.json({ error: "Failed to generate outreach kit" }, { status: 500 })
  }
}
