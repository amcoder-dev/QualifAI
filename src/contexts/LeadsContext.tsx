import React, { createContext, useState, ReactNode, useEffect } from "react"
import { LeadData, LeadsContextType } from "../types"
import { useAuth } from "../hooks/useAuth"

// Create context with default values
export const LeadsContext = createContext<LeadsContextType>({
  leadCount: 0,
  getLeads: async () => [],
  getLeadsWithAudioInfo: async () => [],
  getFirstNLeads: async () => [],
  addLead: () => {},
  updateLead: () => {},
  deleteLead: () => {},
})

// Leads Provider Component
export const LeadsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [leadsCache, setLeadsCache] = useState<Record<number, LeadData>>({})
  const [firstIDCache, setFirstIDCache] = useState<Record<number, number[]>>({})
  const [leadCount, setLeadCount] = useState<number>(0)
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
        if (!count) throw new Error("count not returned")
        setLeadCount(count)
      })
  }, [supabase])

  const convertLead = (data: any): LeadData => {
    return {
      id: data.id as number,
      name: data.name as string,
      osi: {
        industry: data.osi_industry as string,
        relevance: data.osi_relevance as number | undefined,
        companyWebsite: data.company_website as string | undefined,
      },
      audios: [],
      evaluation: data.evaluation,
    }
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
    }
    for (const x of data) {
      result[x.lead_id].audios.push({
        date: new Date(x.audio_date as string).toLocaleDateString(),
        sentiment: {
          emotion: x.sentiment_emotion as string,
          score: x.sentiment_score as number,
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
    const results = Object.keys(result).map((x) => result[+x])
    saveLeads(results)
    return results
  }

  const addLead = (data: LeadData) => {
    setLeadsCache({
      ...leadsCache,
      [data.id]: data,
    })
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
      [id]: {
        ...leadsCache[id],
        ...data,
      },
    })
  }

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
      }}
    >
      {children}
    </LeadsContext.Provider>
  )
}
