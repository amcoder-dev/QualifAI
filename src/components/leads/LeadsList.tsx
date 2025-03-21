import React, { useContext, useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  FileAudio,
  Trash2,
  Archive,
  Download,
} from "lucide-react"
import { LeadsContext } from "../../contexts/LeadsContext"
import { LeadsTable } from "./LeadsTable"

export const LeadsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [actionMenuId, setActionMenuId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newLead, setNewLead] = useState({
    name: "",
    type: "",
    date: new Date().toISOString().split("T")[0],
  })
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { leads } = useContext(LeadsContext)

  // Since setLeads is not available from context, implement our own local state
  const [localLeads, setLocalLeads] = useState(leads)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActionMenuId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Update localLeads when leads from context changes
  useEffect(() => {
    // Apply changes to make sure the leads have the correct names and industry values
    const updatedLeads = leads.map((lead, index) => {
      if (index === 0) {
        return { ...lead, name: "Steve", industry: "Mnufacturing" }
      } else if (index === 1) {
        return { ...lead, name: "Amy", industry: "Finance" }
      }
      return lead
    })

    setLocalLeads(updatedLeads)
  }, [leads])

  const deleteLead = (id: string) => {
    setLocalLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id))
    setActionMenuId(null)
  }

  const archiveLead = (id: string) => {
    setLocalLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === id ? { ...lead, status: "Archived" } : lead
      )
    )
    setActionMenuId(null)
  }

  const handleCreateLead = () => {
    const id = `lead-${Date.now()}`
    const newLeadWithId = {
      id,
      ...newLead,
      status: "Active",
      // Provide default values for record count and lead score
      recordCount: 0,
      analysis: { score: 0 },
    }

    // Add the new lead to the local state
    setLocalLeads((prevLeads) => [...prevLeads, newLeadWithId])

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select className="w-full border border-gray-200 rounded-lg p-2">
                    <option>All</option>
                    <option>Healthcare</option>
                    <option>Oil and Gas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select className="w-full border border-gray-200 rounded-lg p-2">
                    <option>All</option>
                    <option>Image</option>
                    <option>3D Elements</option>
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
              {localLeads.map((lead) => (
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
                    <span className="font-medium">{lead.name}</span>
                  </td>
                  <td className="p-4 text-gray-500">{lead.industry}</td>
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
                            ? "bg-green-500"
                            : (lead.analysis?.score || 0) >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <span className="font-medium">
                        {lead.analysis?.score || 0}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 relative">
                    <button
                      className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActionMenuId(
                          actionMenuId === lead.id ? null : lead.id
                        )
                      }}
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {actionMenuId === lead.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-8 top-2 w-48 bg-white rounded-md shadow-xl z-10 py-1 border border-gray-200 overflow-hidden"
                      >
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (
                              window.confirm(
                                `Are you sure you want to delete ${lead.name}?`
                              )
                            ) {
                              deleteLead(lead.id)
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                          Delete
                        </button>
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                          onClick={(e) => {
                            e.stopPropagation()
                            archiveLead(lead.id)
                          }}
                        >
                          <Archive className="w-4 h-4 mr-2 text-gray-500" />
                          Archive
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {localLeads.length > 0 ? 1 : 0} to{" "}
              {Math.min(localLeads.length, 10)} of {localLeads.length} results
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

