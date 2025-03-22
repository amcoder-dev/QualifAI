import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import multer from "multer"
import { checkAuth } from "./auth"
import { audioRequest, initExternalAPI, aiSearchRequest } from "./externalAPI"
import { initSupabase } from "./supabaseClient"

// Load environment variables first
dotenv.config()

// Initialize services
initSupabase()
initExternalAPI()

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Routes
app.get("/api/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.post(
  "/api/analyze_audio",
  checkAuth,
  upload.single("file"),
  async (req, res) => {
    console.log("Audio analysis request received")

    if (!req.file) {
      console.error("No file provided")
      res.status(400).json({ error: "File not provided." })
      return
    }

    console.log(
      `File received: ${req.file.originalname || "unnamed"}, size: ${req.file.size} bytes`
    )

    try {
      // Process the audio file.
      const result = await audioRequest(req.file.buffer)
      console.log("Audio analysis complete, sending response")
      res.json(result)
      return
    } catch (e) {
      console.error("Error in audio analysis:", e)
      res.status(500).json({
        error: "Server is busy. Please try again later.",
      })
      return
    }
  }
)

// Get lead data endpoint - now using the auto-generated lead_id
app.get("/api/leads/:id", checkAuth, async (req, res) => {
  const leadId = req.params.id

  try {
    const supabase = initSupabase()
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("lead_id", leadId)
      .single()

    if (error) {
      console.error("Error fetching lead:", error)
      res.status(500).json({ error: "Failed to fetch lead data" })
      return
    }

    if (!data) {
      res.status(404).json({ error: "Lead not found" })
      return
    }

    // Format the response to match the expected LeadData structure
    const leadResponse = {
      id: data.lead_id,
      name: data.name || "Unknown Lead",
      overallScore: data.overall_score,
      osi: {
        industry: data.industry || "Unknown",
        relevance: data.osi_relevance,
        companyWebsite: data.company_website,
      },
      audios: [
        {
          date: data.audio_date,
          sentiment: {
            emotion: data.sentiment_emotion,
            score: data.sentiment_score,
          },
          engagement: {
            talkToListen: data.talk_to_listen_ratio,
            turnTakingFrequency: data.turn_taking_frequency,
            interruptions: data.interruptions,
            speechPace: data.speech_pace,
          },
          topics: data.topics || [],
          actionableItems: data.actionable_items || [],
        },
      ],
      evaluation: {},
    }

    res.json(leadResponse)
    return
  } catch (e) {
    console.error("Server error:", e)
    res.status(500).json({ error: "Server error. Please try again later." })
    return
  }
})

// Get all leads endpoint
app.get("/api/leads", checkAuth, async (_, res) => {
  try {
    const supabase = initSupabase()
    const { data, error } = await supabase
      .from("leads")
      .select("lead_id, name, industry, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching leads:", error)
      res.status(500).json({ error: "Failed to fetch leads" })
      return
    }

    res.json(data || [])
    return
  } catch (e) {
    console.error("Server error:", e)
    res.status(500).json({ error: "Server error. Please try again later." })
    return
  }
})

// Standalone AI Search route
app.post("/api/search", checkAuth, async (req, res) => {
  const { query } = req.body

  if (!query || typeof query !== "string") {
    res.status(400).json({ error: "Valid search query is required." })
    return
  }

  try {
    const searchResults = await aiSearchRequest(query)
    res.json(searchResults)
    return
  } catch (e) {
    console.error("Search error:", e)
    res.status(500).json({ error: "Search failed. Please try again later." })
    return
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
