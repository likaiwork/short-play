import type { Extractor, ExtractResult } from "./types"
import { isPublicUrl } from "@/lib/url-validator"

const BACKEND_URL = process.env.INSTAGRAM_BACKEND_URL || "http://43.165.65.71:3000/igdl"

export const instagramExtractor: Extractor = {
  platform: "instagram",

  async extract(url: string): Promise<ExtractResult> {
    const apiUrl = `${BACKEND_URL}?url=${encodeURIComponent(url)}`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

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
          error: `Instagram backend returned HTTP ${resp.status}`,
        }
      }

      const data = await resp.json()

      const items: Array<{ thumbnail?: string; url?: string }> = data?.url?.data ?? []
      if (!Array.isArray(items) || items.length === 0) {
        return {
          title: null, thumbnail: null, downloadUrl: null,
          error: "No media found in Instagram response",
        }
      }

      const first = items[0]
      const downloadUrl = first?.url || null
      const thumbnail = first?.thumbnail || null

      if (!downloadUrl) {
        return { title: null, thumbnail, downloadUrl: null, error: "Instagram response had no download URL" }
      }

      if (!isPublicUrl(downloadUrl)) {
        return { title: null, thumbnail, downloadUrl: null, error: "Instagram backend returned an invalid media URL" }
      }

      return { title: null, thumbnail, downloadUrl }
    } catch (err: unknown) {
      const message = err instanceof Error
        ? (err.name === "AbortError" ? "Instagram backend timed out" : err.message)
        : "Unknown error"
      return { title: null, thumbnail: null, downloadUrl: null, error: `Extraction failed: ${message}` }
    } finally {
      clearTimeout(timeout)
    }
  },
}
