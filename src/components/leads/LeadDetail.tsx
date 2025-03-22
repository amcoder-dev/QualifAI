import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { LeadsContext } from "../../contexts/LeadsContext"
import { LeadData, scoreBackground, scoreName } from "../../types"

export const LeadDetail: React.FC = () => {
  const { id } = useParams()
  const { getLeadsWithAudioInfo } = useContext(LeadsContext)
  const [lead, setLead] = useState<LeadData | null>()
  const [error, setError] = useState(false)
  useEffect(() => {
    getLeadsWithAudioInfo([+(id ?? 0)])
      .then(([x]) => setLead(x))
      .catch((e) => {
        console.error(e)
        setError(true)
      })
  }, [id])

  const unique = <T,>(x: T[]): T[] => x.filter((v, i) => x.indexOf(v) === i)
  const sentimentWeight = lead?.weights?.sentiment
    ? Math.round(lead.weights.sentiment * 100)
    : 0
  const sentimentScore = lead?.weights?.sentiment
    ? Math.round(lead.weights.sentiment * lead.sentimentScore! * 100)
    : 0
  const presenceWeight = lead?.weights?.sentiment
    ? Math.round(lead.weights.presence * 100)
    : 0
  const presenceScore = lead?.weights?.presence
    ? Math.round(lead.weights.presence * lead.osi.webPresence! * 100)
    : 0
  const relevanceWeight = lead?.weights?.relevance
    ? Math.round(lead.weights.relevance * 100)
    : 0
  const relevanceScore = lead?.weights?.relevance
    ? Math.round(lead.weights.relevance * lead.osi.relevance! * 100)
    : 0

  if (!lead) {
    if (error) return <div className="ml-64 p-8">Lead not found</div>
    return <div className="ml-64 p-8">Fetching information on the lead</div>
  }

  return (
    <main className="ml-64 p-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{lead.name}</h1>
            <p className="text-gray-500">{lead.osi.industry}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Sentiment Analysis</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{scoreName(lead.overallScore)}</span>
                <span>
                  {lead.overallScore
                    ? `${Math.round(lead.overallScore * 100)}%`
                    : "Unknown"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Key Topics</h2>
            <div className="flex flex-wrap gap-2">
              {unique(lead.audios.flatMap((x) => x.topics)).map(
                (topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Lead Score Breakdown</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Overall Score</span>
                <span className="font-bold">
                  {lead?.overallScore
                    ? Math.round(lead.overallScore * 100)
                    : "Unknown"}
                  /100
                </span>
              </div>
              {sentimentWeight ? (
                <div className="flex justify-between items-center">
                  <span>Sentiment Factor ({sentimentWeight}%)</span>
                  <span>{sentimentScore}%</span>
                </div>
              ) : (
                <></>
              )}
              {presenceWeight ? (
                <div className="flex justify-between items-center">
                  <span>Web Presence ({presenceWeight}%)</span>
                  <span>{presenceScore}%</span>
                </div>
              ) : (
                <></>
              )}
              {relevanceWeight ? (
                <div className="flex justify-between items-center">
                  <span>Company Relevance ({relevanceWeight}%)</span>
                  <span>{relevanceScore}%</span>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Lead Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Website</span>
                <a
                  href={lead.osi.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  {lead.osi.companyWebsite?.replace("https://", "")}
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span>Call Recordings</span>
                <span>{lead.audios.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Latest Activity</span>
                <span>
                  {lead.audios.length > 0
                    ? lead.audios[lead.audios.length - 1].date
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Recommendation</span>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${scoreBackground(lead.overallScore)}`}
                >
                  {!lead.overallScore
                    ? "Research Further"
                    : lead.overallScore >= 0.8
                      ? "High Priority"
                      : lead.overallScore >= 0.6
                        ? "Medium Priority"
                        : "Low Priority"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
