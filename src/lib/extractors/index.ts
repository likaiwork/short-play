import { register } from "./registry"
import { instagramExtractor } from "./instagram"
import { twitterExtractor, facebookExtractor } from "./media-api"
import { kuaishouExtractor } from "./kuaishou"
import { douyinExtractor } from "./douyin"

register(instagramExtractor)
register(twitterExtractor)
register(facebookExtractor)
register(kuaishouExtractor)
register(douyinExtractor)

export { detectPlatform } from "./detect-platform"
export { find as findExtractor } from "./registry"
export type { Platform, ExtractResult, Extractor } from "./types"
