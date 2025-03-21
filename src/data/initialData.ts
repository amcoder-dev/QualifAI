import { LeadData } from "../types"

// Initial leads data
export const initialLeads: LeadData[] = [
  {
    id: "1",
    name: "Abstract Element",
    overallScore: 0.85,
    osi: {
      industry: "3D Elements",
      companyWebsite: "https://abstractelement.com",
      webPresence: 0.3,
      relevance: 0.45,
    },
    audios: [
      {
        date: "31 July 2023",
        sentiment: {
          emotion: "positive",
          score: 0.75,
        },
        topics: ["pricing", "features"],
        actionableItems: [
          "Improve pricing transparency",
          "Enhance feature list",
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Abstract Minimal",
    overallScore: 0.65,
    osi: {
      industry: "Image",
      companyWebsite: "https://abstractminimal.io",
      webPresence: 0.25,
      relevance: 0.2,
    },
    audios: [
      {
        date: "31 July 2023",
        sentiment: {
          emotion: "positive",
          score: 0.6,
        },
        topics: ["integration", "budget"],
        actionableItems: [
          "Explore integration options",
          "Review budget allocation",
        ],
      },
    ],
  },
]
