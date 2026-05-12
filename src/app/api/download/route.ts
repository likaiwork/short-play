import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
  } catch (err: any) {
    return { title: null, thumbnail: null, downloadUrl: null, error: `Request failed: ${err.message}` }
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Please login first" }, { status: 401 })
  }

  const { url } = await request.json()
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  const result = await extractVideoUrl(url, session.user.id)

  await prisma.downloadRecord.create({
    data: {
      userId: session.user.id,
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
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Please login first" }, { status: 401 })
  }

  const records = await prisma.downloadRecord.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return NextResponse.json({ records })
}
