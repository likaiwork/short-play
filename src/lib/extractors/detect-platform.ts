import type { Platform } from "./types"

const PLATFORM_PATTERNS: Array<{ hostPattern: RegExp; platform: Platform }> = [
  { hostPattern: /(^|\.)instagram\.com$/i, platform: "instagram" },
  { hostPattern: /(^|\.)(x\.com|twitter\.com)$/i, platform: "twitter" },
  { hostPattern: /(^|\.)facebook\.com$/i, platform: "facebook" },
  { hostPattern: /(^|\.)dailymotion\.com$/i, platform: "dailymotion" },
  { hostPattern: /(^|\.)(kuaishou\.com|kuaishou\.cn)$/i, platform: "kuaishou" },
]

export function detectPlatform(urlString: string): Platform | null {
  try {
    const host = new URL(urlString).hostname.toLowerCase().replace(/^www\./, "")
    for (const { hostPattern, platform } of PLATFORM_PATTERNS) {
      if (hostPattern.test(host)) return platform
    }
    return null
  } catch {
    return null
  }
}
