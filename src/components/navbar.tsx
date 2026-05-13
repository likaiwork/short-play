"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Download } from "lucide-react"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-gray-900 flex items-center gap-2">
          <Download className="w-5 h-5 text-emerald-600" />
          VidDown
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-base">
          <a href="/" className="text-gray-700 hover:text-gray-900 transition">
            Download
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-gray-700" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 flex flex-col gap-3 text-base">
          <a href="/" className="text-gray-700" onClick={() => setOpen(false)}>Download</a>
        </div>
      )}
    </nav>
  )
}
