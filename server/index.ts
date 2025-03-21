import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import multer from "multer"
import { checkAuth, initAuth } from "./auth"
import { audioRequest, initExternalAPI } from "./externalAPI"

// Load environment variables
dotenv.config()
initAuth()
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
    if (!req.file) {
      res.status(400).json({ error: "File not provided." })
      return
    }
    try {
      res.json(await audioRequest(req.file.buffer))
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: "Server is busy. Please try again later." })
    }
  }
)

app.listen(port, () => {
  console.log("Listening on port " + port)
})
