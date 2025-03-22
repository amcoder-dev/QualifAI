import { LeadData } from "../types"

// Initial leads data
export const initialLeads: LeadData[] = [
  {
    id: 1,
    name: "TechVista Solutions",
    overallScore: 0.92,
    osi: {
      industry: "Enterprise Software",
      companyWebsite: "https://techvistasolutions.com",
      webPresence: 0.87,
      relevance: 0.94,
    },
    audios: [
      {
        date: "15 March 2023",
        sentiment: {
          emotion: "positive",
          score: 0.88,
        },
        engagement: {
          talkToListen: 0.5,
          turnTakingFrequency: 0.5,
          interruptions: 5,
          speechPace: 2.34,
        },
        topics: ["implementation", "support", "pricing"],
        actionableItems: [
          "Schedule implementation timeline review",
          "Provide enhanced support documentation",
          "Present enterprise pricing options",
        ],
      },
      {
        date: "22 March 2023",
        sentiment: {
          emotion: "neutral",
          score: 0.52,
        },
        engagement: {
          talkToListen: 0.5,
          turnTakingFrequency: 0.5,
          interruptions: 5,
          speechPace: 2.34,
        },
        topics: ["technical specifications", "integration"],
        actionableItems: [
          "Prepare technical architecture document",
          "Demo API integration capabilities",
        ],
      },
    ],
    evaluation: {},
  },
  {
    id: 2,
    name: "NexaCore Industries",
    overallScore: 0.78,
    osi: {
      industry: "Manufacturing",
      companyWebsite: "https://nexacore.com",
      webPresence: 0.65,
      relevance: 0.82,
    },
    audios: [
      {
        date: "4 April 2023",
        sentiment: {
          emotion: "positive",
          score: 0.79,
        },
        engagement: {
          talkToListen: 0.5,
          turnTakingFrequency: 0.5,
          interruptions: 5,
          speechPace: 2.34,
        },
        topics: ["automation", "ROI", "implementation"],
        actionableItems: [
          "Provide ROI calculator",
          "Share automation case studies",
          "Draft implementation roadmap",
        ],
      },
    ],
    evaluation: {},
  },
  {
    id: 3,
    name: "Quantum Financial Group",
    overallScore: 0.89,
    osi: {
      industry: "Financial Services",
      companyWebsite: "https://quantumfinancial.org",
      webPresence: 0.92,
      relevance: 0.87,
    },
    audios: [
      {
        date: "12 February 2023",
        sentiment: {
          emotion: "positive",
          score: 0.91,
        },
        engagement: {
          talkToListen: 0.5,
          turnTakingFrequency: 0.5,
          interruptions: 5,
          speechPace: 2.34,
        },
        topics: ["security", "compliance", "data handling"],
        actionableItems: [
          "Share security certifications",
          "Prepare compliance documentation",
          "Schedule data architecture review",
        ],
      },
      {
        date: "18 February 2023",
        sentiment: {
          emotion: "positive",
          score: 0.85,
        },
        engagement: {
          talkToListen: 0.5,
          turnTakingFrequency: 0.5,
          interruptions: 5,
          speechPace: 2.34,
        },
        topics: ["user management", "reporting"],
        actionableItems: [
          "Demo advanced reporting features",
          "Present user hierarchy management",
        ],
      },
    ],
    evaluation: {},
  },
  {
    id: 4,
    name: "EcoSphere Innovations",
    overallScore: 0.71,
    osi: {
      industry: "Sustainability",
      companyWebsite: "https://ecosphere-innovations.net",
      webPresence: 0.58,
      relevance: 0.76,
    },
    audios: [
      {
        date: "7 May 2023",
        sentiment: {
          emotion: "mixed",
          score: 0.49,
        },
        engagement: {
          talkToListen: 0.5,
          turnTakingFrequency: 0.5,
          interruptions: 5,
          speechPace: 2.34,
        },
        topics: ["pricing", "sustainability metrics", "reporting"],
        actionableItems: [
          "Adjust pricing structure for non-profit sector",
          "Enhance sustainability reporting features",
          "Provide metrics calculation methodology",
        ],
      },
    ],
    evaluation: {},
  },
  {
    id: 5,
    name: "MediSync Healthcare",
    overallScore: 0.94,
    osi: {
      industry: "Healthcare",
      companyWebsite: "https://medisync-healthcare.com",
      webPresence: 0.89,
      relevance: 0.97,
    },
    audios: [
      {
        date: "21 January 2023",
        sentiment: {
          emotion: "positive",
          score: 0.93,
        },
        engagement: {
          talkToListen: 0.5,
          turnTakingFrequency: 0.5,
          interruptions: 5,
          speechPace: 2.34,
        },
        topics: ["HIPAA compliance", "patient data", "integration"],
        actionableItems: [
          "Provide HIPAA compliance documentation",
          "Demo patient data security features",
          "Present EMR integration capabilities",
        ],
      },
      {
        date: "28 January 2023",
        sentiment: {
          emotion: "positive",
          score: 0.9,
        },
        engagement: {
          talkToListen: 0.5,
          turnTakingFrequency: 0.5,
          interruptions: 5,
          speechPace: 2.34,
        },
        topics: ["implementation", "training", "support"],
        actionableItems: [
          "Draft implementation timeline",
          "Prepare staff training program",
          "Outline support SLAs",
        ],
      },
    ],
    evaluation: {},
  },
  {
    id: 6,
    name: "Velocity Logistics",
    overallScore: 0.83,
    osi: {
      industry: "Transportation",
      companyWebsite: "https://velocity-logistics.co",
      webPresence: 0.74,
      relevance: 0.85,
    },
    audios: [
      {
        date: "3 June 2023",
        sentiment: {
          emotion: "positive",
          score: 0.81,
        },
        engagement: {
          talkToListen: 0.5,
          turnTakingFrequency: 0.5,
          interruptions: 5,
          speechPace: 2.34,
        },
        topics: ["route optimization", "fleet management", "reporting"],
        actionableItems: [
          "Demo route optimization algorithms",
          "Present fleet management dashboard",
          "Customize reporting templates",
        ],
      },
      {
        date: "10 June 2023",
        sentiment: {
          emotion: "neutral",
          score: 0.55,
        },
        engagement: {
          talkToListen: 0.5,
          turnTakingFrequency: 0.5,
          interruptions: 5,
          speechPace: 2.34,
        },
        topics: ["mobile access", "pricing"],
        actionableItems: [
          "Provide mobile app demonstration",
          "Adjust pricing for volume needs",
        ],
      },
    ],
    evaluation: {},
  },
  {
    id: 7,
    name: "Horizon Education Partners",
    overallScore: 0.76,
    osi: {
      industry: "Education",
      companyWebsite: "https://horizonedu.edu",
      webPresence: 0.81,
      relevance: 0.72,
    },
    audios: [
      {
        date: "17 April 2023",
        sentiment: {
          emotion: "positive",
          score: 0.77,
        },
        engagement: {
          talkToListen: 0.5,
          turnTakingFrequency: 0.5,
          interruptions: 5,
          speechPace: 2.34,
        },
        topics: ["student data", "integration", "reporting"],
        actionableItems: [
          "Present student data management features",
          "Demo LMS integration capabilities",
          "Customize academic reporting",
        ],
      },
    ],
    evaluation: {},
  },
  {
    id: 8,
    name: "Fusion Retail Concepts",
    overallScore: 0.88,
    osi: {
      industry: "Retail",
      companyWebsite: "https://fusionretail.shop",
      webPresence: 0.86,
      relevance: 0.89,
    },
    audios: [
      {
        date: "5 March 2023",
        sentiment: {
          emotion: "positive",
          score: 0.87,
        },
        engagement: {
          talkToListen: 0.5,
          turnTakingFrequency: 0.5,
          interruptions: 5,
          speechPace: 2.34,
        },
        topics: ["inventory management", "customer data", "omnichannel"],
        actionableItems: [
          "Demo inventory forecasting features",
          "Present customer data analytics",
          "Showcase omnichannel capabilities",
        ],
      },
      {
        date: "12 March 2023",
        sentiment: {
          emotion: "positive",
          score: 0.84,
        },
        engagement: {
          talkToListen: 0.5,
          turnTakingFrequency: 0.5,
          interruptions: 5,
          speechPace: 2.34,
        },
        topics: ["integration", "pricing", "implementation"],
        actionableItems: [
          "Map integration points with existing systems",
          "Finalize pricing structure",
          "Draft implementation timeline",
        ],
      },
    ],
    evaluation: {},
  },
  {
    id: 9,
    name: "Elevate Construction Solutions",
    overallScore: 0.75,
    osi: {
      industry: "Construction",
      companyWebsite: "https://elevate-construction.build",
      webPresence: 0.62,
      relevance: 0.79,
    },
    audios: [
      {
        date: "9 July 2023",
        sentiment: {
          emotion: "mixed",
          score: 0.52,
        },
        engagement: {
          talkToListen: 0.5,
          turnTakingFrequency: 0.5,
          interruptions: 5,
          speechPace: 2.34,
        },
        topics: ["project management", "resource allocation", "mobile access"],
        actionableItems: [
          "Demo project tracking features",
          "Present resource management tools",
          "Showcase mobile capabilities for field staff",
        ],
      },
    ],
    evaluation: {},
  },
  {
    id: 10,
    name: "Pinnacle AgriTech",
    overallScore: 0.81,
    osi: {
      industry: "Agriculture",
      companyWebsite: "https://pinnacle-agritech.farm",
      webPresence: 0.69,
      relevance: 0.84,
    },
    audios: [
      {
        date: "24 May 2023",
        sentiment: {
          emotion: "positive",
          score: 0.83,
        },
        engagement: {
          talkToListen: 0.5,
          turnTakingFrequency: 0.5,
          interruptions: 5,
          speechPace: 2.34,
        },
        topics: ["crop management", "weather integration", "reporting"],
        actionableItems: [
          "Demo crop monitoring dashboard",
          "Present weather data integration",
          "Customize yield reporting",
        ],
      },
      {
        date: "31 May 2023",
        sentiment: {
          emotion: "positive",
          score: 0.78,
        },
        engagement: {
          talkToListen: 0.5,
          turnTakingFrequency: 0.5,
          interruptions: 5,
          speechPace: 2.34,
        },
        topics: ["mobile access", "offline capabilities", "implementation"],
        actionableItems: [
          "Demo offline data collection",
          "Present mobile field tools",
          "Draft implementation strategy for rural areas",
        ],
      },
    ],
    evaluation: {},
  },
]

