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
  id: string
  name: string

  overallScore?: number // 0-1
  osi: {
    // Open Source Intelligence
    industry: string
    webPresence?: number // 0-1
    relevance?: number // 0-1
    companyWebsite?: string
  }
  audios: LeadAudio[]
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
