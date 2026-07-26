<script setup lang="ts">
import { ICONS } from "#shared/constants/icons"

const { crumbs } = useBreadcrumbs({ root: "/dashboard" })
const router = useRouter()

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    /** Show the loader manually e.g. while fetching data */
    loading?: boolean
    /** Pass an error manually e.g. from useFetch */
    error?: Error | null
    class?: string
    badge?: string
  }>(),
  {
    loading: false,
    error: null
  }
)

useHead(() => ({
  title: props.title ? `${props.title} | MyApp` : "MyApp"
}))

const nuxtError = useError()

// useLoadingIndicator() reflects Nuxt's router-level loading bar and fires on
// every <NuxtPage /> render — including nested ones (e.g. settings sub-pages).
// Using it to gate page *content* visibility means any parent Page component
// re-hides its content behind a spinner whenever a child route navigates,
// which is what caused the permanent spinner on /dashboard/settings/*.
//
// The loading indicator belongs on a global progress bar (e.g. in app.vue),
// not inside individual page content guards. Page content should only show a
// spinner when the page itself is explicitly fetching something — i.e. when
// the `loading` prop is passed as true by the consumer.
const isLoading = computed(() => props.loading)

// Prop error takes priority, then Nuxt's app-level error
const activeError = computed(() => props.error ?? nuxtError.value ?? null)
const hasError = computed(() => activeError.value !== null)

// Show statusCode if available (from createError)
const errorCode = computed(() => (activeError.value as any)?.statusCode ?? null)
const errorMessage = computed(
  () => activeError.value?.message || "An unexpected error occurred. Please try again."
)

// Only show Go Back if there's actually somewhere to go back to
const canGoBack = computed(() => !!router.options.history.state.back)
</script>

<template>
  <div class="w-full">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <UiLoader class="size-10" text="Loading Content..." />
    </div>

    <!-- Error State -->
    <div
      v-else-if="hasError"
      class="flex flex-col items-center justify-center py-16 gap-4 text-center"
    >
      <div class="flex items-center justify-center size-12 rounded-full bg-destructive/10">
        <Icon :name="ICONS.error" class="size-5 text-destructive" />
      </div>

      <div class="space-y-1 max-w-sm">
        <ui-heading :level="2" class="text-base font-semibold">
          {{ errorCode ? `Error ${errorCode}` : "Something went wrong" }}
        </ui-heading>
        <p class="text-sm text-foreground/80">{{ errorMessage }}</p>
      </div>

      <div class="flex items-center gap-2">
        <UiButton
          v-if="canGoBack"
          variant="outline"
          :icon="ICONS.previous"
          @click="clearError({ redirect: router.options.history.state.back as string })"
        >
          Go Back
        </UiButton>
        <UiButton
          variant="outline"
          :icon="ICONS.home"
          @click="clearError({ redirect: '/dashboard' })"
        >
          Go Home
        </UiButton>
      </div>
    </div>

    <!-- Page Content -->
    <div v-else class="grid w-full gap-6">
      <div class="flex items-center gap-2">
        <!-- Quick Navigation Buttons -->
        <ui-button-group>
          <ui-button
            @click="router.go(-1)"
            class="text-muted-foreground"
            :icon="ICONS.previous"
            variant="ghost"
            size="icon-sm"
          />
          <ui-button
            @click="router.go(1)"
            class="text-muted-foreground"
            :icon="ICONS.next"
            variant="ghost"
            size="icon-sm"
          />
        </ui-button-group>

        <!-- Breadcrumb -->
        <UiBreadcrumbs v-if="crumbs.length" :items="crumbs" class="text-xs md:text-sm" />
      </div>

      <!-- Page Slot -->
      <slot />
    </div>
  </div>
</template>
