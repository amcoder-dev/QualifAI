import React, { useContext } from "react"
import { useParams } from "react-router-dom"
import { LeadsContext } from "../../contexts/LeadsContext"

export const LeadDetail: React.FC = () => {
  const { id } = useParams()
  const { leads } = useContext(LeadsContext)
  const lead = leads.find((l) => l.id === id)

  if (!lead) {
    return <div className="ml-64 p-8">Lead not found</div>
  }

  return (
    <main className="ml-64 p-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={lead.image}
            alt={lead.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold">{lead.name}</h1>
            <p className="text-gray-500">{lead.industry}</p>
          </div>
        </div>

        {lead.analysis && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Sentiment Analysis</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Positive</span>
                  <span>{lead.analysis.sentiment.positive}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Neutral</span>
                  <span>{lead.analysis.sentiment.neutral}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Negative</span>
                  <span>{lead.analysis.sentiment.negative}%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Key Topics</h2>
              <div className="flex flex-wrap gap-2">
                {lead.analysis.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">
                Lead Score Breakdown
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Overall Score</span>
                  <span className="font-bold">{lead.analysis.score}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sentiment Factor (40%)</span>
                  <span>
                    {Math.round(
                      (lead.analysis.sentiment.positive -
                        lead.analysis.sentiment.negative) *
                        0.8
                    )}
                    /40
                  </span>
                </div>
                {lead.analysis.webPresenceScore && (
                  <div className="flex justify-between items-center">
                    <span>Web Presence (30%)</span>
                    <span>{lead.analysis.webPresenceScore}/30</span>
                  </div>
                )}
                {lead.analysis.relevancyScore && (
                  <div className="flex justify-between items-center">
                    <span>Market Relevancy (30%)</span>
                    <span>{lead.analysis.relevancyScore}/30</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Lead Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Website</span>
                  <a
                    href={lead.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {lead.companyWebsite?.replace("https://", "")}
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span>Call Recordings</span>
                  <span>{lead.recordCount || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Latest Activity</span>
                  <span>{lead.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Recommendation</span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      lead.analysis.score >= 80
                        ? "bg-green-100 text-green-800"
                        : lead.analysis.score >= 60
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {lead.analysis.score >= 80
                      ? "High Priority"
                      : lead.analysis.score >= 60
                        ? "Medium Priority"
                        : "Low Priority"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

