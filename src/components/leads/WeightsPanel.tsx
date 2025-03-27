import React, { useContext, useState } from "react"
import { LeadsContext } from "../../contexts/LeadsContext"
import { ChevronDown, ChevronUp, Info, Sliders, RotateCcw } from "lucide-react"

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

  // Helper function to create thumb indicators for our custom sliders
  const SliderThumb = ({ value, max, min }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return (
      <div 
        className="absolute w-3 h-3 bg-white border-2 border-[#7349AD] rounded-full -mt-0.5" 
        style={{ 
          left: `calc(${percentage}% - 6px)`,
          top: '50%',
          transform: 'translateY(-50%)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }}
      />
    );
  }

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div 
        className="p-4 bg-gradient-to-r from-[#403DA1] to-[#7349AD] flex items-center justify-between cursor-pointer"
        onClick={togglePanel}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">Lead Scoring Settings</h3>
          <div className="bg-white bg-opacity-20 rounded-full p-1">
            <Info className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-white opacity-80" />
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-white" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white" />
          )}
        </div>
      </div>
      
      {isOpen && (
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Adjust the importance of each factor in the lead scoring algorithm. Higher values indicate greater importance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-[#403DA1] transition-colors">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex justify-between">
                <span>Sentiment Weight</span>
                <span className="text-[#403DA1] font-bold">{weights.sentiment}</span>
              </label>
              <div className="w-full h-2 bg-gray-200 rounded-lg relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#403DA1] to-[#7349AD] rounded-lg"
                  style={{ width: `${(weights.sentiment / 10) * 100}%` }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={weights.sentiment}
                  onChange={(e) => handleWeightChange('sentiment', parseInt(e.target.value))}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <SliderThumb value={weights.sentiment} min={0} max={10} />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Impact of sentiment analysis on lead scores.</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-[#7349AD] transition-colors">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex justify-between">
                <span>Relevance Weight</span>
                <span className="text-[#7349AD] font-bold">{weights.relevance}</span>
              </label>
              <div className="w-full h-2 bg-gray-200 rounded-lg relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#7349AD] to-[#AA55B9] rounded-lg"
                  style={{ width: `${(weights.relevance / 10) * 100}%` }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={weights.relevance}
                  onChange={(e) => handleWeightChange('relevance', parseInt(e.target.value))}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <SliderThumb value={weights.relevance} min={0} max={10} />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Measures how relevant a lead is to your services.</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-[#AA55B9] transition-colors">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex justify-between">
                <span>Time Decay Factor</span>
                <span className="text-[#AA55B9] font-bold">{timeDecay.toFixed(1)}</span>
              </label>
              <div className="w-full h-2 bg-gray-200 rounded-lg relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#AA55B9] to-[#e7c6ff] rounded-lg"
                  style={{ width: `${((timeDecay - 0.1) / 0.8) * 100}%` }}
                ></div>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.1"
                  value={timeDecay}
                  onChange={(e) => handleDecayChange(parseFloat(e.target.value))}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <SliderThumb value={timeDecay} min={0.1} max={0.9} />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.1</span>
                <span>0.5</span>
                <span>0.9</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Higher values prioritize recent interactions.</p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-[#403DA1]">How It Works:</span> These settings influence how leads are scored in your pipeline. Adjust them to match your business priorities and sales cycle.
              </p>
            </div>
            <button
              onClick={() => {
                setWeights({ sentiment: 4, presence: 3, relevance: 3 });
                setTimeDecay(0.7);
              }}
              className="px-5 py-2 bg-gradient-to-r from-[#7349AD] to-[#AA55B9] text-white text-sm rounded-lg hover:shadow-md transition-shadow flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
};