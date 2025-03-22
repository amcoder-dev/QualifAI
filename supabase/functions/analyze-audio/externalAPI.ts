import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"
import { JigsawStack } from "https://esm.sh/jigsawstack@0.0.28"
import { z } from "https://esm.sh/zod@3.24.2"
import axios from "https://esm.sh/axios@1.8.4"
import type {
  EngagementData,
  SentimentData,
  AISearchData,
  AudioAnalysisResult,
} from "../../../src/types"

import {
  extractActions,
  overtalk,
  speechPacePause,
  talkToListen,
  topicExtraction,
  turnTakingFrequency,
  calculateAISearchRelevantScorePrompt,
} from "./prompt.ts"

let jigsawStack: ReturnType<typeof JigsawStack>
let OPENAI_API_KEY: string | undefined
export const initExternalAPI = () => {
  OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? ""
  jigsawStack = JigsawStack({
    apiKey: Deno.env.get("JIGSAW_API_KEY") ?? "",
  })
}

const generateRandomHex = (length: number): string => {
  const randomBytes = new Uint8Array(length / 2)
  crypto.getRandomValues(randomBytes)

  // Convert the random bytes to a hex string
  return Array.from(randomBytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("")
}

export const audioRequest = async (
  supabase: SupabaseClient,
  audio: Blob
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

    let audioID = generateRandomHex(32)
    // Insert into Supabase and get the auto-generated lead ID
    try {
      console.log("Storing data in Supabase")

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

const generateTranscript = async (audio: Blob): Promise<string> => {
  try {
    console.log("Uploading audio file for transcription")
    const filename = generateRandomHex(32) + ".mp3"
    const file = await jigsawStack.store.upload(audio, {
      filename: filename,
      overwrite: true,
    })

    console.log("File uploaded with key:", file.key)
    console.log("Requesting speech-to-text conversion")

    const result = await jigsawStack.audio.speech_to_text({
      file_store_key: file.key || filename,
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

const sentiment = async (transcript: string): Promise<SentimentData> => {
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

const engagementPrompts = async (
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

const jsonClean = (str: string | null) =>
  str?.replace("```json", "")?.replace("```", "")

const topicPrompt = async (transcript: string): Promise<string[]> => {
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

const extractActionsPrompt = async (transcript: string): Promise<string[]> => {
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

const sendPrompt = async (prompt: string): Promise<string | null> => {
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
        overview: "Search failed to return results.",
        relevanceScore: 0.5,
        websiteURL: "",
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
      overview: searchResponse.ai_overview || "Information about " + query,
      relevanceScore,
      websiteURL: searchResponse.results[0].url,
    }
  } catch (error) {
    console.error("Error with AI Search:", error)
    // Return fallback data instead of throwing
    return {
      overview: "Information unavailable.",
      relevanceScore: 0.5,
      websiteURL: "",
    }
  }
}
