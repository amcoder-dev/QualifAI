import React, { useRef, useEffect } from "react"
import { LeadData } from "../../types"

interface LeadsDropdownProps {
  leadsList: LeadData[]
  onSelectLead: (leadId: number) => void
  show: boolean
}

export const LeadsDropdown: React.FC<LeadsDropdownProps> = ({ 
  leadsList, 
  onSelectLead, 
  show 
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // We could add a prop for handling outside clicks, but since
        // this component is specific to our use case, we can assume
        // hiding the dropdown is the only action needed
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!show) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute mt-10 bg-white rounded-lg shadow-lg p-2 z-10"
    >
      <h3 className="text-sm font-medium p-2">
        Select a Lead
      </h3>
      {leadsList.map((lead) => (
        <button
          key={lead.id}
          className="w-full text-left flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => onSelectLead(lead.id)}
        >
          <span>{lead.name}</span>
        </button>
      ))}
    </div>
  )
}