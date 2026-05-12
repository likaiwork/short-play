"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Download, Clock, CheckCircle, XCircle } from "lucide-react"

interface Record {
  id: string
  url: string
  title: string | null
  downloadUrl: string | null
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated") {
      fetch("/api/download")
        .then((r) => r.json())
        .then((data) => setRecords(data.records || []))
        .finally(() => setLoading(false))
    }
  }, [status, router])

  if (status === "loading" || loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-20 text-center text-zinc-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-12">
      <h1 className="text-2xl font-bold text-white mb-2">Download History</h1>
      <p className="text-zinc-400 text-sm mb-8">
        {session?.user.email} — {records.length} downloads
      </p>

      {records.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <Download className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500">No downloads yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <div key={r.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium truncate">
                    {r.title || "Untitled"}
                  </p>
                  <p className="text-zinc-500 text-xs truncate mt-1">{r.url}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {r.status === "completed" ? (
                      <span className="text-emerald-400 text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Completed
                      </span>
                    ) : r.status === "failed" ? (
                      <span className="text-red-400 text-xs flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Failed
                      </span>
                    ) : (
                      <span className="text-amber-400 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                    <span className="text-zinc-600 text-xs">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {r.downloadUrl && (
                  <a
                    href={r.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Link
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
