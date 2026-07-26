import { serverAuth as auth } from "~~/server/utils/server-auth"

export default defineTask({
  meta: { name: "seed:user" },
  async run() {
    console.log("🛡 Seeding user...")

    const rc = useRuntimeConfig()
    const { user } = await auth.api.createUser({
      body: {
        email: rc.defaultAdminEmail,
        password: rc.defaultAdminPass,
        name: rc.defaultAdminName,
      }
    })

    if (user) {
      return { result: "Success" }
    } else {
      return { result: "Error" }
    }
  }
})
