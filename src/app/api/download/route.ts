import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-helper"
import { rateLimit } from "@/lib/rate-limit"

async function extractVideoUrl(inputUrl: string, userId: string): Promise<{
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
      body: JSON.stringify({ url: inputUrl, user_id: userId }),
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
    const message = err instanceof Error ? err.message : "Unknown error"
    return { title: null, thumbnail: null, downloadUrl: null, error: `Request failed: ${message}` }
  }
}

export async function POST(request: Request) {
  const authResult = await requireAuth()
  if (!authResult.ok) return authResult.response

  const { url } = await request.json()
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  if (!rateLimit(`download:${authResult.userId}`, 10).ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  const result = await extractVideoUrl(url, authResult.userId)

  await prisma.downloadRecord.create({
    data: {
      userId: authResult.userId,
      url,
      title: result.title,
      downloadUrl: result.downloadUrl,
      status: result.downloadUrl ? "completed" : "failed",
    },
  })

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

export async function GET() {
  const authResult = await requireAuth()
  if (!authResult.ok) return authResult.response

  const records = await prisma.downloadRecord.findMany({
    where: { userId: authResult.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return NextResponse.json({ records })
}
