import React, { useContext, useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { LeadsContext } from "../../contexts/LeadsContext"
import { AISearchData, LeadData, scoreBackground, scoreName } from "../../types"
import { Search, ArrowLeft, FileAudio, RefreshCw, ExternalLink, BarChart2 } from "lucide-react"
import axios from "axios"
import { useAuth } from "../../hooks/useAuth"
import ReactMarkdown from "react-markdown"

export const LeadDetail: React.FC = () => {
  const { user, supabase } = useAuth()
  const { id } = useParams()
  const { getLeadsWithAudioInfo, updateLead } = useContext(LeadsContext)
  const [lead, setLead] = useState<LeadData | null>()
  const [error, setError] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
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
    : null
  const relevanceWeight = lead?.weights?.relevance
    ? Math.round(lead.weights.relevance * 100)
    : 0
  const relevanceScore = lead?.weights?.relevance
    ? Math.round(lead.weights.relevance * lead.osi.relevance! * 100)
    : null

  const refreshOsi = async () => {
    try {
      setIsRefreshing(true)
      const resp = await supabase.functions.invoke("search", {
        method: "POST",
        body: { lead_id: lead?.id },
      })
      if (resp.error) throw resp.error
      lead!.osi = {
        ...lead!.osi,
        overview: resp.data.overview,
        relevance: resp.data.relevanceScore,
        companyWebsite: resp.data.websiteURL,
      }
      updateLead(lead!.id, {
        osi: {
          ...lead!.osi,
          overview: resp.data.overview,
          relevance: resp.data.relevanceScore,
          companyWebsite: resp.data.websiteURL,
        },
      })
      setLead((await getLeadsWithAudioInfo([lead!.id]))[0])
      setIsRefreshing(false)
    } catch (error) {
      console.error(error)
      setIsRefreshing(false)
    }
  }

  if (!lead) {
    if (error) return (
      <div className="ml-64 p-8">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Lead Not Found</h2>
          <p className="text-gray-500 mb-4">We couldn't find the lead you're looking for.</p>
          <Link to="/leads" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#403DA1] to-[#7349AD] text-white rounded-lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leads
          </Link>
        </div>
      </div>
    )
    return (
      <div className="ml-64 p-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-[#7349AD]/20 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-[#7349AD]/20 rounded w-3/4"></div>
              <div className="h-4 bg-[#7349AD]/20 rounded w-1/2"></div>
            </div>
          </div>
          <div className="animate-pulse mt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="h-32 bg-[#7349AD]/10 rounded"></div>
              <div className="h-32 bg-[#7349AD]/10 rounded"></div>
              <div className="h-32 bg-[#7349AD]/10 rounded"></div>
              <div className="h-32 bg-[#7349AD]/10 rounded"></div>
            </div>
          </div>
          <p className="text-center text-gray-500 mt-6">Fetching information on the lead...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="ml-64 p-8 bg-gray-50">
      {/* Navigation Bar */}
      <div className="mb-6 flex items-center">
        <Link to="/leads" className="mr-4 text-[#403DA1] hover:text-[#7349AD] transition-colors flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Back to Leads</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Lead Details</h1>
      </div>
      
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden mb-6">
        <div className="p-6 bg-gradient-to-r from-[#403DA1] to-[#7349AD]">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="flex-shrink-0 h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
                {lead.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{lead.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                    {lead.osi.industry}
                  </span>
                  {lead.audios.length > 0 && (
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm text-white flex items-center">
                      <FileAudio className="w-3 h-3 mr-1" />
                      {lead.audios.length} Recordings
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={refreshOsi}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#403DA1] rounded-lg hover:bg-white/90 transition-colors shadow-sm disabled:opacity-70"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>AI Search</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Score Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
          <div className="bg-white p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#403DA1]">Overall Score</h3>
              <p className="text-2xl font-bold mt-1">
                {typeof lead.overallScore === "number"
                  ? `${Math.round(lead.overallScore * 100)}%`
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-500">{scoreName(lead.overallScore)}</p>
            </div>
            <div className="h-16 w-16 rounded-full flex items-center justify-center">
              <div className="h-14 w-14 rounded-full relative">
                <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                {typeof lead.overallScore === "number" && (
                  <div 
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#403DA1] to-[#7349AD]"
                    style={{ 
                      clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                      opacity: lead.overallScore
                    }}
                  ></div>
                )}
                <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                  <BarChart2 className="w-6 h-6 text-[#403DA1]" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#7349AD]">Sentiment</h3>
              <p className="text-2xl font-bold mt-1">
                {typeof sentimentScore === "number" ? `${sentimentScore}%` : "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                {sentimentWeight ? `Weight: ${sentimentWeight}%` : "Not weighted"}
              </p>
            </div>
            {lead.audios.length > 0 && (
              <span className={`px-3 py-1 text-sm rounded-full ${
                lead.audios[lead.audios.length - 1].sentiment.emotion === "Positive" 
                  ? "bg-green-100 text-green-800" 
                  : lead.audios[lead.audios.length - 1].sentiment.emotion === "Negative"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {lead.audios[lead.audios.length - 1].sentiment.emotion}
              </span>
            )}
          </div>
          
          <div className="bg-white p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#AA55B9]">Relevance</h3>
              <p className="text-2xl font-bold mt-1">
                {typeof relevanceScore === "number" ? `${relevanceScore}%` : "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                {relevanceWeight ? `Weight: ${relevanceWeight}%` : "Not weighted"}
              </p>
            </div>
            <span className={`px-3 py-1 text-sm rounded-full ${scoreBackground(lead.overallScore)}`}>
              {typeof lead.overallScore !== "number"
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
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Overview */}
          {lead.osi?.overview && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-4 text-[#403DA1]">Company Overview</h2>
              <div className="prose max-w-none text-gray-700">
                <ReactMarkdown>{lead.osi.overview}</ReactMarkdown>
              </div>
            </div>
          )}
          
          {/* Key Topics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4 text-[#403DA1]">Key Topics</h2>
            <div className="flex flex-wrap gap-2">
              {unique(lead.audios.flatMap((x) => x.topics)).length > 0 ? (
                unique(lead.audios.flatMap((x) => x.topics)).map(
                  (topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#7349AD]/10 text-[#7349AD] rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  )
                )
              ) : (
                <p className="text-gray-500 italic">No key topics identified yet</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Lead Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4 text-[#403DA1]">Lead Status</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap text-right justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-700">Website</span>
                {lead.osi.companyWebsite ? (
                  <a
                    href={lead.osi.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7349AD] hover:text-[#AA55B9] transition-colors flex items-center"
                  >
                    {lead.osi.companyWebsite?.replace("https://", "")}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                ) : (
                  <span className="text-gray-400 italic">Not available</span>
                )}
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-700">Call Recordings</span>
                <span className="bg-[#7349AD]/10 px-3 py-1 rounded-full text-[#7349AD] text-sm font-medium">
                  {lead.audios.length}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-700">Latest Activity</span>
                <span className="text-gray-900 font-medium">
                  {lead.audios.length > 0
                    ? lead.audios[lead.audios.length - 1].date
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Recommendation</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${scoreBackground(lead.overallScore)}`}>
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
          
          {/* Score Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4 text-[#403DA1]">Score Details</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700">Overall Score</span>
                  <span className="font-bold text-[#403DA1]">
                    {lead?.overallScore
                      ? Math.round(lead.overallScore * 100)
                      : "0"}
                    <span className="text-gray-500 font-normal">/100</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#403DA1] to-[#7349AD]"
                    style={{ width: `${(lead.overallScore || 0) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {sentimentWeight > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700">Sentiment Score</span>
                    <span className="font-bold text-[#7349AD]">
                      {sentimentScore}
                      <span className="text-gray-500 font-normal">/{sentimentWeight}</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#7349AD] to-[#AA55B9]"
                      style={{ width: `${(sentimentScore / sentimentWeight) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {relevanceWeight > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700">Relevance Score</span>
                    <span className="font-bold text-[#AA55B9]">
                      {relevanceScore}
                      <span className="text-gray-500 font-normal">/{relevanceWeight}</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#AA55B9] to-[#e7c6ff]"
                      style={{ width: `${(relevanceScore / relevanceWeight) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}