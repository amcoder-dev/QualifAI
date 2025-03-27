import React from "react"
import { useNavigate } from "react-router-dom"
import { FileAudio, ExternalLink, MoreVertical } from "lucide-react"
import { LeadData, scoreIndicator } from "../../types"

interface LeadsTableProps {
  leads: LeadData[]
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads }) => {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-y border-gray-200">
            <th className="text-left font-medium p-4 text-[#403DA1]">
              <div className="flex items-center">
                <input type="checkbox" className="rounded border-[#7349AD] focus:ring-[#7349AD]" />
              </div>
            </th>
            <th className="text-left font-medium p-4 text-[#403DA1]">Company</th>
            <th className="text-left font-medium p-4 text-[#403DA1]">Industry</th>
            <th className="text-left font-medium p-4 text-[#403DA1]">Overall Lead Score</th>
            <th className="text-left font-medium p-4 text-[#403DA1]">Latest Sentiment</th>
            <th className="text-left font-medium p-4 text-[#403DA1]">Last Follow Up</th>
            <th className="text-left font-medium p-4 text-[#403DA1]">Records</th>
            <th className="text-left font-medium p-4 text-[#403DA1] w-12">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr
              key={lead.id}
              className={`border-b border-gray-100 hover:bg-[#7349AD]/5 cursor-pointer transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              }`}
              onClick={() => navigate(`/leads/${lead.id}`)}
            >
              <td className="p-4" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  className="rounded border-[#7349AD] focus:ring-[#7349AD]"
                />
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-[#403DA1] to-[#7349AD] flex items-center justify-center text-white font-medium">
                    {lead.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{lead.name}</div>
                    {lead.email && <div className="text-sm text-gray-500">{lead.email}</div>}
                  </div>
                </div>
              </td>
              <td className="p-4">
                <span className="px-2 py-1 text-xs rounded-full bg-[#7349AD]/10 text-[#7349AD] font-medium">
                  {lead.osi.industry}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${scoreIndicator(
                      lead.overallScore
                    )} shadow-sm flex-shrink-0`}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {lead.overallScore
                        ? `${Math.round(lead.overallScore * 100)}%`
                        : "N/A"}
                    </span>
                    {lead.overallScore && (
                      <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full bg-gradient-to-r from-[#403DA1] to-[#AA55B9]" 
                          style={{ width: `${(lead.overallScore) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </td>
              {lead.audios.length > 0 ? (
                <>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      lead.audios[lead.audios.length - 1].sentiment.emotion === "Positive" 
                        ? "bg-green-100 text-green-800" 
                        : lead.audios[lead.audios.length - 1].sentiment.emotion === "Negative"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {lead.audios[lead.audios.length - 1].sentiment.emotion}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700">
                    <span className="font-medium">{lead.audios[lead.audios.length - 1].date}</span>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-4 text-gray-400 italic">N/A</td>
                  <td className="p-4 text-gray-400 italic">N/A</td>
                </>
              )}
              <td className="p-4">
                <div className="flex items-center gap-2 text-[#7349AD]">
                  <FileAudio className="w-4 h-4" />
                  <span className="bg-[#7349AD]/10 px-2 py-1 rounded-full text-xs">
                    {lead.audios.length}
                  </span>
                </div>
              </td>
              <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center py-12">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="rounded-full bg-[#7349AD]/10 p-3 mb-3">
                    <FileAudio className="w-6 h-6 text-[#7349AD]" />
                  </div>
                  <p className="text-gray-500 mb-1">No leads found</p>
                  <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}