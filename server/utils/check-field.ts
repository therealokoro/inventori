import { createError, readBody, type H3Event } from "h3"

import { getSessionUser } from "./check-auth"

export async function assertAdminOnlyFields(event: H3Event, fieldNames: string[]) {
  const user = await getSessionUser(event)
  if (!user || user.role !== "admin") {
    const body = await readBody(event)
    if (body) {
      const unauthorizedFields = fieldNames.filter((field) => field in body)
      if (unauthorizedFields.length > 0) {
        throw createError({
          statusCode: 403,
          message: `Non-admin users cannot set admin-only fields: ${unauthorizedFields.join(", ")}`
        })
      }
    }
  }
}
