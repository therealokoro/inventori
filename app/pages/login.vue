<script lang="ts" setup>
definePageMeta({ layout: "auth" })

const notify = useToast()
const { signIn, isPending } = useAuth()

const onSubmit = async (values: { email: string; password: string }) => {
  const { error } = await signIn.email({
    email: values.email,
    password: values.password,
    callbackURL: "/"
  })

  if (error) {
    notify.error({ title: "Login failed", description: error.message })
    return
  }
}
</script>

<template>
  <div class="w-full md:w-100 space-y-5 rounded bg-background p-10">
    <div class="flex-center flex-col gap-2">
      <PageLogo />
      <div class="text-center">
        <h2 class="text-lg font-extrabold">Welcome Back</h2>
        <p class="text-muted-foreground text-xs">Enter your login credentials to continue</p>
      </div>
    </div>

    <UiSeparator />

    <FormKit :actions="false" type="form" id="login-form" @submit="onSubmit">
      <FormKit
        type="email"
        name="email"
        label="Email Address"
        placeholder="e.g user@example.com"
        validation="required|email"
      />
      <FormKitPassword
        type="password"
        name="password"
        label="Password"
        placeholder="******************"
        validation="required"
      />
      <FormKit type="submit" :disabled="isPending">Continue to Dashboard</FormKit>
      <FormKitMessages class="text-center" />
    </FormKit>
  </div>
</template>
