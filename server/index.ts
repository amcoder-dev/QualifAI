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

// Standalone AI Search route
app.post("/api/search", checkAuth, async (req, res) => {
  const { lead_id } = req.body

  if (!lead_id || typeof lead_id !== "number") {
    res.status(400).json({ error: "Valid search query is required." })
    return
  }

  const { data, error } = await initSupabase()
    .from("leads")
    .select()
    .eq("id", lead_id)
  if (error) {
    console.error("Search error:", error)
    res.status(500).json({ error: "Search failed. Please try again later." })
    return
  }
  if (data.length === 0) {
    console.error("Invalid lead ID")
    res.status(400).json({ error: "Valid search query is required." })
    return
  }

  try {
    const searchResults = await aiSearchRequest(data[0].name as string)
    res.json(searchResults)
    initSupabase()
      .from("leads")
      .update({
        osi_relevance: searchResults.relevanceScore,
        osi_company_website: searchResults.websiteURL,
      })
      .eq("id", lead_id)
      .then(({ error }) => {
        if (error) console.error(error)
      })
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
