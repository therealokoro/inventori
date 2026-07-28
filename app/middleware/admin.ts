export default defineNuxtRouteMiddleware(async (_to) => {
  const { isLoggedIn, isAdmin, waitForSession } = useAuth()

  if (!isLoggedIn.value) return
  await waitForSession()

  if (!isAdmin.value) {
    return navigateTo("/")
  }
})
