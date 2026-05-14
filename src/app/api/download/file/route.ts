import { NextResponse } from "next/server"
import { isPublicUrl } from "@/lib/url-validator"

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"

async function fetchWithReferers(videoUrl: string, referers: string[], signal: AbortSignal) {
  let lastError: Error | null = null

  for (const referer of referers) {
    try {
      const resp = await fetch(videoUrl, {
        signal,
        redirect: "follow",
        headers: {
          "User-Agent": UA,
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: referer,
        },
      })
      if (resp.ok) return resp
      // upstream rejected, try next referer
      lastError = new Error(`Remote server returned ${resp.status} ${resp.statusText}`)
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      // if aborted, stop retrying
      if (err instanceof Error && err.name === "AbortError") break
    }
  }

  throw lastError || new Error("All referer attempts failed")
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const videoUrl = searchParams.get("url")
  const filename = searchParams.get("filename") || "video.mp4"

  if (!videoUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  if (!isPublicUrl(videoUrl)) {
    return NextResponse.json({ error: "Invalid or disallowed URL" }, { status: 400 })
  }

  try {
    const customReferer = searchParams.get("referer")
    const cdnOrigin = new URL(videoUrl).origin

    // Try custom referer first, fall back to CDN origin
    const referers = customReferer
      ? [customReferer, cdnOrigin]
      : [cdnOrigin]

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const resp = await fetchWithReferers(videoUrl, referers, controller.signal)

    clearTimeout(timeout)

    const contentType = resp.headers.get("content-type") || "application/octet-stream"
    const inline = searchParams.get("inline")

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    }
    if (!inline) {
      headers["Content-Disposition"] = `attachment; filename="${encodeURIComponent(filename)}"`
    }

    return new NextResponse(resp.body, { headers })
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.name === "AbortError"
          ? "Upstream timeout"
          : err.message
        : "Unknown error"
    console.error("Proxy fetch error:", message, videoUrl)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
