// Types
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
  audios: {
    date: string
    sentiment: {
      emotion: string
      score: number // 0-1
    }
    topics: string[]
    actionableItems: string[]
  }[]
}

export interface LeadsContextType {
  leads: LeadData[]
  addLead: (data: LeadData) => void
  updateLead: (id: string, data: Partial<LeadData>) => void
  deleteLead: (id: string) => void
}

export interface AuthContextType {
  isAuthenticated: boolean
  user: { email: string } | null
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
