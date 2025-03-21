import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { LeadsContext } from '../../contexts/LeadsContext';

export const LeadDetail: React.FC = () => {
  const { id } = useParams();
  const { leads } = useContext(LeadsContext);
  const lead = leads.find((l) => l.id === id);

  if (!lead) {
    return <div className="ml-64 p-8">Lead not found</div>;
  }

  return (
    <main className="ml-64 p-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={lead.image}
            alt={lead.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold">{lead.name}</h1>
            <p className="text-gray-500">{lead.type}</p>
          </div>
        </div>

        {lead.analysis && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Sentiment Analysis</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Positive</span>
                  <span>{lead.analysis.sentiment.positive}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Neutral</span>
                  <span>{lead.analysis.sentiment.neutral}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Negative</span>
                  <span>{lead.analysis.sentiment.negative}%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Key Topics</h2>
              <div className="flex flex-wrap gap-2">
                {lead.analysis.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
