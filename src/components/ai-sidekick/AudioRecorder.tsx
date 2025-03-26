import React, { useState, useRef, useEffect } from "react"
import { Mic, Square } from "lucide-react"
import { MediaRecorder, register } from 'extendable-media-recorder'
import { connect } from 'extendable-media-recorder-wav-encoder'

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioData, setAudioData] = useState<{
    volume: number
    tone: "low" | "medium" | "high"
  }>({ volume: 0.5, tone: "medium" })

  const animationRef = useRef<number | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  // Register the WAV encoder when component mounts
  useEffect(() => {
    const registerWavEncoder = async () => {
      try {
        await register(await connect())
        console.log("WAV encoder registered successfully")
      } catch (error) {
        console.error("Failed to register WAV encoder:", error)
      }
    }
    
    registerWavEncoder()
  }, [])

  // Simulate audio volume and tone changes during recording
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

  const startRecording = async () => {
    try {
      // Reset audio chunks
      audioChunksRef.current = []
      
      // Request microphone access with echo cancellation
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
        } 
      })
      
      streamRef.current = stream
      
      // Create media recorder with WAV format
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/wav'
      })
      
      mediaRecorderRef.current = mediaRecorder
  
      // Set up event handlers
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      })
      
      mediaRecorder.addEventListener('stop', async () => {
        try {
          // Create a blob from all chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
          
          // Create a file from the blob
          const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, {
            type: 'audio/wav'
          })
          
          // Pass the file to the parent component
          onRecordingComplete(audioFile)
          
        } catch (error) {
          console.error("Error processing recording:", error)
        } finally {
          // Always clean up the stream
          cleanupStream()
        }
      })
      
      // Start recording
      mediaRecorder.start()
      setIsRecording(true)
      
    } catch (error) {
      console.error("Error starting recording:", error)
      setIsRecording(false)
    }
  }
  
  // Function to clean up the stream
  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }
    
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
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

  return (
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
            onClick={toggleRecording}
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
  )
}