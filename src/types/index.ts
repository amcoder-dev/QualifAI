// Types
export interface LeadData {
  id: string
  name: string
  demographic: {
    industry: string
  }
  evaluation: {
    webPresence?: number // 0-100
    relevance?: number // 0-100
    interestInProduct?: number // 0-100
  }
  date: string
  image: string
  companyWebsite?: string
  records: {
    sentiment: {
      positive: number
      neutral: number
      negative: number
    }
    topics: string[]
  }[]
}

export interface LeadsContextType {
  leads: LeadData[]
  updateLead: (id: string, data: Partial<LeadData>) => void
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
