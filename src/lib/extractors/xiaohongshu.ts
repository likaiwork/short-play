import type { Extractor, ExtractResult } from "./types"
import { isPublicUrl } from "@/lib/url-validator"

const BACKEND_URL = process.env.XIAOHONGSHU_API_URL || "http://43.165.65.71:5556/public/parseVideo"

export const xiaohongshuExtractor: Extractor = {
  platform: "xiaohongshu",

  async extract(url: string): Promise<ExtractResult> {
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
        body: JSON.stringify({ url }),
      })

      if (!resp.ok) {
        return {
          title: null, thumbnail: null, downloadUrl: null,
          error: `Xiaohongshu backend returned HTTP ${resp.status}`,
        }
      }

      const data = await resp.json()

      const downloadUrl: string | null = data?.data?.resources?.[0]?.urls?.[0] || null
      const title: string | null = data?.data?.title || null

      if (!downloadUrl) {
        return { title, thumbnail: null, downloadUrl: null, error: "No download URL in response" }
      }

      if (!isPublicUrl(downloadUrl)) {
        return { title, thumbnail: null, downloadUrl: null, error: "Xiaohongshu backend returned an invalid media URL" }
      }

      return { title, thumbnail: null, downloadUrl }
    } catch (err: unknown) {
      const message = err instanceof Error
        ? (err.name === "AbortError" ? "Xiaohongshu backend timed out" : err.message)
        : "Unknown error"
      return { title: null, thumbnail: null, downloadUrl: null, error: `Extraction failed: ${message}` }
    } finally {
      clearTimeout(timeout)
    }
  },
}
