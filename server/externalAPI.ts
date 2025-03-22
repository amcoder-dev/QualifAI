import crypto from "crypto"
import axios from "axios"
import { z } from "zod"
import { JigsawStack } from "jigsawstack"
import { initSupabase } from "./supabaseClient"
import type {
  EngagementData,
  SentimentData,
  AISearchData,
  AudioAnalysisResult,
} from "../src/types"

import {
  extractActions,
  overtalk,
  speechPacePause,
  talkToListen,
  topicExtraction,
  turnTakingFrequency,
  calculateAISearchRelevantScorePrompt,
} from "./prompt"

let jigsawStack: ReturnType<typeof JigsawStack>
let OPENAI_API_KEY: string | undefined
export const initExternalAPI = () => {
  let { JIGSAW_API_KEY, OPENAI_API_KEY: openAI } = process.env
  OPENAI_API_KEY = openAI
  jigsawStack = JigsawStack({
    apiKey: JIGSAW_API_KEY,
  })
}

export const audioRequest = async (
  audio: Buffer
): Promise<AudioAnalysisResult> => {
  try {
    console.log("Starting audio analysis")

    // Generate transcript
    console.log("Generating transcript")
    const transcript = await generateTranscript(audio)
    console.log("Transcript generated successfully")

    console.log("Starting parallel analysis tasks")
    const [sentimentResp, engagementResp, topicResp, actionResp] =
      await Promise.all([
        sentiment(transcript),
        engagementPrompts(transcript),
        topicPrompt(transcript),
        extractActionsPrompt(transcript),
      ])
    console.log("All analysis tasks completed")

    let audioID = crypto.randomBytes(16).toString("hex")
    // Insert into Supabase and get the auto-generated lead ID
    try {
      console.log("Storing data in Supabase")
      const supabase = initSupabase()

      // Insert a new record
      const { data, error } = await supabase
        .from("lead_audios")
        .insert({
          sentiment_emotion: sentimentResp.emotion,
          sentiment_score: sentimentResp.score,
          talk_to_listen_ratio: engagementResp.talkToListen,
          turn_taking_frequency: engagementResp.turnTakingFrequency,
          interruptions: engagementResp.interruptions,
          speech_pace: engagementResp.speechPace,
          topics: topicResp,
          actionable_items: actionResp,
        })
        .select()
      if (error) {
        console.error("Error storing lead data:", error)
      } else {
        console.log("Lead data stored successfully:", data)
      }
    } catch (error) {
      console.error("Error inserting lead data:", error)
    }

    // Return the response
    return {
      audioID: audioID,
      date: new Date().toDateString(),
      sentiment: sentimentResp,
      engagement: engagementResp,
      topics: topicResp,
      actionableItems: actionResp,
    }
  } catch (error) {
    console.error("Error in audioRequest:", error)
    throw error
  }
}

export const generateTranscript = async (audio: Buffer): Promise<string> => {
  try {
    console.log("Uploading audio file for transcription")
    const file = await jigsawStack.store.upload(audio, {
      filename: crypto.randomBytes(8).toString("hex") + ".mp3",
      overwrite: true,
    })

    console.log("File uploaded with key:", file.key)
    console.log("Requesting speech-to-text conversion")

    const result = await jigsawStack.audio.speech_to_text({
      file_store_key: file.key,
    })

    console.log("Speech-to-text conversion complete")
    return result.chunks
      .map((x) => x.timestamp[0] + " - " + x.timestamp[1] + "s: " + x.text)
      .join("\n")
  } catch (error) {
    console.error("Error in generateTranscript:", error)
    throw error
  }
}

const numberOr = (x: string | null, fallback: number) => {
  const resp = Number(x)
  if (isNaN(resp)) return fallback
  return resp
}

export const sentiment = async (transcript: string): Promise<SentimentData> => {
  console.log("Generating sentiment analysis")
  if (transcript.length > 2000) {
    transcript = transcript.slice(0, 2000)
  }
  const sentiment = await jigsawStack.sentiment({ text: transcript })
  console.log("Sentiment analysis complete")
  if (!sentiment.success) {
    return { score: 0.5, emotion: "Unknown" }
  }
  return {
    score: sentiment.sentiment.score,
    emotion: sentiment.sentiment.emotion,
  }
}

