import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      isVip: boolean
      vipExpiresAt?: string | null
    }
  }
  interface User {
    id: string
    email: string
    name?: string | null
    isVip: boolean
    vipExpiresAt?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    isVip: boolean
    vipExpiresAt?: string | null
  }
}
