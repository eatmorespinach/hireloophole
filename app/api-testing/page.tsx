"use client"

import { useEffect, useState } from "react"

export default function ApiTestingPage() {
  const [apiData, setApiData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        // Try to get the same data as /results (from sessionStorage)
        const storedData = sessionStorage.getItem("outreachData")
        if (storedData) {
          setApiData(JSON.parse(storedData))
        } else {
          setError("No outreachData found in sessionStorage. Please generate results first.")
        }
      } catch (err) {
        setError("Failed to load API data.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">API Testing: Available Variables</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {apiData && (
        <div className="space-y-2">
          {Object.entries(apiData).map(([key, value]) => (
            <div key={key} className="border-b py-2">
              <span className="font-mono font-semibold text-blue-700">{key}:</span>
              <pre className="ml-2 inline text-gray-800 break-all">{typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 