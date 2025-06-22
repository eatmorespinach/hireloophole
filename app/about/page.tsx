"use client"

import { Navigation } from "@/components/navigation"
import { Mail, Target, Users, Zap, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container max-w-2xl mx-auto px-4 py-12 space-y-20">
        {/* Header */}
        <header className="space-y-8">
          <div className="text-center space-y-6">
            <p className="text-xl text-muted-foreground">Meet Hoodwink the hamster. Your hiring advantage.</p>
          </div>
        </header>

        {/* Mission */}
        <section className="space-y-6">
          <h3 className="text-lg font-medium">Our Mission</h3>
          <p className="text-muted-foreground leading-relaxed">
            At Your Hiring Advantage, we believe that talent should connect directly with opportunity. We're on a mission to
            eliminate the resume black hole and help job seekers reach decision-makers who can actually hire them. Our platform
            cuts through the noise of traditional job applications and brings clarity to career advancement.
          </p>
          <div className="pt-4">
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="Professional connecting directly with hiring manager"
              width={800}
              height={400}
              className="rounded-lg"
            />
          </div>
        </section>

        {/* Story */}
        <section className="space-y-6">
          <h3 className="text-lg font-medium">Inspiration</h3>
          <p className="text-muted-foreground leading-relaxed">
          
          Inspired by my own and other folks's grumblings around the ineffectiveness of applying to a job and throwing a resume into the black hole, as well as seeing Eisenberg's idea browser around jobs, and the cherry on top was seeing a New York Times article around how hiring is broken. I decided to take on this idea. 
          <br />
          <br />
          Founded in 2024, Your Hiring Advantage was born out of frustration with the broken job application process. After watching countless talented professionals send hundreds of applications into the void, our founders realized that the system was designed to filter people out, not let the right ones in.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We started with a simple insight: the people who make hiring decisions aren't hiding—they're just buried under
            layers of process. What if we could help job seekers reach them directly? After months of research and development,
            we launched our beta to help professionals skip the line and land interviews that matter.
          </p>
        </section>

        {/* Team */}
        <section className="space-y-8">
          <h3 className="text-lg font-medium">Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Sarah Martinez",
                role: "Founder & CEO",
                image: "/placeholder-user.jpg",
              },
              {
                name: "David Chen",
                role: "Co-Founder & CTO",
                image: "/placeholder-user.jpg",
              },
            ].map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center space-y-2">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <h4 className="font-medium">{member.name}</h4>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="space-y-6">
          <h3 className="text-lg font-medium">Our Values</h3>
          <ul className="space-y-4">
            {[
              {
                title: "Direct Access",
                description: "We believe in connecting talent directly with decision-makers, not gatekeepers.",
              },
              {
                title: "Job Seeker First",
                description: "Every feature we build starts with what job seekers actually need to succeed.",
              },
              {
                title: "Results Over Process",
                description: "We care about landing interviews, not following outdated application procedures.",
              },
              {
                title: "Transparency",
                description: "We show you exactly who you're reaching and how to connect with them effectively.",
              },
            ].map((value) => (
              <li key={value.title} className="space-y-1">
                <h4 className="font-medium">{value.title}</h4>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section className="space-y-6">
          <h3 className="text-lg font-medium">Get in Touch</h3>
          <p className="text-muted-foreground">
            We're always looking to connect with job seekers, hiring managers, and career professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>hello@hireloophole.com</span>
            </Button>
            <Button variant="outline" className="bg-white text-black">
              <Link href="/">Try Your Hiring Advantage</Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Your Hiring Advantage. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
} 