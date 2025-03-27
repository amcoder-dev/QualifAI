import React, { useContext, useEffect, useState } from "react"
import { Search, Filter, ChevronLeft, ChevronRight, Plus, ArrowUpDown, BarChart2 } from "lucide-react"
import { LeadsContext } from "../../contexts/LeadsContext"
import { LeadsTable } from "./LeadsTable"
import { WeightsPanel } from "./WeightsPanel" 
import { useAuth } from "../../hooks/useAuth"
import { LeadData } from "../../types"

export const LeadsList: React.FC = () => {
  const { supabase } = useAuth()
  const [from, setFrom] = useState(0)
  const [page, setPage] = useState(1)
  const [leads, setLeads] = useState<LeadData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showWeights, setShowWeights] = useState(false)
  const [newLead, setNewLead] = useState({
    name: "",
    type: "",
  })
  const { addLead, getFirstNLeads, getLeadsWithAudioInfo, leadCount } =
    useContext(LeadsContext)
  useEffect(() => {
    getFirstNLeads(from, 10)
      .then((leads) => {
        setLeads(leads)
        return getLeadsWithAudioInfo(leads.map((x) => x.id))
      })
      .then((leadsWithAudio) => setLeads(leadsWithAudio))
  }, [from])

  const goToFirst = () => {
    setFrom(0)
    setPage(1)
  }
  const goToNext = () => {
    if (leads.length === 0 || page === Math.ceil(leadCount / 10)) return
    setFrom(leads[leads.length - 1].id)
    setPage(page + 1)
  }

  const handleCreateLead = async () => {
    const { error } = await supabase.from("leads").insert({
      name: newLead.name,
      osi_industry: newLead.type,
      evaluation: {},
    })
    if (error) throw error

    // Close the modal
    setShowCreateModal(false)

    // Reset the form
    setNewLead({
      name: "",
      type: "",
    })
    addLead()
    getFirstNLeads(from, 10)
      .then((leads) => {
        setLeads(leads)
        return getLeadsWithAudioInfo(leads.map((x) => x.id))
      })
      .then((leadsWithAudio) => setLeads(leadsWithAudio))
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setNewLead((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Filter leads based on search term
  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="ml-64 p-8 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Leads Management</h1>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm"
            onClick={() => setShowWeights(!showWeights)}
          >
            <BarChart2 className="w-4 h-4 text-[#7349AD]" />
            <span>Scoring Settings</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#403DA1] to-[#7349AD] text-white rounded-lg hover:shadow-md transition-shadow"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
            <span>Create Lead</span>
          </button>
        </div>
      </div>

      {showWeights && (
        <div className="mb-6">
          <WeightsPanel />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#403DA1]/10 to-[#7349AD]/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-64">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7349AD]"
              />
            </div>
            <div className="flex items-center gap-2 self-end">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-[#7349AD] transition-colors"
              >
                <Filter className="w-4 h-4 text-[#7349AD]" />
                <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-[#7349AD] transition-colors"
              >
                <ArrowUpDown className="w-4 h-4 text-[#7349AD]" />
                <span>Sort</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <select className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-[#7349AD] focus:border-transparent">
                    <option>All</option>
                    <option>Healthcare</option>
                    <option>Retail</option>
                    <option>Manufacturing</option>
                    <option>Technology</option>
                    <option>Finance</option>
                    <option>Oil and Gas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-[#7349AD] focus:border-transparent"
                  />
                </div>
                <div className="flex items-end">
                  <button className="px-4 py-2 bg-[#403DA1] text-white border border-[#403DA1] rounded-lg hover:bg-[#7349AD] transition-colors">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-0">
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-[#7349AD]/10 rounded-full p-4 mb-4">
                <BarChart2 className="w-8 h-8 text-[#7349AD]" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No leads found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first lead</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#403DA1] to-[#7349AD] text-white rounded-lg hover:shadow-md transition-shadow"
              >
                <Plus className="w-4 h-4" />
                Create Lead
              </button>
            </div>
          ) : (
            <>
              <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing {filteredLeads.length > 0 ? 1 : 0} to {Math.min(filteredLeads.length, 10)} of {leads.length} leads
                </p>
                <div className="flex items-center gap-2">
                  <select className="border border-gray-200 rounded-lg text-sm p-1 focus:ring-2 focus:ring-[#7349AD] focus:border-transparent">
                    <option>10 per page</option>
                    <option>25 per page</option>
                    <option>50 per page</option>
                  </select>
                </div>
              </div>
              
              {/* Use our extracted LeadsTable component */}
              <LeadsTable leads={filteredLeads} />
  
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Page {page} of {Math.max(1, Math.ceil(leadCount / 10))}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-[#403DA1] disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={goToFirst}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-[#403DA1] disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={goToNext}
                      disabled={leads.length === 0 || page === Math.ceil(leadCount / 10)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Lead Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-[#403DA1]">Create New Lead</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleCreateLead()
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lead Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newLead.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter lead name"
                    className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-[#7349AD] focus:border-transparent"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry*
                  </label>
                  <select
                    name="type"
                    value={newLead.type}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-[#7349AD] focus:border-transparent"
                  >
                    <option value="">Select Industry</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Oil and Gas">Oil and Gas</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#403DA1] to-[#7349AD] text-white rounded-lg hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  disabled={!newLead.name || !newLead.type}
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}