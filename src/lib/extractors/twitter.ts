import type { Extractor, ExtractResult } from "./types"

export const twitterExtractor: Extractor = {
  platform: "twitter",

  async extract(_url: string): Promise<ExtractResult> {
    // TODO: Replace with actual Twitter/X extraction backend when available.
    return {
      title: null,
      thumbnail: null,
      downloadUrl: null,
      error: "X (Twitter) downloads are not yet available. Check back soon!",
    }
  },
}
