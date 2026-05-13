"use client"

import { useState, useRef, useEffect } from "react"
import {
  Download,
  Loader2,
  LinkIcon,
  Film,
  MonitorPlay,
  CheckCircle2,
  SearchX,
  WifiOff,
  Globe,
  Clock,
} from "lucide-react"

interface Result {
  success?: boolean
  title?: string
  thumbnail?: string
  downloadUrl?: string
  error?: string
}

function guessPlatform(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace("www.", "")
    if (host.includes("youtube") || host.includes("youtu.be")) return "YouTube"
    if (host.includes("tiktok")) return "TikTok"
    if (host.includes("bilibili")) return "Bilibili"
    if (host.includes("instagram")) return "Instagram"
    if (host.includes("facebook")) return "Facebook"
    if (host.includes("x.com") || host.includes("twitter")) return "X (Twitter)"
    if (host.includes("zoomshorttv")) return "ZoomShortTV"
    return null
  } catch {
    return null
  }
}

export default function DownloadPage() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [thumbFailed, setThumbFailed] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort()
        abortRef.current = null
      }
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setResult(null)
    setThumbFailed(false)

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ error: "Network error. Please check your connection and try again." })
    } finally {
      setLoading(false)
    }
  }

  async function handleDownload() {
    if (!result?.downloadUrl) return
    setDownloading(true)
    setDownloadProgress(0)

    const controller = new AbortController()
    abortRef.current = controller
    let blobUrl: string | null = null

    try {
      const res = await fetch(result.downloadUrl, { signal: controller.signal })
      if (!res.ok || !res.body) throw new Error("Download failed")

      const contentLength = Number(res.headers.get("content-length") || 0)
      const reader = res.body.getReader()
      const chunks: Uint8Array[] = []
      let received = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (value) {
          chunks.push(value)
          received += value.length
          if (contentLength > 0) {
            setDownloadProgress(Math.round((received / contentLength) * 100))
          }
        }
      }

      const blob = new Blob(chunks as BlobPart[], { type: "video/mp4" })
      blobUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = blobUrl
      a.download = `${result.title || "video"}.mp4`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch {
      if (!controller.signal.aborted) {
        window.open(result.downloadUrl, "_blank")
      }
    } finally {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
      abortRef.current = null
      setDownloading(false)
      setDownloadProgress(0)
    }
  }

  const sourceDomain = (() => {
    if (!result?.success || !url) return null
    try { return new URL(url).hostname.replace("www.", "") } catch { return null }
  })()

  const platform = url ? guessPlatform(url) : null

  return (
    <div className="max-w-3xl mx-auto px-4 pt-12 pb-20">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Downloader</h1>
        <p className="text-gray-500 text-base">
          Paste a link from any supported platform and get the MP4 file instantly
        </p>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3 p-2 bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/10 transition">
          <div className="flex-1 relative flex items-center">
            <LinkIcon className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste video link here..."
              className="w-full bg-transparent pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none text-base"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2.5 my-auto rounded-xl font-medium text-base flex items-center gap-2 transition shrink-0"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /></>
            ) : (
              <><Download className="w-4 h-4" /> Extract</>
            )}
          </button>
        </div>
      </form>

      {/* === LOADING === */}
      {loading && (
        <div className="flex flex-col items-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-gray-900 font-medium">Extracting video info...</p>
            {platform && (
              <p className="text-gray-500 text-sm mt-1">Fetching from {platform}</p>
            )}
          </div>
        </div>
      )}

      {/* === ERROR === */}
      {result?.error && !loading && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
            {result.error.includes("Network") || result.error.includes("fetch") ? (
              <WifiOff className="w-7 h-7 text-red-500" />
            ) : (
              <SearchX className="w-7 h-7 text-red-500" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {result.error.includes("Network") || result.error.includes("fetch")
              ? "Connection Failed"
              : result.error.includes("Invalid")
                ? "Unsupported URL"
                : "Extraction Failed"}
          </h3>
          <p className="text-gray-600 text-base max-w-md mx-auto mb-6 leading-relaxed">
            {result.error}
          </p>
          <div className="inline-flex flex-col items-start gap-2 text-left bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-500">
            <p className="text-gray-700 font-medium mb-1">Try these:</p>
            <p>&bull; Make sure the video URL is complete and valid</p>
            <p>&bull; The video may be private or unavailable</p>
            <p>&bull; This platform may not be supported yet</p>
            <p>&bull; Try a different video link</p>
          </div>
        </div>
      )}

      {/* === SUCCESS with download === */}
      {result?.success && result.downloadUrl && !loading && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="relative bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
              {result.thumbnail && !thumbFailed ? (
                <img
                  src={result.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={() => setThumbFailed(true)}
                />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Film className="w-16 h-16 text-gray-300" />
                  <span className="text-sm text-gray-400">No preview available</span>
                </div>
              )}

              {sourceDomain && (
                <span className="absolute top-3 left-3 bg-black/70 backdrop-blur text-gray-200 text-xs px-2.5 py-1 rounded-full border border-white/10">
                  <Globe className="w-3 h-3 inline mr-1 opacity-50" />
                  {sourceDomain}
                </span>
              )}
            </div>

            {/* Info + Download */}
            <div className="p-5">
              <div className="mb-4">
                {result.title ? (
                  <h2 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2">
                    {result.title}
                  </h2>
                ) : (
                  <h2 className="text-lg font-semibold text-gray-400 italic">
                    Untitled Video
                  </h2>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-emerald-600 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ready to download
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1 text-gray-500 text-sm">
                    <Clock className="w-3 h-3" />
                    Link expires soon
                  </span>
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 text-white py-3 rounded-xl font-medium text-base flex items-center justify-center gap-2 transition"
              >
                {downloading && (
                  <span
                    className="absolute inset-0 bg-emerald-500 transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {downloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Downloading... {downloadProgress > 0 && `${downloadProgress}%`}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download MP4
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === EMPTY (idle) === */}
      {!loading && !result && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mx-auto mb-5">
            <MonitorPlay className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-medium mb-1">Ready to download</h3>
          <p className="text-gray-500 text-base max-w-sm mx-auto">
            Paste a video URL in the input above and click Extract
          </p>
        </div>
      )}
    </div>
  )
}
