<script setup lang="ts">
import { useCloudSync } from '~/composables/useCloudSync'

const route = useRoute()
const isOnboarding = computed(() => route.path.startsWith('/onboarding'))
const cloudSync = useCloudSync()

onMounted(async () => cloudSync.initialize())
</script>

<template>
  <TheHeader v-if="!isOnboarding" />
  <div class="flex flex-1 overflow-hidden bg-gray-50 leading-8 dark:bg-gray-900" :class="isOnboarding ? '' : 'py-16'">
    <div class="relative mx-auto h-full w-full max-w-screen-2xl overflow-y-auto bg-gray-50 dark:bg-gray-900 dark:text-white">
      <RouterView />
    </div>
  </div>

  <TheFooter v-if="!isOnboarding" />
</template>
