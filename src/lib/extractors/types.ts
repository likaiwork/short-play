export type Platform = "instagram" | "twitter"

export interface ExtractResult {
  title: string | null
  thumbnail: string | null
  downloadUrl: string | null
  error?: string
}

export interface Extractor {
  readonly platform: Platform
  extract(url: string): Promise<ExtractResult>
}
