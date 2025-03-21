import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, FileAudio } from 'lucide-react';
import { LeadData } from '../../types';

interface LeadsTableProps {
  leads: LeadData[];
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-sm text-gray-500 border-b border-gray-200">
            <th className="text-left font-medium p-4">
              <input type="checkbox" className="rounded" />
            </th>
            <th className="text-left font-medium p-4">Asset Name</th>
            <th className="text-left font-medium p-4">Type</th>
            <th className="text-left font-medium p-4">Status</th>
            <th className="text-left font-medium p-4">Size</th>
            <th className="text-left font-medium p-4">Date</th>
            <th className="text-left font-medium p-4">Records</th>
            <th className="text-left font-medium p-4">Lead Score</th>
            <th className="text-left font-medium p-4">Sentiment</th>
            <th className="text-left font-medium p-4">Web Score</th>
            <th className="text-left font-medium p-4">Relevancy</th>
            <th className="text-left font-medium p-4">Actions</th>
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
                  onClick={e => e.stopPropagation()} 
                />
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={lead.image}
                    alt={lead.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <span className="font-medium">{lead.name}</span>
                </div>
              </td>
              <td className="p-4 text-gray-500">{lead.type}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  lead.status === 'Public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {lead.status}
                </span>
              </td>
              <td className="p-4 text-gray-500">{lead.size}</td>
              <td className="p-4 text-gray-500">{lead.date}</td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <FileAudio className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium">{lead.recordCount || 0}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    (lead.analysis?.score || 0) >= 80 ? 'bg-green-500' :
                    (lead.analysis?.score || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="font-medium">{lead.analysis?.score || 0}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500"
                    style={{ width: `${lead.analysis?.sentiment.positive || 0}%` }}
                  ></div>
                </div>
              </td>
              <td className="p-4">
                <span className="font-medium">{lead.analysis?.webPresenceScore || 0}</span>
              </td>
              <td className="p-4">
                <span className="font-medium">{lead.analysis?.relevancyScore || 0}</span>
              </td>
              <td className="p-4">
                <button 
                  className="text-gray-400 hover:text-gray-600" 
                  onClick={e => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};