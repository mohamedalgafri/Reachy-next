// lib/session.ts
import { auth } from "@/auth"

export const getCurrentUser = async () => {
  try {
    const session = await auth()
    return session?.user
  } catch {
    return undefined
  }
}