import React, { useState, useEffect, useContext } from "react"
import { LeadsContext } from "../../contexts/LeadsContext"
import { AudioAnalysisResult, LeadData } from "../../types"
import { useAuth } from "../../hooks/useAuth"
import { AudioRecorder } from "./AudioRecorder"
import { AudioUploader } from "./AudioUploader"
import { AnalysisResults } from "./AnalysisResults"
import { ConfirmationModal } from "./ConfirmationModal"
import { AlertCircle, Check, Headphones, Save, FileAudio, X, Search } from "lucide-react"

export const AISidekick: React.FC = () => {
  const { user, supabase } = useAuth()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [leadsList, setLeadsList] = useState<LeadData[]>([])
  const [showLeadsDropdown, setShowLeadsDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
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

  // Reset search when dropdown opens
  useEffect(() => {
    if (showLeadsDropdown) {
      setSearchTerm("")
    }
  }, [showLeadsDropdown])

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

  // Filter leads based on search term
  const filteredLeads = leadsList.filter((lead) =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <main className="ml-64 p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Headphones className="w-6 h-6 mr-3 text-[#7349AD]" />
          AI Conversation Analyzer
        </h1>
        <p className="text-gray-600 mt-2">Record or upload audio conversations to analyze sentiment, topics, and more.</p>
      </div>
      
      {saveStatus && (
        <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 shadow-sm transition-all duration-300 ${
          saveStatus.success 
            ? "bg-green-50 border-green-200 text-green-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          <div className={`rounded-full p-2 ${
            saveStatus.success ? "bg-green-100" : "bg-red-100"
          }`}>
            {saveStatus.success ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
          </div>
          <span className="font-medium">{saveStatus.message}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6">
        {/* Audio Recorder Component */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-[#403DA1] to-[#7349AD] text-white">
            <h2 className="text-lg font-semibold flex items-center">
              <FileAudio className="w-5 h-5 mr-2" />
              Record Conversation
            </h2>
            <p className="text-white/80 text-sm mt-1">Capture audio directly from your microphone</p>
          </div>
          <div className="p-6">
            <AudioRecorder onRecordingComplete={handleFileUpload} />
          </div>
        </div>

        {/* Audio Uploader Component */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-[#7349AD] to-[#AA55B9] text-white">
            <h2 className="text-lg font-semibold flex items-center">
              <Save className="w-5 h-5 mr-2" />
              Upload & Analyze
            </h2>
            <p className="text-white/80 text-sm mt-1">Upload audio files or see analysis results</p>
          </div>
          <div className="p-6">
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
            </AudioUploader>
          </div>
        </div>
      </div>

      {/* Custom Modal Leads Dropdown (replaces LeadsDropdown component) */}
      {showLeadsDropdown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#403DA1]/10 to-[#7349AD]/10 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#403DA1]">Select a Lead</h3>
              <button 
                onClick={() => setShowLeadsDropdown(false)}
                className="rounded-full p-1 hover:bg-[#7349AD]/10 transition-colors"
              >
                <X className="w-5 h-5 text-[#403DA1]" />
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 pl-9 pr-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7349AD] text-sm"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto py-1">
              {filteredLeads.length === 0 ? (
                <div className="px-4 py-6 text-sm text-gray-500 text-center">
                  No leads found
                </div>
              ) : (
                filteredLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => handleSaveToLead(lead.id)}
                    className="w-full px-4 py-3 text-left hover:bg-[#7349AD]/10 transition-colors flex items-center border-b border-gray-50 last:border-0"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#403DA1] to-[#7349AD] flex items-center justify-center text-white font-medium mr-3">
                      {lead.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{lead.name}</div>
                      {lead.osi?.industry && (
                        <div className="text-xs text-gray-500">{lead.osi.industry}</div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal Component */}
      <ConfirmationModal
        show={showConfirmation}
        title="Save to Lead"
        message={`Are you sure you want to save this analysis to ${
          selectedLead ? leadsList.find(lead => lead.id === selectedLead)?.name || "selected lead" : "lead"
        }?`}
        onCancel={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSave}
        isLoading={isSaving}
      />
    </main>
  )
}