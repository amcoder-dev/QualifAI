import { SupabaseClient } from "@supabase/supabase-js"

export const scoreName = (score?: number) => {
  if (typeof score !== "number") return "N/A"
  if (score > 0.8) {
    return "Positive"
  } else if (score > 0.6) {
    return "Neutral"
  } else {
    return "Negative"
  }
}

export const scoreIndicator = (score?: number) => {
  if (!score) return "bg-gray-500"
  if (score > 0.8) {
    return "bg-green-500"
  } else if (score > 0.6) {
    return "bg-yellow-500"
  } else {
    return "bg-red-500"
  }
}

export const scoreBackground = (score?: number) => {
  if (!score) return "bg-gray-500 text-white"
  if (score > 0.8) {
    return "bg-green-100 text-green-800"
  } else if (score > 0.6) {
    return "bg-yellow-100 text-yellow-800"
  } else {
    return "bg-red-100 text-red-800"
  }
}

// Types
export interface EngagementData {
  talkToListen: number
  turnTakingFrequency: number
  interruptions: number
  speechPace: number
}

export interface SentimentData {
  sentiment_type: string
  emotion: string
  confidence_score: number // 0-1
}

export interface LeadAudio {
  date: string
  sentiment: SentimentData
  engagement: EngagementData
  topics: string[]
  actionableItems: string[]
  search?: AISearchData // Added search data
}

export type AudioAnalysisResult = LeadAudio & {
  audioID: string
}

export interface LeadData {
  id: number
  name: string
  overallScore?: number // 0-1
  sentimentScore?: number // 0-1
  weights?: {
    sentiment: number // 0-1
    presence: number // 0-1
    relevance: number // 0-1
  }
  osi: {
    // Open Source Intelligence
    industry: string
    overview?: string
    relevance?: number // 0-1
    webPresence?: number // 0-1
    companyWebsite?: string
  }
  audios: {
    date: string
    sentiment: {
      sentiment_type: string|undefined
      emotion: string
      score: number // 0-1
    }
    engagement: {
      talkToListen: number
      turnTakingFrequency: number
      interruptions: number
      speechPace: number
    }
    topics: string[]
    actionableItems: string[]
  }[]
  evaluation: Record<string, any>
}

export interface LeadsContextType {
  leadCount: number
  getLeads: (ids: number[]) => Promise<LeadData[]>
  getLeadsWithAudioInfo: (ids: number[]) => Promise<LeadData[]>
  getFirstNLeads: (from: number, count: number) => Promise<LeadData[]>
  addLead: () => void
  updateLead: (id: number, data: Partial<LeadData>) => void
  deleteLead: (id: number) => void
}

export interface AuthContextType {
  supabase: SupabaseClient
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
  overview: string
  relevanceScore: number
  websiteURL: string
}

export interface LeadsContextType {
  leadCount: number
  getLeads: (ids: number[]) => Promise<LeadData[]>
  getLeadsWithAudioInfo: (ids: number[]) => Promise<LeadData[]>
  getFirstNLeads: (from: number, count: number) => Promise<LeadData[]>
  addLead: () => void
  updateLead: (id: number, data: Partial<LeadData>) => void
  deleteLead: (id: number) => void
  
  // New properties for weight configuration
  weights: {
    sentiment: number
    presence: number
    relevance: number
  }
  timeDecay: number
  setWeights: (weights: {sentiment: number, presence: number, relevance: number}) => void
  setTimeDecay: (value: number) => void
}