import React, { useContext, useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { LeadsContext } from '../../contexts/LeadsContext';
import { LeadsTable } from './LeadsTable';

export const LeadsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { leads } = useContext(LeadsContext);
  
  // Filter leads based on search term
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <Download className="w-4 h-4" />
                Upload
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full border border-gray-200 rounded-lg p-2">
                    <option>All</option>
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full border border-gray-200 rounded-lg p-2">
                    <option>All</option>
                    <option>Image</option>
                    <option>3D Elements</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg p-2" />
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

        {/* Use our extracted LeadsTable component */}
        <LeadsTable leads={filteredLeads} />

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing 1 to {filteredLeads.length} of {leads.length} results</p>
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