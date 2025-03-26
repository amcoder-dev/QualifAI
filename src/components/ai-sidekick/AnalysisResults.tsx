import React from "react"
import { Play, Save, ThumbsUp, Meh, ThumbsDown } from "lucide-react"
import { AudioAnalysisResult } from "../../types"

interface AnalysisResultsProps {
  analysisResults: AudioAnalysisResult | null
  onSaveToLeadClick: () => void
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysisResults,
  onSaveToLeadClick
}) => {
  return (
    <>
      <div className="flex justify-center gap-4 mb-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
          <Play className="w-4 h-4" />
          Play
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg"
          onClick={onSaveToLeadClick}
        >
          <Save className="w-4 h-4" />
          Save to Lead
        </button>
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
                  ({Math.round(analysisResults.sentiment.score * 100)}%)
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Relevance:</span>
            <div className="flex items-center gap-2">
              {!analysisResults ||
              !analysisResults.search ||
              analysisResults.search.relevanceScore > 0.7 ? (
                <>
                  <ThumbsUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">High</span>
                </>
              ) : analysisResults.search.relevanceScore > 0.4 ? (
                <>
                  <Meh className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Medium</span>
                </>
              ) : (
                <>
                  <ThumbsDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Low</span>
                </>
              )}
              {analysisResults && analysisResults.search && (
                <span className="text-xs text-gray-500">
                  ({Math.round(analysisResults.search.relevanceScore * 100)}%)
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
  )
}