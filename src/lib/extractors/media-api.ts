import type { Extractor, ExtractResult } from "./types"
import { isPublicUrl } from "@/lib/url-validator"

const BACKEND_URL = process.env.MEDIA_API_URL || "http://43.165.65.71/"

async function extractViaMediaApi(url: string): Promise<ExtractResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const resp = await fetch(BACKEND_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "VidDown/1.0",
      },
      body: JSON.stringify({ url, localProcessing: true }),
    })

    if (!resp.ok) {
      return {
        title: null, thumbnail: null, downloadUrl: null,
        error: `Backend returned HTTP ${resp.status}`,
      }
    }

    const data = await resp.json()

    const downloadUrl: string | null = data?.url || null
    const title: string | null = data?.title || null
    const thumbnail: string | null = data?.thumbnail || null

    if (!downloadUrl) {
      return { title, thumbnail, downloadUrl: null, error: "No download URL in response" }
    }

    if (!isPublicUrl(downloadUrl)) {
      return { title, thumbnail, downloadUrl: null, error: "Backend returned an invalid media URL" }
    }

    return { title, thumbnail, downloadUrl }
  } catch (err: unknown) {
    const message = err instanceof Error
      ? (err.name === "AbortError" ? "Backend timed out" : err.message)
      : "Unknown error"
    return { title: null, thumbnail: null, downloadUrl: null, error: `Extraction failed: ${message}` }
  } finally {
    clearTimeout(timeout)
  }
}

export const twitterExtractor: Extractor = {
  platform: "twitter",
  extract: extractViaMediaApi,
}

export const facebookExtractor: Extractor = {
  platform: "facebook",
  extract: extractViaMediaApi,
}
