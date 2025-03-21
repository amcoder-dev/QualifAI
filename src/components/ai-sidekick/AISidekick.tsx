import React, { useState, useRef, useEffect, useContext } from 'react';
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
} from 'lucide-react';
import { LeadsContext } from '../../contexts/LeadsContext';
import { initialLeads } from '../../data/initialData';

export const AISidekick: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showLeadsDropdown, setShowLeadsDropdown] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { updateLead } = useContext(LeadsContext);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  const handleSaveToLead = (leadId: string) => {
    setSelectedLead(leadId);
    setShowLeadsDropdown(false);
    setShowConfirmation(true);
  };

  const handleConfirmSave = () => {
    if (selectedLead) {
      const selectedLeadData = initialLeads.find((l) => l.id === selectedLead);
      if (selectedLeadData) {
        updateLead(selectedLead, {
          recordCount: (selectedLeadData.recordCount || 0) + 1,
          analysis: {
            sentiment: {
              positive: 75,
              neutral: 20,
              negative: 5,
            },
            topics: ['pricing', 'features', 'integration', 'budget'],
            score: 75,
          },
        });
      }
      setShowConfirmation(false);
      setSelectedLead(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLeadsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <main className="ml-64 p-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Record a Call</h2>
          <div className="flex flex-col items-center justify-center gap-4 p-8 bg-gray-50 rounded-lg">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full ${
                  isRecording ? 'bg-red-100 animate-pulse' : 'bg-indigo-100'
                }`}
              ></div>
              <button
                className={`relative z-10 w-16 h-16 rounded-full ${
                  isRecording ? 'bg-red-500' : 'bg-indigo-600'
                } text-white flex items-center justify-center`}
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? (
                  <Square className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
            </div>
            <p className="text-lg font-medium">
              {isRecording ? 'Recording...' : 'Ready to Record'}
            </p>
            {isRecording && (
              <div className="w-full max-w-md flex justify-center">
                <Waveform className="w-full h-12 text-indigo-500" />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Audio</h2>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const file = e.dataTransfer.files[0];
              if (file) {
                setSelectedFile(file);
                setIsAnalyzing(true);
                setTimeout(() => {
                  setIsAnalyzing(false);
                }, 2000);
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
                              <img
                                src={lead.image}
                                alt={lead.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
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
                            <span className="text-sm">Positive</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Key Topics:</span>
                          <div className="flex gap-1">
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                              pricing
                            </span>
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                              features
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Lead Score:</span>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">75/100</span>
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
  );
};
