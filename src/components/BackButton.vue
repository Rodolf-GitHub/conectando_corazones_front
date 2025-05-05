<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <button
    @click="goBack"
    class="fixed left-6 top-6 z-50 flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm text-pink-600 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 group"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 transform group-hover:-translate-x-1 transition-transform duration-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
</template>
