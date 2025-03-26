import React, { createContext, useState, ReactNode, useEffect } from "react"
import { LeadAudio, LeadData, LeadsContextType } from "../types"
import { useAuth } from "../hooks/useAuth"

// New interface for user-defined weights
interface UserWeights {
  sentiment: number
  presence: number
  relevance: number
}

// Create context with default values
export const LeadsContext = createContext<LeadsContextType>({
  leadCount: 0,
  getLeads: async () => [],
  getLeadsWithAudioInfo: async () => [],
  getFirstNLeads: async () => [],
  addLead: () => {},
  updateLead: () => {},
  deleteLead: () => {},
  weights: { 
    sentiment: 4, 
    presence: 3, 
    relevance: 3 
  },
  timeDecay: 0.7,
  setWeights: () => {},
  setTimeDecay: () => {},
})

// Leads Provider Component
export const LeadsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [leadsCache, setLeadsCache] = useState<Record<number, LeadData>>({})
  const [firstIDCache, setFirstIDCache] = useState<Record<number, number[]>>({})
  const [leadCount, setLeadCount] = useState<number>(0)
  
  // New state for configurable weights and decay
  const [weights, setWeights] = useState<UserWeights>({
    sentiment: 4,
    presence: 3,
    relevance: 3,
  })
  const [timeDecay, setTimeDecay] = useState<number>(0.7)
  
  const { supabase } = useAuth()

  const getFirstNLeads = async (
    from: number,
    count: number
  ): Promise<LeadData[]> => {
    if (firstIDCache[from] && firstIDCache[from].length < count) {
      return firstIDCache[from].slice(0, count).map((x) => leadsCache[x])
    }
    const { data, error } = await supabase
      .from("leads")
      .select()
      .gte("id", from)
      .limit(count)
    if (error) throw error
    setFirstIDCache({
      ...firstIDCache,
      [from]: data.map((x) => x.id),
    })
    const lead = data.map(convertLead)
    saveLeads(lead)
    return lead
  }

  const getLeads = async (ids: number[]) => {
    if (ids.every((x) => !!leadsCache[x])) {
      return ids.map((x) => leadsCache[x])
    }
    const { data, error } = await supabase.from("leads").select().in("id", ids)
    if (error) throw error
    const lead = data.map(convertLead)
    saveLeads(lead)
    return lead
  }

  useEffect(() => {
    getFirstNLeads(0, 10)
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .then(({ count, error }) => {
        if (error) throw error
        if (count == null) throw new Error("count not returned")
        setLeadCount(count)
      })
  }, [supabase])

  function sentimentFactor(type: string): number {
    switch (type) {
      case "positive":
        return 0.7
      case "neutral":
        return 0.5
      case "negative":
        return 0.2
      default:
        return 0.5 // fallback if unknown
    }
  }

  const sentiment = (audios: LeadAudio[]): number => {
    if (!audios.length) return 0

    let weightedSum = 0
    let totalWeight = 0

    audios.forEach((audio, i) => {
      // Map sentiment_type => factor in [0..1]
      const typeValue = sentimentFactor(audio.sentiment.sentiment_type)

      // Multiply by confidence score, so we only give partial credit
      // if confidence is not 100%
      const baseScore = typeValue * audio.sentiment.confidence_score

      // Decay for older audios
      const decayWeight = Math.pow(timeDecay, i)  
      // or if you want date-based decay:
      // const daysSinceCall = (Date.now() - new Date(audioDate).getTime()) / (1000 * 3600 * 24)
      // const decayWeight = Math.pow(timeDecay, daysSinceCall) // if you prefer day-based

      // Weighted sum
      weightedSum += baseScore * decayWeight
      totalWeight += decayWeight
    })

    // Return average so final range is still [0..1]
    return totalWeight > 0 ? (weightedSum / totalWeight) : 0
  }

  // Updated to use current weights state
  const recalculate = (result: LeadData): LeadData => {
    result.sentimentScore = sentiment(result.audios)
    result.weights = { sentiment: 0, presence: 0, relevance: 0 }
    let totalWeight = 0
    let value = 0
    if (result.sentimentScore) {
      result.weights.sentiment = weights.sentiment
      value += result.sentimentScore * weights.sentiment
      totalWeight += weights.sentiment
    }

    if (result.osi.relevance) {
      result.weights.relevance = weights.relevance
      value += result.osi.relevance * weights.relevance
      totalWeight += weights.relevance
    }

    if (totalWeight > 0) {
      result.weights.sentiment /= totalWeight
      result.weights.presence /= totalWeight
      result.weights.relevance /= totalWeight
      result.overallScore = value / totalWeight
    }
    return result
  }

  const convertLead = (data: any): LeadData => {
    const result: LeadData = {
      id: data.id as number,
      name: data.name as string,
      osi: {
        industry: data.osi_industry as string,
        relevance: data.osi_relevance as number | undefined,
        companyWebsite: data.company_website as string | undefined,
        overview: data.osi_overview as string | undefined,
      },
      audios: [],
      evaluation: data.evaluation,
    }
    return recalculate(result)
  }

  const saveLeads = async (data: LeadData[]) => {
    let newLeadsCache = { ...leadsCache }
    for (const x of data) {
      newLeadsCache[x.id] = x
    }
    setLeadsCache(newLeadsCache)
  }

  const getLeadsWithAudioInfo = async (ids: number[]): Promise<LeadData[]> => {
    const [{ data, error }, leads] = await Promise.all([
      supabase
        .from("lead_audios")
        .select()
        .in("lead_id", ids)
        .order("created_at", { ascending: true }),
      getLeads(ids),
    ])
    if (error) throw error
    let result: Record<number, LeadData> = {}
    for (const lead of leads) {
      result[lead.id] = lead
      result[lead.id].audios = []
    }
    for (const x of data) {
      result[x.lead_id].audios.push({
        date: new Date(x.audio_date as string).toLocaleDateString(),
        sentiment: {
          sentiment_type: x.sentiment_type as string,
          emotion: x.sentiment_emotion as string,
          confidence_score: x.sentiment_confidence_score as number,
        },
        engagement: {
          talkToListen: x.talk_to_listen_ratio as number,
          turnTakingFrequency: x.turn_taking_frequency as number,
          interruptions: x.interruptions as number,
          speechPace: x.speech_pace as number,
        },
        topics: x.topics as string[],
        actionableItems: x.actionable_items as string[],
      })
    }
    const results = Object.keys(result).map((x) => recalculate(result[+x]))
    saveLeads(results)
    return results
  }

  const addLead = () => {
    setFirstIDCache({})
  }

  const deleteLead = (id: number) => {
    delete leadsCache[id]
    setLeadsCache({
      ...leadsCache,
    })
  }

  const updateLead = (id: number, data: Partial<LeadData>) => {
    setLeadsCache({
      ...leadsCache,
      [id]: recalculate({
        ...leadsCache[id],
        ...data,
      }),
    })
  }

  // Adding effect to recalculate all leads when weights or timeDecay change
  useEffect(() => {
    const newLeadsCache = { ...leadsCache }
    for (const id in newLeadsCache) {
      newLeadsCache[id] = recalculate(newLeadsCache[id])
    }
    setLeadsCache(newLeadsCache)
  }, [weights, timeDecay])

  return (
    <LeadsContext.Provider
      value={{
        leadCount,
        getLeads,
        getLeadsWithAudioInfo,
        getFirstNLeads,
        addLead,
        deleteLead,
        updateLead,
        weights,
        timeDecay,
        setWeights,
        setTimeDecay,
      }}
    >
      {children}
    </LeadsContext.Provider>
  )
}