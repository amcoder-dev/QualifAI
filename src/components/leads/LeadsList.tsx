import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  FileAudio,
} from 'lucide-react';
import { LeadsContext } from '../../contexts/LeadsContext';

export const LeadsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { leads } = useContext(LeadsContext);

  return (
    <main className="ml-64 p-8">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Leads</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Plus className="w-4 h-4" />
                Create
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select className="w-full border border-gray-200 rounded-lg p-2">
                    <option>All</option>
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select className="w-full border border-gray-200 rounded-lg p-2">
                    <option>All</option>
                    <option>Retail</option>
                    <option>Manufacturing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 rounded-lg p-2"
                  />
                </div>
                <div className="flex items-end">
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-gray-500 border-b border-gray-200">
                <th className="text-left font-medium p-4">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left font-medium p-4">Lead</th>
                <th className="text-left font-medium p-4">Industry</th>
                <th className="text-left font-medium p-4">Date</th>
                <th className="text-left font-medium p-4">Records</th>
                <th className="text-left font-medium p-4">Lead Score</th>
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
                      onClick={(e) => e.stopPropagation()}
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
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        lead.status === 'Public'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{lead.size}</td>
                  <td className="p-4 text-gray-500">{lead.date}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FileAudio className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium">
                        {lead.recordCount || 0}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          (lead.analysis?.score || 0) >= 80
                            ? 'bg-green-500'
                            : (lead.analysis?.score || 0) >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      />
                      <span className="font-medium">
                        {lead.analysis?.score || 0}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing 1 to 10 of 42 results
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
