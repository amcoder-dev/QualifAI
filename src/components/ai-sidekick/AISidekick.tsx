import React, { useState, useEffect, useContext } from "react"
import { LeadsContext } from "../../contexts/LeadsContext"
import { initialLeads } from "../../data/initialData"
import { AudioAnalysisResult, LeadData } from "../../types"
import { useAuth } from "../../hooks/useAuth"
import { AudioRecorder } from "./AudioRecorder"
import { AudioUploader } from "./AudioUploader"
import { AnalysisResults } from "./AnalysisResults"
import { LeadsDropdown } from "./LeadsDropdown"
import { ConfirmationModal } from "./ConfirmationModal"

export const AISidekick: React.FC = () => {
  const { user, supabase } = useAuth()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [leadsList, setLeadsList] = useState<LeadData[]>([])
  const [showLeadsDropdown, setShowLeadsDropdown] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedLead, setSelectedLead] = useState<number | null>(null)
  const [analysisResults, setAnalysisResults] = useState<AudioAnalysisResult | null>(null)

  const { getFirstNLeads, updateLead } = useContext(LeadsContext)

  useEffect(() => {
    getFirstNLeads(0, 1000).then((x) => setLeadsList(x))
  }, [supabase])

  // Function to analyze audio using our lead scoring service
  const analyzeAudio = async (file: File) => {
    setIsAnalyzing(true)
    try {
      if (!user) throw new Error("User is logged out")
      const formData = new FormData()
      formData.append("file", file)
      const resp = await supabase.functions.invoke("analyze-audio", {
        body: formData,
      })
      setAnalysisResults(resp.data)
      setIsAnalyzing(false)
    } catch (e) {
      console.error("Error analyzing audio:", e)
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = (file: File) => {
    setSelectedFile(file)
    analyzeAudio(file)
  }

  const handleSaveToLead = (leadId: number) => {
    setSelectedLead(leadId)
    setShowLeadsDropdown(false)
    setShowConfirmation(true)
  }

  const handleConfirmSave = async () => {
    if (selectedLead && analysisResults) {
      const { error } = await supabase
        .from("lead_audios")
        .update({ lead_id: selectedLead })
        .eq("audio_id", analysisResults.audioID)
      if (error) throw error
      const selectedLeadData = initialLeads.find((l) => l.id === selectedLead)
      if (selectedLeadData) {
        updateLead(selectedLead, {
          audios: [...selectedLeadData.audios, analysisResults],
        })
      }
      setShowConfirmation(false)
      setSelectedLead(null)
      setAnalysisResults(null)
    }
  }
  
  return (
    <main className="ml-64 p-8">
      <div className="grid grid-cols-1 gap-6">
        {/* Audio Recorder Component */}
        <AudioRecorder onRecordingComplete={handleFileUpload} />

        {/* Audio Uploader Component */}
        <AudioUploader
          selectedFile={selectedFile}
          isAnalyzing={isAnalyzing}
          onFileSelected={handleFileUpload}
          onSaveClick={() => setShowLeadsDropdown(true)}
        >
          {/* Analysis Results Component */}
          <AnalysisResults 
            analysisResults={analysisResults} 
            onSaveToLeadClick={() => setShowLeadsDropdown(true)} 
          />
          
          {/* Leads Dropdown Component */}
          <LeadsDropdown 
            leadsList={leadsList}
            onSelectLead={handleSaveToLead}
            show={showLeadsDropdown}
          />
        </AudioUploader>
      </div>

      {/* Confirmation Modal Component */}
      <ConfirmationModal
        show={showConfirmation}
        title="Save to Lead"
        message="Are you sure you want to save this analysis to the selected lead?"
        onCancel={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSave}
      />
    </main>
  )
}