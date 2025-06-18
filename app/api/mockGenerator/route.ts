import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { jobUrl } = await request.json()

    // Call the external scraping API
    const apiRes = await fetch("https://api.logic.inc/2024-03-01/documents/extract-company-and-executive-info-from-job-posting/executions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.LOGIC_API_TOKEN}`
      },
      body: JSON.stringify({ jobPostUrl: jobUrl })
    })

    if (!apiRes.ok) {
      throw new Error("Failed to fetch from external API")
    }

    const data = await apiRes.json()
    return NextResponse.json(data.output)
  } catch (error) {
    console.error("Error in mockGenerator:", error)
    return NextResponse.json({ error: "Failed to generate outreach kit" }, { status: 500 })
  }
}
