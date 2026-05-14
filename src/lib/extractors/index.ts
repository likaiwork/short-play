import { register } from "./registry"
import { instagramExtractor } from "./instagram"
import { twitterExtractor, facebookExtractor } from "./media-api"
import { kuaishouExtractor } from "./kuaishou"
import { douyinExtractor } from "./douyin"
import { xiaohongshuExtractor } from "./xiaohongshu"

register(instagramExtractor)
register(twitterExtractor)
register(facebookExtractor)
register(kuaishouExtractor)
register(douyinExtractor)
register(xiaohongshuExtractor)

export { detectPlatform } from "./detect-platform"
export { find as findExtractor } from "./registry"
export type { Platform, ExtractResult, Extractor } from "./types"