export const engagementPrompts = async (
  transcript: string
): Promise<EngagementData> => {
  console.log("Generating engagement metrics")
  const [overtalkResp, speechResp, talkToListenResp, turnTakingFrequencyResp] =
    await Promise.all([
      sendPrompt(overtalk + transcript),
      sendPrompt(speechPacePause + transcript),
      sendPrompt(talkToListen + transcript),
      sendPrompt(turnTakingFrequency + transcript),
    ])
  console.log("Engagement metrics generated")
  return {
    interruptions: numberOr(overtalkResp, 0),
    speechPace: numberOr(speechResp, 1),
    talkToListen: numberOr(talkToListenResp, 1),
    turnTakingFrequency: numberOr(turnTakingFrequencyResp, 1),
  }
}

export const jsonClean = (str: string | null) =>
  str?.replace("```json", "")?.replace("```", "")

export const topicPrompt = async (transcript: string): Promise<string[]> => {
  try {
    console.log("Extracting topics")
    return z
      .object({
        topics: z.string().array(),
      })
      .parse(
        JSON.parse(
          jsonClean(await sendPrompt(topicExtraction + transcript)) ??
            '{"topics": []}'
        )
      ).topics
  } catch (e) {
    console.error("Error extracting topics:", e)
    return []
  }
}

export const extractActionsPrompt = async (
  transcript: string
): Promise<string[]> => {
  try {
    console.log("Extracting actionable items")
    return z
      .object({
        actions: z.string().array(),
      })
      .parse(
        JSON.parse(
          jsonClean(await sendPrompt(extractActions + transcript)) ??
            '{"actions":[]}'
        )
      ).actions
  } catch (e) {
    console.error("Error extracting actions:", e)
    return []
  }
}

export const sendPrompt = async (prompt: string): Promise<string | null> => {
  try {
    console.log("Sending prompt to OpenAI")
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )
    return response.data.choices[0].message.content
  } catch (error) {
    console.error("Error with OpenAI API:", error.message)
    return null
  }
}

export const aiSearchRequest = async (query: string): Promise<AISearchData> => {
  console.log("Performing AI search for:", query)
  try {
    type SearchResponse = ReturnType<
      ReturnType<typeof JigsawStack>["web"]["search"]
    >
    const searchResponse = await Promise.race([
      jigsawStack.web.search({
        query,
        ai_overview: true,
        safe_search: "moderate",
        spell_check: true,
      }),
      new Promise<SearchResponse>((_, reject) =>
        setTimeout(() => reject(new Error("Search timeout")), 15000)
      ),
    ])

    console.log("Search response received")

    if (!searchResponse || !searchResponse.success) {
      console.error("Search failed or returned invalid response")
      return {
        query,
        overview: "Search failed to return results.",
        results: [],
        relevanceScore: 0.5,
        isSafe: true,
      }
    }

    let snippets = ""
    try {
      snippets = (searchResponse.results || [])
        .map((result) => result.snippets || [])
        .flat()
        .slice(0, 5) // Get top 5 snippets
        .join("\n\n")

      console.log("Extracted snippets")
    } catch (e) {
      console.error("Error extracting snippets:", e)
      snippets = "No snippets available"
    }

    let relevanceScore = 0.5 // Default value
    try {
      const modifiedPrompt = calculateAISearchRelevantScorePrompt.replace(
        "webSnippets: [",
        `webSnippets: [\n"${snippets}",`
      )

      const relevanceResponse = await sendPrompt(modifiedPrompt)
      console.log("Relevance response received")

      // Extract Relevance Score
      if (relevanceResponse) {
        const cleanJson = jsonClean(relevanceResponse)
        if (cleanJson) {
          try {
            const parsed = JSON.parse(cleanJson)
            if (typeof parsed.relevanceScore === "number") {
              relevanceScore = parsed.relevanceScore
            }
          } catch (parseError) {
            console.error("JSON parse error:", parseError)
            // Try to extract a number if JSON parsing fails
            const numberMatch = relevanceResponse.match(/([0-9]*\.?[0-9]+)/)
            if (numberMatch && numberMatch[0]) {
              const extractedNumber = parseFloat(numberMatch[0])
              if (
                !isNaN(extractedNumber) &&
                extractedNumber >= 0 &&
                extractedNumber <= 1
              ) {
                relevanceScore = extractedNumber
              }
            }
          }
        }
      }

      console.log("Final relevance score:", relevanceScore)
    } catch (e) {
      console.error("Error calculating relevance score:", e)
      // Continue with default score
    }

    return {
      query,
      overview: searchResponse.ai_overview || "Information about " + query,
      results: searchResponse.results || [],
      relevanceScore,
      isSafe: searchResponse.is_safe || true,
    }
  } catch (error) {
    console.error("Error with AI Search:", error)
    // Return fallback data instead of throwing
    return {
      query,
      overview: "Information about " + query,
      results: [],
      relevanceScore: 0.5,
      isSafe: true,
    }
  }
}
