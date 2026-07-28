<script lang="ts" setup>
const { user } = useAuth()
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <p v-if="user" class="text-muted-foreground">Welcome, {{ user.name || user.email }}</p>
  </div>
</template>
