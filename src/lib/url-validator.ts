const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]",
  "[::]",
])

function isPrivateIP(hostname: string): boolean {
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (!ipv4Match) return false
  const [, a, b] = ipv4Match.map(Number)
  if (a === 10) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a === 169 && b === 254) return true
  if (a === 127) return true
  if (a === 0) return true
  return false
}

export function isPublicUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)
    if (url.protocol !== "http:" && url.protocol !== "https:") return false

    const host = url.hostname.toLowerCase()
    if (BLOCKED_HOSTS.has(host)) return false
    if (isPrivateIP(host)) return false

    return true
  } catch {
    return false
  }
}
