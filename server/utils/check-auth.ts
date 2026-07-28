import { createError, type H3Event } from "h3"
import { serverAuth } from "~~/server/utils/server-auth"

export async function getSessionUser(event: H3Event) {
  const session = await serverAuth.api.getSession({ headers: event.headers })
  return session?.user ?? null
}

export async function requireAdmin(event: H3Event) {
  const user = await getSessionUser(event)
  if (!user || user.role !== "admin") {
    throw createError({ statusCode: 403, message: "Admin access required" })
  }
}
