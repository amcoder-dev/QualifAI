import crypto from "crypto"
import axios from "axios"
import { z } from "zod"
import { JigsawStack } from "jigsawstack"
import type { EngagementData, LeadAudio, SentimentData } from "../src/types"
import {
  extractActions,
  overtalk,
  speechPacePause,
  talkToListen,
  topicExtraction,
  turnTakingFrequency,
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

export const audioRequest = async (audio: Buffer): Promise<LeadAudio> => {
  console.log("Generating transcript")
  const transcript = await generateTranscript(audio)
  console.log("Transcript OK")
  const [sentimentResp, engagementResp, topicResp, actionResp] =
    await Promise.all([
      sentiment(transcript),
      engagementPrompts(transcript),
      topicPrompt(transcript),
      extractActionsPrompt(transcript),
    ])
  return {
    date: new Date().toDateString(),
    sentiment: sentimentResp,
    engagement: engagementResp,
    topics: topicResp,
    actionableItems: actionResp,
  }
}

export const generateTranscript = async (audio: Buffer): Promise<string> => {
  const file = await jigsawStack.store.upload(audio, {
    filename: crypto.randomBytes(8).toString("hex") + ".mp3",
    overwrite: true,
  })
  const result = await jigsawStack.audio.speech_to_text({
    file_store_key: file.key,
    // by_speaker: true, // by_speaker was broken.
  })
  /*
  return result
    .speakers!.map(
      (x) =>
        x.speaker +
        "(" +
        x.timestamp[0] +
        " - " +
        x.timestamp[1] +
        "s): " +
        x.text
    )
    .join("\n")
  */
  return result.chunks
    .map((x) => x.timestamp[0] + " - " + x.timestamp[1] + "s: " + x.text)
    .join("\n")
}

const numberOr = (x: string | null, fallback: number) => {
  const resp = Number(x)
  if (isNaN(resp)) return fallback
  return resp
}

export const sentiment = async (transcript: string): Promise<SentimentData> => {
  console.log("Generating sentiment")
  if (transcript.length > 2000) {
    transcript = transcript.slice(0, 2000)
  }
  const sentiment = await jigsawStack.sentiment({ text: transcript })
  console.log("Sentiment done")
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
  console.log("Generating engagement")
  const [overtalkResp, speechResp, talkToListenResp, turnTakingFrequencyResp] =
    await Promise.all([
      sendPrompt(overtalk + transcript),
      sendPrompt(speechPacePause + transcript),
      sendPrompt(talkToListen + transcript),
      sendPrompt(turnTakingFrequency + transcript),
    ])
  console.log("Engagement done")
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
    console.error(e)
    return []
  }
}

export const extractActionsPrompt = async (
  transcript: string
): Promise<string[]> => {
  try {
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
    console.error(e)
    return []
  }
}

export const sendPrompt = async (prompt: string): Promise<string | null> => {
  try {
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
