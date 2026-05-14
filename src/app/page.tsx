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
  Zap,
  Music2,
  Tv,
  TrendingUp,
  Lock,
  Sparkles,
  Play,
} from "lucide-react"

const platforms = [
  { icon: Tv, label: "YouTube" },
  { icon: Music2, label: "TikTok" },
  { icon: Film, label: "Bilibili" },
  { icon: Globe, label: "Instagram" },
  { icon: Globe, label: "X (Twitter)" },
  { icon: Film, label: "Facebook" },
]

const steps = [
  {
    step: "01",
    title: "Paste Video Link",
    desc: "Copy the URL from any supported platform and paste it here.",
  },
  {
    step: "02",
    title: "Extract Video",
    desc: "Our engine fetches the real video source in seconds.",
  },
  {
    step: "03",
    title: "Download MP4",
    desc: "Click download and save the MP4 file directly to your device.",
  },
]

const features = [
  {
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    title: "High Speed",
    desc: "Direct CDN links for the fastest download speeds possible.",
  },
  {
    icon: Lock,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    title: "No Ads",
    desc: "Clean experience. No popups, no redirects, no spam.",
  },
  {
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    title: "HD Quality",
    desc: "Download videos in the highest available resolution.",
  },
]

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
    return null
  } catch {
    return null
  }
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [thumbFailed, setThumbFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [playUrl, setPlayUrl] = useState<string | null>(null)
  const [refreshingPlay, setRefreshingPlay] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
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
      // Re-fetch to get a fresh CDN URL before downloading
      let downloadUrl = result.downloadUrl
      try {
        const fresh = await fetch("/api/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        })
        const freshData = await fresh.json()
        if (freshData.success && freshData.downloadUrl) {
          downloadUrl = freshData.downloadUrl
        }
      } catch {
        // use existing URL as fallback
      }

      const filename = `${result.title || "video"}.mp4`
      const proxyUrl = `/api/download/file?url=${encodeURIComponent(downloadUrl)}&filename=${encodeURIComponent(filename)}`
      const res = await fetch(proxyUrl, { signal: controller.signal })
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
        alert("Download failed. Please try again or refresh the page.")
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
    <div className="overflow-hidden">
      {/* Hero + Download */}
      <section className="relative max-w-3xl mx-auto px-4 pt-20 pb-8 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-medium px-3 py-1 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Free to use — No registration required
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-gray-900">
            Download Online Videos
            <br />
            <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Fast & Free
            </span>
          </h1>
          <p className="mt-3 text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
            Paste any video link and get the real MP4 file instantly. No watermarks, no quality loss, no hassle.
          </p>
        </div>

        {/* Download form */}
        <form onSubmit={handleSubmit} className="mt-8 mb-6">
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

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-10 gap-4">
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

        {/* Error */}
        {result?.error && !loading && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-3">
              {result.error.includes("Network") || result.error.includes("fetch") ? (
                <WifiOff className="w-6 h-6 text-red-500" />
              ) : (
                <SearchX className="w-6 h-6 text-red-500" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {result.error.includes("Network") || result.error.includes("fetch")
                ? "Connection Failed"
                : result.error.includes("Invalid")
                  ? "Unsupported URL"
                  : "Extraction Failed"}
            </h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto mb-4 leading-relaxed">
              {result.error}
            </p>
            <div className="inline-flex flex-col items-start gap-1 text-left bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-500">
              <p className="text-gray-700 font-medium mb-1">Try these:</p>
              <p>&bull; Make sure the video URL is complete and valid</p>
              <p>&bull; The video may be private or unavailable</p>
              <p>&bull; This platform may not be supported yet</p>
              <p>&bull; Try a different video link</p>
            </div>
          </div>
        )}

        {/* Success */}
        {result?.success && result.downloadUrl && !loading && (
          <div className="relative bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden text-left mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="aspect-video bg-black flex items-center justify-center relative">
              {playing ? (
                <video
                  ref={videoRef}
                  src={`/api/download/file?url=${encodeURIComponent(playUrl || result.downloadUrl!)}&inline=1`}
                  className="w-full h-full"
                  controls
                  autoPlay
                  onError={() => setPlaying(false)}
                />
              ) : (
                <>
                  {result.thumbnail && !thumbFailed ? (
                    <img
                      src={result.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={() => setThumbFailed(true)}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Film className="w-16 h-16 text-gray-400" />
                      <span className="text-sm text-gray-400">No preview available</span>
                    </div>
                  )}
                  <button
                    onClick={async () => {
                      setRefreshingPlay(true)
                      try {
                        const res = await fetch("/api/download", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ url: url.trim() }),
                        })
                        const data = await res.json()
                        if (data.success && data.downloadUrl) {
                          setPlayUrl(data.downloadUrl)
                          setPlaying(true)
                        }
                      } catch {
                        // fallback: try current URL anyway
                        setPlayUrl(result.downloadUrl!)
                        setPlaying(true)
                      } finally {
                        setRefreshingPlay(false)
                      }
                    }}
                    disabled={refreshingPlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition group"
                  >
                    {refreshingPlay ? (
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Loader2 className="w-6 h-6 text-gray-600 animate-spin" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-lg transition">
                        <Play className="w-6 h-6 text-gray-900 ml-0.5" />
                      </div>
                    )}
                  </button>
                </>
              )}

              {sourceDomain && (
                <span className="absolute top-3 left-3 bg-black/70 backdrop-blur text-gray-200 text-xs px-2.5 py-1 rounded-full border border-white/10 z-10">
                  <Globe className="w-3 h-3 inline mr-1 opacity-50" />
                  {sourceDomain}
                </span>
              )}
            </div>

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
        )}

        {/* Idle state */}
        {!loading && !result && (
          <div className="flex items-center justify-center gap-4 py-6 text-gray-400">
            <MonitorPlay className="w-8 h-8" />
            <span className="text-base">Paste a link above and click Extract</span>
          </div>
        )}
      </section>

      {/* Supported platforms */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <p className="text-center text-sm text-gray-500 uppercase tracking-wider mb-6">Supported Platforms</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {platforms.map((p) => (
            <div
              key={p.label}
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600"
            >
              <p.icon className="w-4 h-4" />
              {p.label}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How It Works</h2>
          <p className="text-gray-500 text-base">Three simple steps to download any video</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="relative bg-gray-50 border border-gray-200 rounded-2xl p-6 group hover:border-gray-300 transition">
              <span className="text-5xl font-bold text-gray-200 group-hover:text-gray-300 transition">
                {s.step}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mt-3 mb-1">{s.title}</h3>
              <p className="text-gray-500 text-base leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Choose VidDown</h2>
          <p className="text-gray-500 text-base">Built for speed, privacy, and reliability</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-gray-50/70 border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition"
            >
              <div className={`w-10 h-10 rounded-xl ${f.bg} ${f.border} border flex items-center justify-center mb-4`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 text-base mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
