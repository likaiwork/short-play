const windowMs = 60_000
const maxRequests = 20

const store = new Map<string, { count: number; resetAt: number }>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 300_000)

export function rateLimit(key: string, limit = maxRequests): { ok: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1 }
  }

  entry.count++
  if (entry.count > limit) {
    return { ok: false, remaining: 0 }
  }

  return { ok: true, remaining: limit - entry.count }
}
