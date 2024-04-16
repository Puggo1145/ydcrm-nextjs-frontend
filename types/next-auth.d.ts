import type { DefaultSession, DefaultUser } from "next-auth"
import type { DefaultJWT } from "next-auth/jwt";
// types
import type role from "@/types/modelType/user";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      role: role
      phone: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: role
    phone: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: role
    phone: string
  }
}