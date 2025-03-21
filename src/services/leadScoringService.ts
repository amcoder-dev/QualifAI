import axios from 'axios';

// API keys (would normally be in environment variables)
const JIGSAW_SPEECH_API_KEY = '' // Replace with your actual key
const JIGSAW_SENTIMENT_KEY = ''; // Replace with your actual key
const JIGSAW_WEB_SCRAPER_KEY = ''; // Replace with your actual key
const JIGSAW_WEB_SEARCH_KEY = ''; 

/**
 * Transcribes an audio file using Jigsaw Speech2Text API
 */
export async function transcribeAudio(audioData: Buffer | string): Promise<string> {
  try {
    const response = await axios.post(
      'https://jigsawstack.com/api/v1/speech-to-text',
      { file: audioData },
      {
        headers: {
          'Authorization': `Bearer ${JIGSAW_SPEECH_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.text;
  } catch (error) {
    console.error('Speech-to-text error:', error);
    return '';
  }
}

/**
 * Analyzes sentiment of a text block using Jigsaw Sentiment API
 */
export async function analyzeSentiment(text: string): Promise<number> {
  try {
    const response = await axios.post(
      'https://jigsawstack.com/api/v1/sentiment',
      { text },
      {
        headers: {
          'Authorization': `Bearer ${JIGSAW_SENTIMENT_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.sentimentScore;
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return 0;
  }
}

/**
 * Scrapes a website for relevant information
 */
export async function scrapeWebsite(url: string): Promise<any> {
  try {
    const response = await axios.post(
      'https://jigsawstack.com/api/v1/scrape',
      { url },
      {
        headers: {
          'Authorization': `Bearer ${JIGSAW_WEB_SCRAPER_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Web scraping error:', error);
    return {};
  }
}

/**
 * Performs an AI-based web search for relevant mentions
 */
export async function aiWebSearch(query: string): Promise<any> {
  try {
    const response = await axios.post(
      'https://jigsawstack.com/api/v1/ai-search',
      { query },
      {
        headers: {
          'Authorization': `Bearer ${JIGSAW_WEB_SEARCH_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('AI web search error:', error);
    return { relevantHits: [] };
  }
}

export interface LeadScoringData {
  companyName: string;
  companyWebsite?: string;
  callTranscript?: string;
  audioData?: Buffer | string;
}

export interface LeadScoreResult {
  sentimentScore: number;
  webPresenceScore: number;
  relevancyScore: number;
  finalScore: number;
  topics: string[];
}

/**
 * Computes a lead score based on multiple signals
 */
export async function computeLeadScore(lead: LeadScoringData): Promise<LeadScoreResult> {
  let sentimentScore = 0;
  let webPresenceScore = 0;
  let relevancyScore = 0;
  let topics: string[] = [];

  // Process audio data if available
  if (lead.audioData && !lead.callTranscript) {
    lead.callTranscript = await transcribeAudio(lead.audioData);
  }

  // 1. Analyze sentiment from call transcript
  if (lead.callTranscript) {
    try {
      const sentiment = await analyzeSentiment(lead.callTranscript);
      sentimentScore = sentiment * 100; // Convert [0..1] to [0..100]
      
      // Extract potential topics (simplified)
      const commonTopics = ['pricing', 'features', 'integration', 'budget', 'timeline', 'support'];
      topics = commonTopics.filter(topic => 
        lead.callTranscript?.toLowerCase().includes(topic.toLowerCase())
      );
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
  }

  // 2. Scrape company website for signals
  if (lead.companyWebsite) {
    try {
      const scrapeResult = await scrapeWebsite(lead.companyWebsite);
      
      // Example scoring based on website content
      if (scrapeResult?.keywords?.includes('AI')) {
        webPresenceScore += 10;
      }
      if (scrapeResult?.keywords?.includes('Series A') || 
          scrapeResult?.keywords?.includes('funding')) {
        webPresenceScore += 15;
      }
      if (scrapeResult?.keywords?.includes('Series B')) {
        webPresenceScore += 20;
      }
      if (scrapeResult?.keywords?.includes('Series C') || 
          scrapeResult?.keywords?.includes('IPO')) {
        webPresenceScore += 25;
      }
      
      // Add topics from website if found
      if (scrapeResult?.keywords) {
        topics = [...new Set([...topics, ...scrapeResult.keywords.slice(0, 5)])];
      }
    } catch (error) {
      console.error('Error scraping website:', error);
    }
  }

  // 3. AI Web Search for company mentions
  try {
    const query = `Check recent news or mention about ${lead.companyName}`;
    const searchResult = await aiWebSearch(query);
    
    if (searchResult?.relevantHits) {
      relevancyScore = Math.min(searchResult.relevantHits.length * 10, 50);
    }
  } catch (error) {
    console.error('Error with AI Web Search:', error);
  }

  // Calculate final score with weighted formula
  const finalScore = 0.4 * sentimentScore + 0.3 * webPresenceScore + 0.3 * relevancyScore;

  return {
    sentimentScore,
    webPresenceScore,
    relevancyScore,
    finalScore,
    topics
  };
}