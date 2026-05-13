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
    const resp = await fetch(videoUrl, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: new URL(videoUrl).origin,
      },
    })

    if (!resp.ok) {
      return NextResponse.json(
        { error: `Remote server returned ${resp.status} ${resp.statusText}` },
        { status: 500 }
      )
    }

    const contentType = resp.headers.get("content-type") || "application/octet-stream"

    return new NextResponse(resp.body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
