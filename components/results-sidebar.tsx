"use client"

import { useState, useEffect } from "react"
import { Clock, ExternalLink, Trash2, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface PastSearch {
  id: string
  jobTitle: string
  company: string
  url: string
  timestamp: string
  data: any
}

interface ResultsSidebarProps {
  currentData: any
  onLoadSearch: (data: any) => void
  isCollapsed: boolean
}

export function ResultsSidebar({ currentData, onLoadSearch, isCollapsed }: ResultsSidebarProps) {
  const [pastSearches, setPastSearches] = useState<PastSearch[]>([])

  useEffect(() => {
    loadPastSearches()
  }, [])

  const loadPastSearches = () => {
    try {
      const stored = localStorage.getItem("hireloophole_past_searches")
      if (stored) {
        const searches = JSON.parse(stored)
        setPastSearches(
          searches.sort(
            (a: PastSearch, b: PastSearch) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          ),
        )
      }
    } catch (error) {
      console.error("Error loading past searches:", error)
    }
  }

  const savePastSearch = (data: any) => {
    try {
      const search: PastSearch = {
        id: Date.now().toString(),
        jobTitle: data.jobDetails.title,
        company: data.jobDetails.company,
        url: data.jobDetails.url,
        timestamp: new Date().toISOString(),
        data: data,
      }

      const existing = pastSearches.filter((s) => s.url !== search.url)
      const updated = [search, ...existing].slice(0, 10) // Keep only last 10 searches

      setPastSearches(updated)
      localStorage.setItem("hireloophole_past_searches", JSON.stringify(updated))
    } catch (error) {
      console.error("Error saving past search:", error)
    }
  }

  const deletePastSearch = (id: string) => {
    try {
      const updated = pastSearches.filter((s) => s.id !== id)
      setPastSearches(updated)
      localStorage.setItem("hireloophole_past_searches", JSON.stringify(updated))
    } catch (error) {
      console.error("Error deleting past search:", error)
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Save current search when component mounts or data changes
  useEffect(() => {
    if (currentData && currentData.jobDetails) {
      savePastSearch(currentData)
    }
  }, [currentData])

  if (isCollapsed) {
    return null
  }

  return (
    <div className="w-80 h-screen bg-white/80 backdrop-blur-sm border-r border-gray-200 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Upgrade Section */}
        <div className="mb-6">
          <Card className="border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5" />
                <span className="font-semibold">Go Pro</span>
              </div>
              <p className="text-sm text-purple-100 mb-3">
                Unlock unlimited searches, advanced filters, and priority support
              </p>
              <Button
                size="sm"
                className="w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold"
                onClick={() => {
                  // Handle upgrade logic here
                  console.log("Upgrade clicked")
                }}
              >
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Past Searches Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Past Searches</h3>

          {pastSearches.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No past searches yet</p>
              <p className="text-xs mt-1">Your search history will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pastSearches.map((search) => (
                <div key={search.id} className="group relative">
                  <button
                    onClick={() => onLoadSearch(search.data)}
                    className="w-full p-3 text-left hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-200"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="font-medium text-gray-800 text-sm truncate">{search.jobTitle}</div>
                      <div className="text-gray-600 text-xs truncate">{search.company}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatDate(search.timestamp)}
                      </div>
                    </div>
                  </button>

                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(search.url, "_blank")
                      }}
                      className="h-6 w-6 p-0 hover:bg-blue-100"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        deletePastSearch(search.id)
                      }}
                      className="h-6 w-6 p-0 hover:bg-red-100 text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Quick Stats</h4>
          <Card className="border-0 bg-gradient-to-r from-orange-50 to-pink-50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{pastSearches.length}</div>
                <div className="text-xs text-gray-600">Total Searches</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
