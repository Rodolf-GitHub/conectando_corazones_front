<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Profile } from '@/types/profile.type'
import profileService from '@/services/profile.service'
import defaultImage from '@/assets/images/img1.jpg'

const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const profiles = ref<Profile[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const isLoaded = ref(false)
const router = useRouter()
const secretClickCount = ref(0)
const showSecretHint = ref(false)
const showHelpModal = ref(false)

const getImageUrl = (imagePath: string | null | undefined) => {
  if (!imagePath) return defaultImage
  if (imagePath.startsWith('blob:')) return imagePath
  if (imagePath.startsWith('/src/assets/')) return imagePath
  if (imagePath === '/src/assets/images/img1.jpg') return defaultImage
  return `${backendUrl}${imagePath}`
}

const loadProfiles = async () => {
  if (isLoaded.value) return

  try {
    loading.value = true
    const response = await profileService.getAllProfiles()
    profiles.value = response
    isLoaded.value = true
  } catch (e) {
    error.value = 'Error al cargar los perfiles'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const navigateToProfile = (profile: Profile) => {
  if (!profile || !profile.name) {
    console.error('Perfil inválido')
    return
  }
  const nameSlug = profile.name.toLowerCase().replace(/\s+/g, '-')
  router.push(`/profile/${nameSlug}`)
}

let secretTimer: number | null = null

const handleSecretClick = () => {
  // Limpiar el timer anterior si existe
  if (secretTimer) {
    window.clearTimeout(secretTimer)
  }

  secretClickCount.value++

  if (secretClickCount.value === 1) {
    showSecretHint.value = true
  }

  if (secretClickCount.value === 3) {
    secretClickCount.value = 0
    showSecretHint.value = false
    router.push('/login')
    return
  }

  // Establecer un nuevo timer
  secretTimer = window.setTimeout(() => {
    secretClickCount.value = 0
    showSecretHint.value = false
    secretTimer = null
  }, 2000)
}

onMounted(() => {
  if (!isLoaded.value) {
    loadProfiles()
  }
})
</script>

<template>
  <div class="home-container min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-50">
    <!-- Header con diseño mejorado -->
    <div class="relative overflow-hidden bg-gradient-to-r from-red-400 via-pink-500 to-red-400">
      <div class="absolute inset-0 bg-[url('/hearts-pattern.png')] opacity-10"></div>
      <div class="relative px-4 pt-20 pb-12 md:py-12 max-w-7xl mx-auto">
        <!-- Botones de la esquina superior -->
        <div class="absolute right-4 top-4 md:right-6 md:top-6 flex items-center gap-2 md:gap-4">
          <!-- Botón de ayuda -->
          <button
            @click="showHelpModal = true"
            class="flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/90 backdrop-blur-sm text-pink-600 rounded-full hover:bg-white transition-all duration-300 shadow-lg text-sm md:text-base"
          >
            <span class="text-lg md:text-xl">❔</span>
            <span class="font-medium">Ayuda</span>
          </button>

          <!-- Botón secreto -->
          <div class="flex items-center">
            <div
              v-if="showSecretHint"
              class="animate-fade-in mr-2 md:mr-3 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 rounded-full text-xs md:text-sm text-pink-600 shadow-lg"
            >
              {{ 3 - secretClickCount }} clicks más...
            </div>
            <button
              @click="handleSecretClick"
              class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95 hover:rotate-12 shadow-lg group"
            >
              <span class="text-3xl md:text-4xl leading-none group-hover:animate-pulse">💝</span>
            </button>
          </div>
        </div>

        <h1
          class="text-3xl md:text-6xl font-bold text-white text-center mb-3 md:mb-4 font-dancing drop-shadow-lg"
        >
          Conectando Corazones
        </h1>
        <p class="text-lg md:text-2xl text-white/90 text-center max-w-3xl mx-auto font-light">
          Encuentra el amor verdadero con las chicas más hermosas 💕
        </p>
      </div>
    </div>

    <!-- Modal de ayuda -->
    <div
      v-if="showHelpModal"
      class="fixed inset-0 flex items-center justify-center z-50 p-4 md:px-4"
      @click="showHelpModal = false"
    >
      <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div
        class="relative bg-white rounded-3xl shadow-xl p-4 md:p-8 w-full max-w-lg mx-auto transform animate-bounce-in max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <button
          @click="showHelpModal = false"
          class="absolute right-3 top-3 md:right-4 md:top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>

        <div class="text-center mb-4 md:mb-6">
          <span class="text-3xl md:text-4xl mb-3 md:mb-4 block">💕</span>
          <h3 class="text-xl md:text-2xl font-dancing text-pink-600 mb-2">¿Cómo Funciona?</h3>
        </div>

        <div class="space-y-3 md:space-y-4 text-gray-600 text-sm md:text-base">
          <p class="flex items-start gap-3">
            <span class="text-xl">1️⃣</span>
            <span>Explora los perfiles de hermosas chicas solteras en nuestra galería.</span>
          </p>
          <p class="flex items-start gap-3">
            <span class="text-xl">2️⃣</span>
            <span>Haz clic en el perfil que te interese para ver más detalles.</span>
          </p>
          <p class="flex items-start gap-3">
            <span class="text-xl">3️⃣</span>
            <span
              >En el perfil, encontrarás un botón de WhatsApp para iniciar una conversación
              directamente.</span
            >
          </p>
          <p class="flex items-start gap-3">
            <span class="text-xl">💬</span>
            <span>¡Comienza una conversación y encuentra el amor verdadero!</span>
          </p>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-100 text-center">
          <p class="text-pink-600 font-dancing text-xl">
            ¡No esperes más para encontrar el amor! 💝
          </p>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div v-if="loading" class="flex justify-center items-center h-[400px]">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
      </div>

      <div v-else-if="error" class="text-center text-red-500 p-4">
        {{ error }}
      </div>

      <div v-else>
        <!-- Mensaje inspirador -->
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-dancing text-pink-600 mb-3">
            ✨ Chicas Solteras Esperando por Ti ✨
          </h2>
          <p class="text-gray-600">Descubre conexiones especiales con personas increíbles</p>
        </div>

        <!-- Grid de perfiles con diseño mejorado -->
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
        >
          <div
            v-for="profile in profiles"
            :key="profile.id"
            class="profile-card group cursor-pointer"
            @click="navigateToProfile(profile)"
          >
            <div class="relative">
              <!-- Marco decorativo -->
              <div
                class="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-red-400 rounded-full opacity-75 group-hover:opacity-100 blur transition-opacity"
              ></div>
              <div class="relative">
                <div class="overflow-hidden rounded-full aspect-square bg-white">
                  <img
                    :src="getImageUrl(profile.cover_image)"
                    :alt="profile.name"
                    class="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
            <div class="mt-3 text-center">
              <h3
                class="text-sm font-medium text-gray-800 truncate group-hover:text-pink-600 transition-colors"
              >
                {{ profile.name }}
              </h3>
              <p
                class="text-xs text-pink-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Click para chatear 💝
              </p>
            </div>
          </div>
        </div>

        <!-- Sección de beneficios -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16 mb-8 md:mb-12">
          <div class="text-center p-6 bg-white/50 rounded-2xl backdrop-blur-sm">
            <span class="text-3xl mb-3 block">💖</span>
            <h3 class="text-lg font-medium text-gray-800 mb-2">Conexiones Reales</h3>
            <p class="text-sm text-gray-600">
              Encuentra personas auténticas buscando amor verdadero
            </p>
          </div>
          <div class="text-center p-6 bg-white/50 rounded-2xl backdrop-blur-sm">
            <span class="text-3xl mb-3 block">🌹</span>
            <h3 class="text-lg font-medium text-gray-800 mb-2">Ambiente Romántico</h3>
            <p class="text-sm text-gray-600">El lugar perfecto para encontrar tu media naranja</p>
          </div>
          <div class="text-center p-6 bg-white/50 rounded-2xl backdrop-blur-sm">
            <span class="text-3xl mb-3 block">✨</span>
            <h3 class="text-lg font-medium text-gray-800 mb-2">Momentos Mágicos</h3>
            <p class="text-sm text-gray-600">Crea recuerdos inolvidables con alguien especial</p>
          </div>
        </div>

        <!-- Footer mejorado -->
        <div
          class="text-center mt-8 md:mt-12 p-6 md:p-8 bg-gradient-to-r from-pink-100 via-red-50 to-pink-100 rounded-3xl shadow-sm"
        >
          <h3 class="text-xl md:text-2xl font-dancing text-pink-600 mb-2 md:mb-3">
            💝 Tu Historia de Amor Comienza Aquí 💝
          </h3>
          <p class="text-xs md:text-sm text-gray-600 max-w-2xl mx-auto">
            Ambiente seguro y respetuoso para personas mayores de edad buscando conexiones genuinas
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

.home-container {
  background-attachment: fixed;
}

.profile-card {
  transition: all 0.3s ease;
}

.font-dancing {
  font-family: 'Dancing Script', cursive;
}

/* Animación suave para las cards */
.profile-card {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Aplicar delay a cada card */
.profile-card:nth-child(1) {
  animation-delay: 0.1s;
}
.profile-card:nth-child(2) {
  animation-delay: 0.2s;
}
.profile-card:nth-child(3) {
  animation-delay: 0.3s;
}
.profile-card:nth-child(4) {
  animation-delay: 0.4s;
}
.profile-card:nth-child(5) {
  animation-delay: 0.5s;
}
.profile-card:nth-child(6) {
  animation-delay: 0.6s;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.group-hover\:animate-pulse {
  animation: pulse 1s ease-in-out infinite;
}
</style>
