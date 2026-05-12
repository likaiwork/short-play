"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { Menu, X, Download, Crown, LogIn, UserPlus } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-emerald-400" />
          VidDown
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/download" className="text-zinc-300 hover:text-white transition">
            Download
          </Link>
          <Link href="/vip" className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1">
            <Crown className="w-4 h-4" /> VIP
          </Link>
          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-zinc-300 hover:text-white transition">
                Dashboard
              </Link>
              <span className="text-zinc-500 text-xs">{session.user.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-zinc-400 hover:text-white transition text-xs"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-zinc-300 hover:text-white transition flex items-center gap-1">
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link
                href="/register"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1 text-xs"
              >
                <UserPlus className="w-4 h-4" /> Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-zinc-300" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4 flex flex-col gap-3 text-sm">
          <Link href="/download" className="text-zinc-300" onClick={() => setOpen(false)}>Download</Link>
          <Link href="/vip" className="text-amber-400" onClick={() => setOpen(false)}>VIP</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-zinc-300" onClick={() => setOpen(false)}>Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-left text-zinc-400">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-zinc-300" onClick={() => setOpen(false)}>Login</Link>
              <Link href="/register" className="text-emerald-400" onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
