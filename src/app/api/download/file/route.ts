import { NextResponse } from "next/server"
import { isPublicUrl } from "@/lib/url-validator"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const videoUrl = searchParams.get("url")
  const filename = searchParams.get("filename") || "video.mp4"

  if (!videoUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  if (!isPublicUrl(videoUrl)) {
    return NextResponse.json(
      { error: "Invalid or disallowed URL" },
      { status: 400 }
    )
  }

  try {
    const referer = searchParams.get("referer") || new URL(videoUrl).origin

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const resp = await fetch(videoUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: referer,
      },
    })

    clearTimeout(timeout)

    if (!resp.ok) {
      return NextResponse.json(
        { error: `Remote server returned ${resp.status} ${resp.statusText}` },
        { status: 502 }
      )
    }

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
    const message = err instanceof Error ? (err.name === "AbortError" ? "Upstream timeout" : err.message) : "Unknown error"
    console.error("Proxy fetch error:", message, videoUrl)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
