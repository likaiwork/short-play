import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

type AuthResult =
  | { ok: true; userId: string; user: { id: string; email: string; name?: string | null } }
  | { ok: false; response: NextResponse<{ error: string }> }

export async function requireAuth(): Promise<AuthResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { ok: false, response: NextResponse.json({ error: "Please login first" }, { status: 401 }) }
  }
  return { ok: true, userId: session.user.id, user: session.user }
}
