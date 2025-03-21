import React, { useState, useRef, useEffect, useContext } from "react"
import {
  Mic,
  Square,
  FileAudio,
  Upload,
  Play,
  Save,
  ThumbsUp,
  Meh,
  ThumbsDown,
} from "lucide-react"
import { LeadsContext } from "../../contexts/LeadsContext"
import { initialLeads } from "../../data/initialData"
import axios from "axios"
import { LeadAudio } from "../../types"
import { useAuth } from "../../hooks/useAuth"

export const AISidekick: React.FC = () => {
  const { user } = useAuth()

  const [isRecording, setIsRecording] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showLeadsDropdown, setShowLeadsDropdown] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedLead, setSelectedLead] = useState<string | null>(null)
  const [audioData, setAudioData] = useState<{
    volume: number
    tone: "low" | "medium" | "high"
  }>({ volume: 0.5, tone: "medium" })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const { updateLead } = useContext(LeadsContext)

  // Simulate audio volume and tone changes
  useEffect(() => {
    if (isRecording) {
      let lastUpdate = Date.now()

      const simulateAudioChanges = () => {
        const now = Date.now()
        // Only update every 100ms to create a natural rhythm
        if (now - lastUpdate > 100) {
          // Generate random volume (0.2 to 1)
          const newVolume = 0.2 + Math.random() * 0.8

          // Determine tone based on ranges
          let newTone: "low" | "medium" | "high" = "medium"
          if (newVolume < 0.4) newTone = "low"
          else if (newVolume > 0.7) newTone = "high"

          setAudioData({ volume: newVolume, tone: newTone })
          lastUpdate = now
        }
        animationRef.current = requestAnimationFrame(simulateAudioChanges)
      }
      animationRef.current = requestAnimationFrame(simulateAudioChanges)
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [isRecording])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Start the analysis process with real data
      analyzeAudio(file)
    }
  }

  const handleSaveToLead = (leadId: string) => {
    setSelectedLead(leadId)
    setShowLeadsDropdown(false)
    setShowConfirmation(true)
  }

  const [analysisResults, setAnalysisResults] = useState<LeadAudio | null>(null)

  // Function to analyze audio using our lead scoring service
  const analyzeAudio = async (file: File) => {
    setIsAnalyzing(true)
    try {
      if (!user) throw new Error("User is logged out")
      const formData = new FormData()
      formData.append("file", file)
      const resp = await axios.post<LeadAudio>(
        `${import.meta.env.VITE_SERVER_URL}/api/analyze_audio`,
        formData,
        {
          headers: {
            "Content-Type": `multipart/form-data`,
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      setAnalysisResults(resp.data)
      setIsAnalyzing(false)
    } catch (e) {
      setIsAnalyzing(false)
    }
  }

  const handleConfirmSave = async () => {
    if (selectedLead && analysisResults) {
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

  // Get color based on tone
  const getToneColor = () => {
    switch (audioData.tone) {
      case "low":
        return "bg-blue-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-indigo-500"
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLeadsDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <main className="ml-64 p-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Record a Call</h2>
          <div className="flex flex-col items-center justify-center gap-4 p-8 bg-gray-50 rounded-lg">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full ${
                  isRecording ? "bg-red-100 animate-pulse" : "bg-indigo-100"
                }`}
                style={{
                  transform: isRecording
                    ? `scale(${0.8 + audioData.volume * 0.4})`
                    : "scale(1)",
                  transition: "transform 0.1s ease-out",
                }}
              ></div>
              <button
                className={`relative z-10 w-16 h-16 rounded-full ${
                  isRecording ? getToneColor() : "bg-indigo-600"
                } text-white flex items-center justify-center`}
                onClick={() => setIsRecording(!isRecording)}
                style={{
                  transform: isRecording
                    ? `scale(${0.9 + audioData.volume * 0.3}) translateY(${(audioData.volume - 0.5) * 10}px)`
                    : "scale(1)",
                  transition: "transform 0.1s ease-out, background-color 0.2s",
                }}
              >
                {isRecording ? (
                  <Square className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
            </div>
            <p className="text-lg font-medium">
              {isRecording ? "Recording..." : "Ready to Record"}
            </p>
            {isRecording && (
              <div className="w-full max-w-md flex justify-center">
                <div className="w-full h-16 flex items-center justify-center">
                  {Array.from({ length: 30 }).map((_, i) => {
                    // Calculate a "randomized" height based on the current volume and position
                    const barPosition = i / 30
                    const distanceFromCenter = Math.abs(barPosition - 0.5) * 2
                    const baseHeight =
                      audioData.volume * (1 - distanceFromCenter * 0.5)
                    const randomFactor =
                      Math.sin(i * 0.5 + Date.now() * 0.005) * 0.2
                    const height = baseHeight * (1 + randomFactor)

                    return (
                      <div
                        key={i}
                        className={`mx-0.5 ${getToneColor().replace("bg-", "bg-opacity-80 bg-")}`}
                        style={{
                          height: `${Math.max(5, height * 64)}px`,
                          width: "3px",
                          transition: "height 0.1s ease-out",
                        }}
                      ></div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Audio</h2>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const file = e.dataTransfer.files[0]
              if (file) {
                setSelectedFile(file)
                analyzeAudio(file)
              }
            }}
          >
            {selectedFile ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <FileAudio className="w-8 h-8 text-indigo-500" />
                  <div className="text-left">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {Math.round(selectedFile.size / 1024)} KB
                    </p>
                  </div>
                </div>
                {isAnalyzing ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p>Analyzing audio...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center gap-4 mb-4">
                      <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
                        <Play className="w-4 h-4" />
                        Play
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg"
                        onClick={() => setShowLeadsDropdown(true)}
                      >
                        <Save className="w-4 h-4" />
                        Save to Lead
                      </button>
                      {showLeadsDropdown && (
                        <div
                          ref={dropdownRef}
                          className="absolute mt-10 bg-white rounded-lg shadow-lg p-2 z-10"
                        >
                          <h3 className="text-sm font-medium p-2">
                            Select a Lead
                          </h3>
                          {initialLeads.map((lead) => (
                            <button
                              key={lead.id}
                              className="w-full text-left flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                              onClick={() => handleSaveToLead(lead.id)}
                            >
                              <span>{lead.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">AI Analysis Preview</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Sentiment:</span>
                          <div className="flex items-center gap-2">
                            {!analysisResults ||
                            analysisResults.sentiment.score > 0.7 ? (
                              <>
                                <ThumbsUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm">Positive</span>
                              </>
                            ) : analysisResults.sentiment.score > 0.4 ? (
                              <>
                                <Meh className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm">Neutral</span>
                              </>
                            ) : (
                              <>
                                <ThumbsDown className="w-4 h-4 text-red-500" />
                                <span className="text-sm">Negative</span>
                              </>
                            )}
                            {analysisResults && (
                              <span className="text-xs text-gray-500">
                                (
                                {Math.round(
                                  analysisResults.sentiment.score * 100
                                )}
                                %)
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Key Topics:</span>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {(analysisResults?.topics ?? []).map(
                              (topic: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                                >
                                  {topic}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Actionable Items:</span>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {(analysisResults?.actionableItems ?? []).map(
                              (action: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                                >
                                  {action}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="mb-2">Drag and drop your audio file here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="audio/*"
                  onChange={handleFileUpload}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Save to Lead</h3>
            <p className="mb-6">
              Are you sure you want to save this analysis to the selected lead?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border border-gray-200 rounded-lg"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                onClick={handleConfirmSave}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
