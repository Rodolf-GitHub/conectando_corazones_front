<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})
</script>

<template>
  <div class="min-h-screen">
    <RouterView />
  </div>
</template>
