import React, { useState, useRef, useEffect, useContext } from "react"
import {
  Mic,
  Square,
  FileAudio,
  Upload,
  Play,
  Save,
  ThumbsUp,
  Star,
  AudioWaveform as Waveform,
} from "lucide-react"
import { LeadsContext } from "../../contexts/LeadsContext"
import { initialLeads } from "../../data/initialData"
import {
  computeLeadScore,
  LeadScoringData,
} from "../../services/leadScoringService"

export const AISidekick: React.FC = () => {
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

  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [isComputing, setIsComputing] = useState(false)

  // Function to analyze audio using our lead scoring service
  const analyzeAudio = async (file: File) => {
    setIsAnalyzing(true)

    try {
      // In a real app, you would convert the file to something the API can use
      // For demo purposes, we'll simulate the process
      const reader = new FileReader()

      reader.onload = async (e) => {
        const audioData = e.target?.result

        if (audioData) {
          setIsComputing(true)

          // Get the selected lead data
          const selectedLeadData = selectedLead
            ? initialLeads.find((l) => l.id === selectedLead)
            : null

          if (selectedLeadData) {
            // Create scoring data
            const scoringData: LeadScoringData = {
              companyName: selectedLeadData.name,
              companyWebsite: selectedLeadData.companyWebsite,
              audioData: audioData as string,
            }

            // Compute the score
            const results = await computeLeadScore(scoringData)
            setAnalysisResults(results)
          }

          setIsComputing(false)
          setIsAnalyzing(false)
        }
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error analyzing audio:", error)
      setIsAnalyzing(false)
      setIsComputing(false)
    }
  }

  const handleConfirmSave = async () => {
    if (selectedLead && analysisResults) {
      const selectedLeadData = initialLeads.find((l) => l.id === selectedLead)
      if (selectedLeadData) {
        const positivePercentage = Math.round(
          (analysisResults.sentimentScore / 100) * 80
        )
        const neutralPercentage = Math.round(
          (1 - analysisResults.sentimentScore / 100) * 80
        )
        const negativePercentage = 100 - positivePercentage - neutralPercentage

        updateLead(selectedLead, {
          recordCount: (selectedLeadData.recordCount || 0) + 1,
          analysis: {
            sentiment: {
              positive: positivePercentage,
              neutral: neutralPercentage,
              negative: negativePercentage,
            },
            topics: analysisResults.topics,
            score: Math.round(analysisResults.finalScore),
            webPresenceScore: analysisResults.webPresenceScore,
            relevancyScore: analysisResults.relevancyScore,
          },
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
                {isAnalyzing || isComputing ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p>
                      {isAnalyzing
                        ? "Analyzing audio..."
                        : "Computing lead score..."}
                    </p>
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
                            <ThumbsUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm">
                              {analysisResults
                                ? analysisResults.sentimentScore > 70
                                  ? "Positive"
                                  : analysisResults.sentimentScore > 40
                                    ? "Neutral"
                                    : "Negative"
                                : "Positive"}
                            </span>
                            {analysisResults && (
                              <span className="text-xs text-gray-500">
                                ({Math.round(analysisResults.sentimentScore)}%)
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Key Topics:</span>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {analysisResults && analysisResults.topics ? (
                              analysisResults.topics.map(
                                (topic: string, index: number) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                                  >
                                    {topic}
                                  </span>
                                )
                              )
                            ) : (
                              <>
                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                                  pricing
                                </span>
                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                                  features
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Web Presence:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {analysisResults
                                ? Math.round(analysisResults.webPresenceScore)
                                : 25}
                              /50
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Market Relevancy:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {analysisResults
                                ? Math.round(analysisResults.relevancyScore)
                                : 30}
                              /50
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Lead Score:</span>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">
                              {analysisResults
                                ? Math.round(analysisResults.finalScore)
                                : 75}
                              /100
                            </span>
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

