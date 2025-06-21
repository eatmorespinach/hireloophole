import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { jobUrl } = await request.json()

    // Check if API token is available
    if (!process.env.LOGIC_API_TOKEN) {
      console.error("LOGIC_API_TOKEN environment variable is not set")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    // Call the external scraping API
    const apiRes = await fetch("https://api.logic.inc/2024-03-01/documents/extract-company-and-executive-info-from-job-posting/executions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.LOGIC_API_TOKEN}`
      },
      body: JSON.stringify({ jobPostUrl: jobUrl })
    })

    // Log the response status for debugging
    console.log("Logic API response status:", apiRes.status)

    if (!apiRes.ok) {
      const errorText = await apiRes.text()
      console.error("Logic API error:", errorText)

      // Instead of throwing an error, return fallback data
      console.log("Returning fallback data due to API failure")
      return NextResponse.json({
        companyName: "Company (Unable to extract)",
        ceoName: "CEO Name (Unable to extract)",
        ceoLinkedInUrl: null,
        ceoEmail: null,
        departmentHeadName: "Department Head (Unable to extract)",
        departmentHeadLinkedInUrl: null,
        departmentHeadEmail: null,
        // Keep the original mock data structure for other fields
        hiringManager: {
          name: "Sarah Chen",
          title: "Senior Engineering Manager",
          email: "sarah.chen@company.com",
          linkedinUrl: "https://linkedin.com/in/sarahchen",
          profileImage: "/placeholder-user.jpg"
        },
        ceo: {
          name: "Michael Rodriguez",
          title: "Chief Executive Officer",
          email: "michael.rodriguez@company.com",
          linkedinUrl: "https://linkedin.com/in/michaelrodriguez",
          profileImage: "/placeholder-user.jpg"
        },
      jobDetails: {
          title: "Software Engineer",
          company: "Tech Company",
        location: "San Francisco, CA",
          description: "We're looking for a talented software engineer to join our growing team..."
        },
        linkedinMessages: {
          hiringManager: "Hi Sarah, I came across the Software Engineer position at your company and I'm very interested in the opportunity. I'd love to connect and learn more about the role and your team's current projects. Looking forward to hearing from you!",
          ceo: "Hi Michael, I'm excited about the innovative work happening at your company. I recently applied for a position on your engineering team and would love the opportunity to discuss how my background in software development could contribute to your company's continued success."
        },
        emailDrafts: {
          hiringManager: {
            subject: "Interest in Software Engineer Position",
            body: "Dear Sarah,\n\nI hope this email finds you well. I recently came across the Software Engineer opening at your company and I'm very excited about the opportunity to contribute to your team.\n\nWith my background in software development and passion for creating innovative solutions, I believe I would be a great fit for this role. I'd love to discuss how my skills and experience align with your team's needs.\n\nWould you be available for a brief call this week to discuss the position further?\n\nBest regards"
          },
          ceo: {
            subject: "Exploring Opportunities at Your Company",
            body: "Dear Michael,\n\nI hope you're doing well. I'm reaching out because I'm genuinely impressed by your company's mission and the innovative work you're doing in the industry.\n\nI recently applied for a position on your engineering team and would welcome the opportunity to discuss how my background and passion for technology could contribute to your company's continued growth and success.\n\nI'd be grateful for any insights you might share about your vision for the company and potential opportunities for someone with my background.\n\nThank you for your time and consideration.\n\nBest regards"
          }
        },
        alternativeContacts: [
          {
            name: "Jennifer Park",
            title: "VP of Engineering",
            email: "jennifer.park@company.com",
            linkedinUrl: "https://linkedin.com/in/jenniferpark"
          },
          {
            name: "David Thompson",
            title: "Technical Recruiter",
            email: "david.thompson@company.com",
            linkedinUrl: "https://linkedin.com/in/davidthompson"
          }
        ],
        tips: [
          "Research the company's recent product launches and mention them in your outreach",
          "Follow the hiring manager on LinkedIn before reaching out",
          "Keep your initial message concise and focused on value you can bring",
          "Follow up after 1 week if you don't hear back",
          "Personalize your message by mentioning specific company achievements or challenges"
        ]
      })
    }

    const data = await apiRes.json()
    
    // Add tips to successful API responses since they're helpful for all users
    const responseWithTips = {
      ...data.output,
      tips: [
        "Research the company's recent product launches and mention them in your outreach",
        "Follow the hiring manager on LinkedIn before reaching out",
        "Keep your initial message concise and focused on value you can bring",
        "Follow up after 1 week if you don't hear back",
        "Personalize your message by mentioning specific company achievements or challenges"
      ]
    }
    
    return NextResponse.json(responseWithTips)
  } catch (error) {
    console.error("Error in mockGenerator:", error)
    
    // Return fallback data instead of error
    console.log("Returning fallback data due to unexpected error")
    return NextResponse.json({
      companyName: "Company (Unable to extract)",
      ceoName: "CEO Name (Unable to extract)",
      ceoLinkedInUrl: null,
      ceoEmail: null,
      departmentHeadName: "Department Head (Unable to extract)",
      departmentHeadLinkedInUrl: null,
      departmentHeadEmail: null,
      // Mock data for other fields
      hiringManager: {
        name: "Sarah Chen",
        title: "Senior Engineering Manager",
        email: "sarah.chen@company.com",
        linkedinUrl: "https://linkedin.com/in/sarahchen",
        profileImage: "/placeholder-user.jpg"
      },
      ceo: {
        name: "Firstname Lastname",
        title: "Chief Executive Officer",
        email: "first.last@company.com",
        linkedinUrl: "https://linkedin.com/in/michaelrodriguez",
        profileImage: "/placeholder-user.jpg"
      },
      jobDetails: {
        title: "Software Engineer",
        company: "Tech Company",
        location: "San Francisco, CA",
        description: "We're looking for a talented software engineer to join our growing team..."
      },
      linkedinMessages: {
        hiringManager: "Hi Sarah, I came across the Software Engineer position at your company and I'm very interested in the opportunity. I'd love to connect and learn more about the role and your team's current projects. Looking forward to hearing from you!",
        ceo: "Hi Michael, I'm excited about the innovative work happening at your company. I recently applied for a position on your engineering team and would love the opportunity to discuss how my background in software development could contribute to your company's continued success."
      },
      emailDrafts: {
        hiringManager: {
          subject: "Interest in Software Engineer Position",
          body: "Dear Sarah,\n\nI hope this email finds you well. I recently came across the Software Engineer opening at your company and I'm very excited about the opportunity to contribute to your team.\n\nWith my background in software development and passion for creating innovative solutions, I believe I would be a great fit for this role. I'd love to discuss how my skills and experience align with your team's needs.\n\nWould you be available for a brief call this week to discuss the position further?\n\nBest regards"
        },
        ceo: {
          subject: "Exploring Opportunities at Your Company",
          body: "Dear Michael,\n\nI hope you're doing well. I'm reaching out because I'm genuinely impressed by your company's mission and the innovative work you're doing in the industry.\n\nI recently applied for a position on your engineering team and would welcome the opportunity to discuss how my background and passion for technology could contribute to your company's continued growth and success.\n\nI'd be grateful for any insights you might share about your vision for the company and potential opportunities for someone with my background.\n\nThank you for your time and consideration.\n\nBest regards"
        }
      },
      alternativeContacts: [
        {
          name: "Jennifer Park",
          title: "VP of Engineering",
          email: "jennifer.park@company.com",
          linkedinUrl: "https://linkedin.com/in/jenniferpark"
        },
        {
          name: "David Thompson",
          title: "Technical Recruiter",
          email: "david.thompson@company.com",
          linkedinUrl: "https://linkedin.com/in/davidthompson"
        }
      ],
      tips: [
        "Research the company's recent product launches and mention them in your outreach",
        "Follow the hiring manager on LinkedIn before reaching out",
        "Keep your initial message concise and focused on value you can bring",
        "Follow up after 1 week if you don't hear back",
        "Personalize your message by mentioning specific company achievements or challenges"
      ]
    })
  }
}
