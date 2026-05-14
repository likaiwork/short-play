import type { Extractor, Platform } from "./types"

const registry = new Map<Platform, Extractor>()

export function register(extractor: Extractor): void {
  registry.set(extractor.platform, extractor)
}

export function find(platform: Platform): Extractor | undefined {
  return registry.get(platform)
}
