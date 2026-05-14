import { register } from "./registry"
import { instagramExtractor } from "./instagram"
import { twitterExtractor, facebookExtractor, dailymotionExtractor } from "./media-api"
import { kuaishouExtractor } from "./kuaishou"

register(instagramExtractor)
register(twitterExtractor)
register(facebookExtractor)
register(dailymotionExtractor)
register(kuaishouExtractor)

export { detectPlatform } from "./detect-platform"
export { find as findExtractor } from "./registry"
export type { Platform, ExtractResult, Extractor } from "./types"
