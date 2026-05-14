import { NextResponse } from "next/server"
import { isPublicUrl } from "@/lib/url-validator"
import { detectPlatform, findExtractor } from "@/lib/extractors"

export async function POST(request: Request) {
  let url: string
  try {
    const body = await request.json()
    url = body.url?.trim()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  if (!isPublicUrl(url)) {
    return NextResponse.json(
      { error: "Invalid or unsupported URL. Please provide a video link from a supported platform." },
      { status: 400 }
    )
  }

  const platform = detectPlatform(url)
  if (!platform) {
    return NextResponse.json(
      { error: "This platform is not supported yet. Currently supported: Instagram, X (Twitter), Facebook, Dailymotion." },
      { status: 400 }
    )
  }

  const extractor = findExtractor(platform)
  if (!extractor) {
    return NextResponse.json(
      { error: `"${platform}" is recognized but extraction is not yet implemented.` },
      { status: 400 }
    )
  }

  const result = await extractor.extract(url)

  if (result.error) {
    console.warn(`Extraction failed for ${platform} (${url}): ${result.error}`)
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    title: result.title,
    thumbnail: result.thumbnail,
    downloadUrl: result.downloadUrl,
  })
}
