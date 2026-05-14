import type { Extractor, ExtractResult } from "./types"
import { isPublicUrl } from "@/lib/url-validator"

const BACKEND_URL = process.env.KUAISHOU_API_URL || "http://43.165.65.71:5557/detail/"
const COOKIE = process.env.KUAISHOU_COOKIE || "kpf=PC_WEB; clientid=3; did=web_345381406e25372f4cc9fd3ef3866d2f; kpn=KUAISHOU_VISION; kwscode=KOjsMWLIm+kO/f7MlE6gmsc4e/9zZHjFABTH1lF31C4N660Cbkz6jNAfmzgPFQImBVd7nlERW7CrHWS9X2sY/RAhGwBulDpZpRdMwvZyUX8t3PsTekh5Gv3g4mngMgKty3RzNkrJ8oZ3ddrX7BQYAskgS==; kwssectoken=nzxQI8xSGmpKKTEZ7dftM2f39sC4iO4JJnsVhj2COXU5G5dRG5Amr8QoXFX0l0Uz; userId=5143011151; ktrace-context=1|MS44Nzg0NzI0NTc4Nzk2ODY5LjYxNDY2MTYzLjE3NjMwMTk1MDk2NjcuMTIxMDc3OQ==|MS44Nzg0NzI0NTc4Nzk2ODY5LjM4NDU2OTQ5LjE3NjMwMTk1MDk2NjcuMTIxMDc4MA==|0|webservice-user-growth-node|webservice|true|src-Js; kuaishou.server.webday7_ph=2cf456db9648210fb11f065bfb14e46a5b9f; kuaishou.server.webday7_st=ChprdWFpc2hvdS5zZXJ2ZXIud2ViZGF5Ny5zdBKwAQA4rzuuseQaxGanSZgaTQG0mXT_cPOsdGI3aM1N1hDab-KUa4d3_c7JkA0XGtLbSF34-NlP8d-DzUG_GhRtaaPgdXL0yEAstraznMgLNzOrWf4aZFa709a5p2G_OiSEWAhSWcsfQedraHlmKnhMmMxzilk_o--_RNGYD3-PvbUaZ2khZ1MPCoqGqHSnPT-dQFU528LRiLg9jDsGsah0vaUe6wfsv_ZwcrC6qIKgjItxGhJwsiUf1kVEyqYl3dJxMsifV78iIFPknU46jdhcTpCBCCMHnYXB6WO3P24lVxFOTbXIbEznKAUwAQ"

export const kuaishouExtractor: Extractor = {
  platform: "kuaishou",

  async extract(url: string): Promise<ExtractResult> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    try {
      const resp = await fetch(BACKEND_URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": "VidDown/1.0",
        },
        body: JSON.stringify({ cookie: COOKIE, proxy: "", text: url }),
      })

      if (!resp.ok) {
        return {
          title: null, thumbnail: null, downloadUrl: null,
          error: `Kuaishou backend returned HTTP ${resp.status}`,
        }
      }

      const data = await resp.json()

      const downloadUrl: string | null = data?.data?.download || null
      const title: string | null = data?.data?.name || null
      const thumbnail: string | null = data?.data?.coverUrl || null

      if (!downloadUrl) {
        return { title, thumbnail, downloadUrl: null, error: "No download URL in Kuaishou response" }
      }

      if (!isPublicUrl(downloadUrl)) {
        return { title, thumbnail, downloadUrl: null, error: "Kuaishou backend returned an invalid media URL" }
      }

      return { title, thumbnail, downloadUrl }
    } catch (err: unknown) {
      const message = err instanceof Error
        ? (err.name === "AbortError" ? "Kuaishou backend timed out" : err.message)
        : "Unknown error"
      return { title: null, thumbnail: null, downloadUrl: null, error: `Extraction failed: ${message}` }
    } finally {
      clearTimeout(timeout)
    }
  },
}
