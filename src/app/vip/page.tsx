"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Crown, Check, Zap, Infinity, Download } from "lucide-react"

export default function VipPage() {
  const { data: session } = useSession()

  return (
    <div className="max-w-5xl mx-auto px-4 pt-16">
      <div className="text-center mb-12">
        <Crown className="w-12 h-12 text-amber-400 mx-auto mb-3" />
        <h1 className="text-3xl font-bold text-white mb-2">VIP Membership</h1>
        <p className="text-zinc-400">Unlock the full power of VidDown</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Free Plan */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Free</h3>
          <p className="text-3xl font-bold text-white mb-4">
            $0<span className="text-base text-zinc-400 font-normal">/month</span>
          </p>
          <ul className="space-y-3 mb-6 text-sm">
            <li className="flex items-center gap-2 text-zinc-300">
              <Check className="w-4 h-4 text-zinc-500" /> 5 downloads per day
            </li>
            <li className="flex items-center gap-2 text-zinc-300">
              <Check className="w-4 h-4 text-zinc-500" /> Standard quality
            </li>
            <li className="flex items-center gap-2 text-zinc-300">
              <Check className="w-4 h-4 text-zinc-500" /> Basic platform support
            </li>
          </ul>
          {!session ? (
            <Link
              href="/register"
              className="block text-center border border-zinc-700 text-zinc-300 py-2.5 rounded-xl font-medium hover:border-zinc-500 transition"
            >
              Get Started Free
            </Link>
          ) : (
            <span className="block text-center text-zinc-600 py-2.5">Current Plan</span>
          )}
        </div>

        {/* VIP Plan */}
        <div className="bg-gradient-to-b from-amber-900/40 to-zinc-900 border border-amber-700/50 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-3 right-3 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
            POPULAR
          </div>
          <h3 className="text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
            <Crown className="w-5 h-5" /> VIP
          </h3>
          <p className="text-3xl font-bold text-white mb-4">
            $4.99<span className="text-base text-zinc-400 font-normal">/month</span>
          </p>
          <ul className="space-y-3 mb-6 text-sm">
            <li className="flex items-center gap-2 text-zinc-300">
              <Check className="w-4 h-4 text-amber-400" /> Unlimited downloads
            </li>
            <li className="flex items-center gap-2 text-zinc-300">
              <Check className="w-4 h-4 text-amber-400" /> HD & 4K quality support
            </li>
            <li className="flex items-center gap-2 text-zinc-300">
              <Check className="w-4 h-4 text-amber-400" /> All platforms supported
            </li>
            <li className="flex items-center gap-2 text-zinc-300">
              <Check className="w-4 h-4 text-amber-400" /> Priority processing
            </li>
            <li className="flex items-center gap-2 text-zinc-300">
              <Check className="w-4 h-4 text-amber-400" /> Batch download
            </li>
          </ul>
          <button
            onClick={() => alert("Stripe payment will be integrated here.\nConfigure STRIPE_SECRET_KEY in .env")}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white py-2.5 rounded-xl font-medium transition"
          >
            Subscribe Now
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-16 grid grid-cols-3 gap-6 text-center">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <Zap className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-white font-bold">Priority Speed</p>
          <p className="text-zinc-500 text-xs">Dedicated servers</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <Infinity className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-white font-bold">Unlimited</p>
          <p className="text-zinc-500 text-xs">No daily limits</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <Download className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-white font-bold">HD Quality</p>
          <p className="text-zinc-500 text-xs">Up to 4K</p>
        </div>
      </div>
    </div>
  )
}
