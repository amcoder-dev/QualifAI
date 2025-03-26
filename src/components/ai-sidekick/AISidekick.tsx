import React, { useState, useEffect, useContext } from "react"
import { LeadsContext } from "../../contexts/LeadsContext"
import { AudioAnalysisResult, LeadData } from "../../types"
import { useAuth } from "../../hooks/useAuth"
import { AudioRecorder } from "./AudioRecorder"
import { AudioUploader } from "./AudioUploader"
import { AnalysisResults } from "./AnalysisResults"
import { LeadsDropdown } from "./LeadsDropdown"
import { ConfirmationModal } from "./ConfirmationModal"
import { AlertCircle, Check } from "lucide-react"

export const AISidekick: React.FC = () => {
  const { user, supabase } = useAuth()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [leadsList, setLeadsList] = useState<LeadData[]>([])
  const [showLeadsDropdown, setShowLeadsDropdown] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedLead, setSelectedLead] = useState<number | null>(null)
  const [analysisResults, setAnalysisResults] = useState<AudioAnalysisResult | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null)

  const { getFirstNLeads, getLeadsWithAudioInfo, updateLead } = useContext(LeadsContext)

  useEffect(() => {
    getFirstNLeads(0, 1000).then((leads) => setLeadsList(leads))
  }, [])

  // Function to analyze audio using our lead scoring service
  const analyzeAudio = async (file: File) => {
    setIsAnalyzing(true)
    setSaveStatus(null)
    try {
      if (!user) throw new Error("User is not authenticated")
      const formData = new FormData()
      formData.append("file", file)
      const resp = await supabase.functions.invoke("analyze-audio", {
        body: formData,
      })
      
      if (resp.error) {
        throw new Error(resp.error.message || "Failed to analyze audio")
      }
      
      setAnalysisResults(resp.data)
    } catch (error) {
      console.error("Error analyzing audio:", error)
      setSaveStatus({
        success: false,
        message: error instanceof Error ? error.message : "Failed to analyze audio"
      })
    } finally {
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
    if (!selectedLead || !analysisResults || !analysisResults.audioID) {
      setSaveStatus({
        success: false,
        message: "Missing required data to save analysis"
      })
      return
    }
    
    setIsSaving(true)
    setSaveStatus(null)
    
    try {
      // 1. Update the lead_audios table to associate the audio with the lead
      const { error: updateError } = await supabase
        .from("lead_audios")
        .update({ lead_id: selectedLead })
        .eq("audio_id", analysisResults.audioID)
      
      if (updateError) {
        throw new Error(updateError.message || "Failed to update audio record")
      }
      
      // 2. Get the updated lead data to ensure we have the latest state
      const [updatedLead] = await getLeadsWithAudioInfo([selectedLead])
      
      if (!updatedLead) {
        throw new Error("Failed to retrieve updated lead")
      }
      
      // 3. Update the local state
      updateLead(selectedLead, {
        audios: updatedLead.audios
      })
      
      // 4. Show success message
      setSaveStatus({
        success: true,
        message: `Successfully saved analysis to ${updatedLead.name}`
      })
      
      // 5. Reset states
      setTimeout(() => {
        setShowConfirmation(false)
        setSelectedLead(null)
        setAnalysisResults(null)
        setSelectedFile(null)
      }, 2000)
      
    } catch (error) {
      console.error("Error saving to lead:", error)
      setSaveStatus({
        success: false,
        message: error instanceof Error ? error.message : "Failed to save analysis to lead"
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <main className="ml-64 p-8">
      {saveStatus && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
          saveStatus.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {saveStatus.success ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{saveStatus.message}</span>
        </div>
      )}
      
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
        message={`Are you sure you want to save this analysis to ${
          selectedLead ? leadsList.find(lead => lead.id === selectedLead)?.name || "selected lead" : "lead"
        }?`}
        onCancel={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSave}
      />
    </main>
  )
}