<template>
  <ToastContainer v-slot="{ toast, ui }">
    <UiAlert
      v-bind="ui.getRootProps({ class: 'my-toast' })"
      icon="lucide:circle-check"
      icon-class="text-emerald-500 mt-0.5"
    >
      <UiAlertDescription class="mb-1 flex items-center justify-between font-medium">
        <UiAlertTitle>{{ toast.title }}</UiAlertTitle>
        <UiButton
          variant="ghost"
          size="icon-xs"
          class="size-5"
          icon="lucide:x"
          v-bind="ui.getCloseProps()"
        />
      </UiAlertDescription>
      <p class="text-muted-foreground mb-3 text-sm">
        {{ toast.description }}
      </p>
      <div class="flex items-center gap-2">
        <UiButton
          v-for="button in ui.buttons.items"
          :key="button.id"
          v-bind="ui.getButtonProps(button)"
          class="text-xs"
          size="xs"
        >
          {{ button.label }}
        </UiButton>
      </div>
    </UiAlert>
  </ToastContainer>
</template>
