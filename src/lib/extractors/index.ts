import { register } from "./registry"
import { instagramExtractor } from "./instagram"
import { twitterExtractor } from "./twitter"

register(instagramExtractor)
register(twitterExtractor)

export { detectPlatform } from "./detect-platform"
export { find as findExtractor } from "./registry"
export type { Platform, ExtractResult, Extractor } from "./types"
