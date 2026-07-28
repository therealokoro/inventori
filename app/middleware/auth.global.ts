export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, waitForSession } = useAuth()

  if (isLoggedIn.value) return
  if (to.path === "/login") return

  await waitForSession()

  if (!isLoggedIn.value) {
    return navigateTo("/login")
  }
})
