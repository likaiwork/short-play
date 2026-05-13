import { NextResponse } from "next/server"

async function extractVideoUrl(inputUrl: string): Promise<{
  title: string | null
  thumbnail: string | null
  downloadUrl: string | null
  error?: string
}> {
  try {
    const apiUrl = "https://tools.lrtxs.com/Tools/VideoDownload/videoinfo"

    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: inputUrl, user_id: "123" }),
    })

    const data = await resp.json()

    if (data.code !== 200) {
      return { title: null, thumbnail: null, downloadUrl: null, error: data.msg || `API error code ${data.code}` }
    }

    const title = data?.data?.title || null
    const thumbnail = data?.data?.thumbnail || null
    const downloadUrl = data?.data?.url || null

    if (!downloadUrl) {
      return { title, thumbnail, downloadUrl: null, error: "No download URL in API response" }
    }

    return { title, thumbnail, downloadUrl }
  } catch (err: unknown) {
    console.error("Extract video error:", err)
    const message = err instanceof Error ? err.message : "Unknown error"
    return { title: null, thumbnail: null, downloadUrl: null, error: `Request failed: ${message}` }
  }
}

export async function POST(request: Request) {
  const { url } = await request.json()
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  const result = await extractVideoUrl(url)

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    title: result.title,
    thumbnail: result.thumbnail,
    downloadUrl: result.downloadUrl,
  })
}
