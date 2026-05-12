import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const { searchParams } = new URL(request.url)
  const videoUrl = searchParams.get("url")
  const filename = searchParams.get("filename") || "video.mp4"

  if (!videoUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
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
  } catch (err: any) {
    // Surface the real cause
    const detail = err.cause?.message || err.message || "Unknown error"
    return NextResponse.json({ error: detail }, { status: 500 })
  }
}
