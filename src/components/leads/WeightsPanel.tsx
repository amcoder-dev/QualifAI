import React, { useContext, useState } from "react"
import { LeadsContext } from "../../contexts/LeadsContext"
import { ChevronDown, ChevronUp, Info } from "lucide-react"

export const WeightsPanel: React.FC = () => {
  const { weights, timeDecay, setWeights, setTimeDecay } = useContext(LeadsContext)
  const [isOpen, setIsOpen] = useState(false)

  const handleWeightChange = (type: 'sentiment' | 'presence' | 'relevance', value: number) => {
    setWeights({
      ...weights,
      [type]: value
    })
  }

  const handleDecayChange = (value: number) => {
    setTimeDecay(value)
  }

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div 
        className="p-4 border-b border-gray-200 flex items-center justify-between cursor-pointer"
        onClick={togglePanel}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Lead Scoring Settings</h3>
          <div className="bg-gray-100 rounded-full p-1">
            <Info className="w-4 h-4 text-gray-500" />
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </div>
      
      {isOpen && (
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Adjust the importance of each factor in the lead scoring algorithm. Higher values indicate greater importance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sentiment Weight: {weights.sentiment}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={weights.sentiment}
                onChange={(e) => handleWeightChange('sentiment', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relevance Weight: {weights.relevance}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={weights.relevance}
                onChange={(e) => handleWeightChange('relevance', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Decay Factor: {timeDecay.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={timeDecay}
                onChange={(e) => handleDecayChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.1</span>
                <span>0.5</span>
                <span>0.9</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Time Decay:</span> Higher values give more weight to recent interactions.
                </p>
              </div>
              <button
                onClick={() => {
                  setWeights({ sentiment: 4, presence: 3, relevance: 3 });
                  setTimeDecay(0.7);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};