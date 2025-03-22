// Types
export interface EngagementData {
  talkToListen: number
  turnTakingFrequency: number
  interruptions: number
  speechPace: number
}

export interface SentimentData {
  emotion: string
  score: number // 0-1
}

export interface LeadAudio {
  date: string
  sentiment: SentimentData
  engagement: EngagementData
  topics: string[]
  actionableItems: string[]
  search?: AISearchData // Added search data
}

export interface LeadData {
  id: string;
  name: string;
  overallScore?: number; // 0-1
  osi: {
    // Open Source Intelligence
    industry: string;
    relevance?: number; // 0-1
    companyWebsite?: string;
  };
  audios: {
    date: string;
    sentiment: {
      emotion: string;
      score: number; // 0-1
    };
    engagement: {
      talkToListen: number;
      turnTakingFrequency: number;
      interruptions: number;
      speechPace: number;
    };
    topics: string[];
    actionableItems: string[];
  }[];
  evaluation: Record<string, any>;
}

export interface LeadsContextType {
  leads: LeadData[]
  addLead: (data: LeadData) => void
  updateLead: (id: string, data: Partial<LeadData>) => void
  deleteLead: (id: string) => void
}

export interface AuthContextType {
  isAuthenticated: boolean
  user: { email: string; accessToken: string } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export interface StatCard {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  bgColor: string
}

export interface SearchResult {
  title: string
  url: string
  description: string
  content?: string
  site_name?: string
  site_long_name?: string
  age?: string
  language?: string
  is_safe?: boolean
  favicon?: string
  thumbnail?: string
  snippets?: string[]
}

export interface AISearchData {
  query: string
  overview: string
  results: SearchResult[]
  relevanceScore: number
  isSafe: boolean
}

export interface LeadRecord {
  lead_id: string;
  audio_id?: string | null;
  name: string;
  overall_score?: number;
  industry?: string;
  company_website?: string;
  osi_relevance?: number;
  audio_date?: string;
  sentiment_emotion?: string;
  sentiment_score?: number;
  talk_to_listen_ratio?: number;
  turn_taking_frequency?: number;
  interruptions?: number;
  speech_pace?: number;
  topics?: string[];
  actionable_items?: string[];
  created_at?: string;
  updated_at?: string;
}
