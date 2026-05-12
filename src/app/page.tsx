import Link from "next/link"
import {
  Download,
  Zap,
  Crown,
  ArrowRight,
  Tv,
  Music2,
  Film,
  Globe,
  Sparkles,
  TrendingUp,
  Lock,
  Clock,
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
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    title: "High Speed",
    desc: "Direct CDN links for the fastest download speeds possible.",
  },
  {
    icon: Lock,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    title: "No Ads",
    desc: "Clean experience. No popups, no redirects, no spam.",
  },
  {
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    title: "HD Quality",
    desc: "Download videos in the highest available resolution.",
  },
  {
    icon: Clock,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    title: "Download History",
    desc: "Keep track of all your downloads in your personal dashboard.",
  },
]

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-4 pt-24 pb-12 text-center">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium px-3 py-1 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Free to use — No registration required for basic access
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Download Online Videos
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Fast & Free
            </span>
          </h1>
          <p className="mt-4 text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Paste any video link and get the real MP4 file instantly. No watermarks, no quality loss, no hassle.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/download"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition shadow-lg shadow-emerald-600/20"
            >
              Start Downloading <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="border border-zinc-700 hover:border-zinc-600 text-zinc-300 px-6 py-3 rounded-xl font-medium transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Supported platforms */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <p className="text-center text-xs text-zinc-600 uppercase tracking-wider mb-6">Supported Platforms</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {platforms.map((p) => (
            <div
              key={p.label}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm text-zinc-400"
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
          <h2 className="text-2xl font-bold text-white mb-2">How It Works</h2>
          <p className="text-zinc-500 text-sm">Three simple steps to download any video</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group hover:border-zinc-700 transition">
              <span className="text-5xl font-bold text-zinc-800 group-hover:text-zinc-700 transition">
                {s.step}
              </span>
              <h3 className="text-lg font-semibold text-white mt-3 mb-1">{s.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">Why Choose VidDown</h2>
          <p className="text-zinc-500 text-sm">Built for speed, privacy, and reliability</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition"
            >
              <div className={`w-10 h-10 rounded-xl ${f.bg} ${f.border} border flex items-center justify-center mb-4`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{f.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VIP */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="relative bg-gradient-to-b from-amber-950/30 to-amber-950/10 border border-amber-800/40 rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-500/3 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium px-3 py-1 rounded-full mb-4">
                <Crown className="w-3.5 h-3.5" />
                Premium
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Ready for Unlimited Access?</h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                Unlimited downloads, priority processing, batch download, and HD quality support. Cancel anytime.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <span className="text-3xl font-bold text-white">$4.99<span className="text-base text-zinc-400 font-normal">/mo</span></span>
              <Link
                href="/vip"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-xl font-medium transition"
              >
                <Crown className="w-4 h-4" /> Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
