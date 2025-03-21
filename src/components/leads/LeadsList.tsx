import React, { useContext, useState } from "react"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
} from "lucide-react"
import { LeadsContext } from "../../contexts/LeadsContext"
import { LeadsTable } from "./LeadsTable"

export const LeadsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newLead, setNewLead] = useState({
    name: "",
    type: "",
    date: new Date().toISOString().split("T")[0],
  })
  const { leads } = useContext(LeadsContext)

  const handleCreateLead = () => {
    const id = `lead-${Date.now()}`
    // TODO: Send request to backend.

    // Close the modal
    setShowCreateModal(false)

    // Reset the form
    setNewLead({
      name: "",
      type: "",
      date: new Date().toISOString().split("T")[0],
    })
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
              <button
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                onClick={() => setShowCreateModal(true)}
              >
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
                    Industry
                  </label>
                  <select className="w-full border border-gray-200 rounded-lg p-2">
                    <option>All</option>
                    <option>Healthcare</option>
                    <option>Oil and Gas</option>
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
        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-col justify-between">
            <p className="p-4 text-sm text-gray-500">
              Showing {leads.length > 0 ? 1 : 0} to {Math.min(leads.length, 10)}{" "}
              of {leads.length} results
            </p>
            {/* Use our extracted LeadsTable component */}
            <LeadsTable leads={filteredLeads} />

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing 1 to {filteredLeads.length} of {leads.length} results
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

          {/* Create Lead Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Create New Lead</h3>
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
                        className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                        className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select Industry</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Retail">Retail</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Oil and Gas">Oil and Gas</option>
                        <option value="3D Elements">3D Elements</option>
                        <option value="Image">Image</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={newLead.date}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
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
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      disabled={!newLead.name || !newLead.type}
                    >
                      Create Lead
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
