import React from "react"
import {
  Play,
  Save,
  ThumbsUp,
  Meh,
  ThumbsDown,
  MinusCircle,
  Heart,
  BarChart2
} from "lucide-react"
import { AudioAnalysisResult } from "../../types"

interface AnalysisResultsProps {
  analysisResults: AudioAnalysisResult | null
  onSaveToLeadClick: () => void
}

const SentimentDisplay = ({ sentiment }) => {
  if (!sentiment) return <span className="text-sm text-gray-400">N/A</span>
  
  const { sentiment_type, emotion, confidence_score } = sentiment
  
  // Determine sentiment icon and styling
  let sentimentIcon, sentimentLabel, sentimentColor
  
  switch (sentiment_type) {
    case "positive":
      sentimentIcon = <ThumbsUp className="w-4 h-4 text-green-500" />
      sentimentLabel = "Positive"
      sentimentColor = "text-green-500"
      break
    case "negative":
      sentimentIcon = <ThumbsDown className="w-4 h-4 text-red-500" />
      sentimentLabel = "Negative"
      sentimentColor = "text-red-500"
      break
    case "neutral":
      sentimentIcon = <MinusCircle className="w-4 h-4 text-gray-500" />
      sentimentLabel = "Neutral"
      sentimentColor = "text-gray-500"
      break
    default:
      sentimentIcon = null
      sentimentLabel = ""
      sentimentColor = ""
  }
  
  // Format confidence score as percentage
  const confidencePercentage = confidence_score 
    ? `${Math.round(confidence_score * 100)}%` 
    : null

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {sentimentIcon}
        <span className={`text-sm ${sentimentColor}`}>{sentimentLabel}</span>
      </div>
      
      {emotion && (
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-purple-500">{String(emotion).charAt(0).toUpperCase() + String(emotion).slice(1)}</span>
        </div>
      )}
      
      {confidencePercentage && (
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-blue-500" />
          <span className="text-xs text-blue-500">
            Confidence: {confidencePercentage}
          </span>
        </div>
      )}
    </div>
  )
}

const InfoRow = ({ label, children }) => (
  <div className="flex justify-between items-start py-2 border-b border-gray-200">
    <span className="text-sm font-medium text-gray-700">{label}:</span>
    <div className="flex flex-wrap justify-end max-w-[70%]">
      {children}
    </div>
  </div>
)

const TagsList = ({ items }) => {
  if (!items || items.length === 0) return <span className="text-sm text-gray-400">None detected</span>
  
  return (
    <div className="flex flex-wrap gap-1 justify-end">
      {items.map((item, index) => (
        <span
          key={index}
          className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysisResults,
  onSaveToLeadClick
}) => {
  return (
    <>
      <div className="flex justify-center gap-4 mb-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Play className="w-4 h-4" />
          Play
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={onSaveToLeadClick}
        >
          <Save className="w-4 h-4" />
          Save to Lead
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
        <h3 className="font-medium text-lg mb-4 text-gray-800">AI Analysis Preview</h3>
        <div className="space-y-1 bg-white p-3 rounded-md">
          <InfoRow label="Sentiment">
            <SentimentDisplay sentiment={analysisResults?.sentiment} />
          </InfoRow>

          <InfoRow label="Key Topics">
            <TagsList items={analysisResults?.topics} />
          </InfoRow>

          <InfoRow label="Actionable Items">
            <TagsList items={analysisResults?.actionableItems} />
          </InfoRow>
        </div>
      </div>
    </>
  )
}

