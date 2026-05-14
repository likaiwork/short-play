import { NextResponse } from "next/server"
import { isPublicUrl } from "@/lib/url-validator"

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"

function isHls(contentType: string | null, url: string): boolean {
  if (contentType) {
    const ct = contentType.toLowerCase()
    if (ct.includes("vnd.apple.mpegurl") || ct.includes("x-mpegurl")) return true
  }
  return url.toLowerCase().endsWith(".m3u8") || url.includes(".m3u8?") || url.includes(".m3u8&")
}

function rewriteHlsManifest(body: string, manifestUrl: string, referer: string, proxyOrigin: string): string {
  return body
    .split("\n")
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) return line

      let absolute: string
      try {
        absolute = new URL(trimmed, manifestUrl).href
      } catch {
        return line
      }

      const params = new URLSearchParams({ url: absolute, inline: "1" })
      if (referer) params.set("referer", referer)
      return `${proxyOrigin}/api/download/file?${params.toString()}`
    })
    .join("\n")
}

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
      lastError = new Error(`Remote server returned ${resp.status} ${resp.statusText}`)
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (err instanceof Error && err.name === "AbortError") break
    }
  }

  throw lastError || new Error("All referer attempts failed")
}

async function handleRequest(request: Request, headOnly: boolean) {
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

    const referers = customReferer
      ? [customReferer, cdnOrigin]
      : [cdnOrigin]

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const resp = await fetchWithReferers(videoUrl, referers, controller.signal)

    clearTimeout(timeout)

    const contentType = resp.headers.get("content-type") || "application/octet-stream"
    const contentLength = resp.headers.get("content-length")
    const inline = searchParams.get("inline")

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    }

    // Rewrite HLS manifests so segment requests also go through the proxy
    if (!headOnly && isHls(contentType, videoUrl)) {
      const text = await resp.text()
      const proxyOrigin = new URL(request.url).origin
      const referer = customReferer || cdnOrigin
      const rewritten = rewriteHlsManifest(text, videoUrl, referer, proxyOrigin)
      headers["Content-Length"] = String(new TextEncoder().encode(rewritten).length)
      return new NextResponse(rewritten, { headers })
    }

    if (contentLength) {
      headers["Content-Length"] = contentLength
    }
    if (!inline) {
      headers["Content-Disposition"] = `attachment; filename="${encodeURIComponent(filename)}"`
    }

    return new NextResponse(headOnly ? null : resp.body, { headers })
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

export async function GET(request: Request) {
  return handleRequest(request, false)
}

export async function HEAD(request: Request) {
  return handleRequest(request, true)
}
