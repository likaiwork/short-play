import Link from "next/link"
import {
  Download,
  Zap,
  ArrowRight,
  Tv,
  Music2,
  Film,
  Globe,
  Sparkles,
  TrendingUp,
  Lock,
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

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-4 pt-24 pb-12 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-medium px-3 py-1 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Free to use — No registration required
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-gray-900">
            Download Online Videos
            <br />
            <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Fast & Free
            </span>
          </h1>
          <p className="mt-4 text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
            Paste any video link and get the real MP4 file instantly. No watermarks, no quality loss, no hassle.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/download"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition shadow-lg shadow-emerald-600/20"
            >
              Start Downloading <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Supported platforms */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
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
