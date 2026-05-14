import type { Extractor, ExtractResult } from "./types"
import { isPublicUrl } from "@/lib/url-validator"

const BACKEND_URL = process.env.DOUYIN_API_URL || "http://43.165.65.71:9008/api/hybrid/video_data"

export const douyinExtractor: Extractor = {
  platform: "douyin",

  async extract(url: string): Promise<ExtractResult> {
    const apiUrl = `${BACKEND_URL}?url=${encodeURIComponent(url)}`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    try {
      const resp = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "VidDown/1.0",
        },
      })

      if (!resp.ok) {
        return {
          title: null, thumbnail: null, downloadUrl: null,
          error: `Douyin backend returned HTTP ${resp.status}`,
        }
      }

      const data = await resp.json()

      if (!data || data.code !== 200) {
        return {
          title: null, thumbnail: null, downloadUrl: null,
          error: "Acquisition failed",
        }
      }

      const downloadUrl: string | null = data?.data?.video?.bit_rate?.[0]?.play_addr?.url_list?.[0] || null
      const title: string | null = data?.data?.desc || null
      const thumbnail: string | null = data?.data?.author?.avatar_thumb?.url_list?.[0] || null

      if (!downloadUrl) {
        return { title, thumbnail, downloadUrl: null, error: "No download URL in Douyin response" }
      }

      if (!isPublicUrl(downloadUrl)) {
        return { title, thumbnail, downloadUrl: null, error: "Douyin backend returned an invalid media URL" }
      }

      return { title, thumbnail, downloadUrl }
    } catch (err: unknown) {
      const message = err instanceof Error
        ? (err.name === "AbortError" ? "Douyin backend timed out" : err.message)
        : "Unknown error"
      return { title: null, thumbnail: null, downloadUrl: null, error: `Extraction failed: ${message}` }
    } finally {
      clearTimeout(timeout)
    }
  },
}
