import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { rateLimit } from "./rate-limit"

const DUMMY_HASH = "$2a$12$LJ3m4ys3LkBCVxJGqOjPkuUzqKqEBhKzFdLkN4oF3FjyF3L9QZzKO"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string

        if (!rateLimit(`login:${email}`, 5).ok) return null

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
          // Compare against dummy hash to prevent timing-based email enumeration
          await bcrypt.compare(password, DUMMY_HASH)
          return null
        }

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isVip: user.isVip,
          vipExpiresAt: user.vipExpiresAt,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isVip = user.isVip
        token.vipExpiresAt = user.vipExpiresAt?.toISOString() ?? null
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.isVip = token.isVip as boolean
        session.user.vipExpiresAt = token.vipExpiresAt as string | null
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})
