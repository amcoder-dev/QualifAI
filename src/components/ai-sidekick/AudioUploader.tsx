import React, { useRef } from "react"
import { Upload, FileAudio } from "lucide-react"

interface AudioUploaderProps {
  selectedFile: File | null
  isAnalyzing: boolean
  onFileSelected: (file: File) => void
  onSaveClick: () => void
  children?: React.ReactNode
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  selectedFile,
  isAnalyzing,
  onFileSelected,
  onSaveClick,
  children
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileSelected(file)
    }
  }

  return (
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
            onFileSelected(file)
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
            ) : children}
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
  )
}