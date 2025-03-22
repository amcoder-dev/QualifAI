import React from "react"
import { useNavigate } from "react-router-dom"
import { FileAudio } from "lucide-react"
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
          <tr className="text-sm text-gray-500 border-b border-gray-200">
            <th className="text-left font-medium p-4">
              <input type="checkbox" className="rounded" />
            </th>
            <th className="text-left font-medium p-4">Company</th>
            <th className="text-left font-medium p-4">Industry</th>
            <th className="text-left font-medium p-4">Overall Lead Score</th>
            <th className="text-left font-medium p-4">Latest Sentiment</th>
            <th className="text-left font-medium p-4">Last Follow Up</th>
            <th className="text-left font-medium p-4">Records</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/leads/${lead.id}`)}
            >
              <td className="p-4">
                <input
                  type="checkbox"
                  className="rounded"
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td className="p-4 text-gray-500">{lead.name}</td>
              <td className="p-4 text-gray-500">{lead.osi.industry}</td>
              <td className="p-4 text-gray-500 flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${scoreIndicator(
                    lead.overallScore
                  )}`}
                />
                {lead.overallScore
                  ? `${Math.round(lead.overallScore * 100)}%`
                  : "N/A"}
              </td>
              {lead.audios.length > 0 ? (
                <>
                  <td className="p-4 text-gray-500">
                    {lead.audios[lead.audios.length - 1].sentiment.emotion}
                  </td>
                  <td className="p-4 text-gray-500">
                    {lead.audios[lead.audios.length - 1].date}
                  </td>
                </>
              ) : (
                <>
                  <td className="p-4 text-gray-500">N/A</td>
                  <td className="p-4 text-gray-500">N/A</td>
                </>
              )}
              <td>
                <div className="flex gap-2 text-gray-500">
                  <FileAudio className="ml-3 w-6 h-6" />
                  {lead.audios.length}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
