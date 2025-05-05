<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ProfileDetail } from '@/types/profile.type'
import profileService from '@/services/profile.service'
import BackButton from '@/components/BackButton.vue'
import defaultImage from '@/assets/images/img1.jpg'

const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const route = useRoute()
const router = useRouter()
const profile = ref<ProfileDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const getImageUrl = (imagePath: string | null | undefined) => {
  if (!imagePath) return defaultImage
  if (imagePath.startsWith('blob:')) return imagePath
  if (imagePath.startsWith('/src/assets/')) return imagePath
  if (imagePath === '/src/assets/images/img1.jpg') return defaultImage
  return `${backendUrl}${imagePath}`
}

const loadProfile = async () => {
  try {
    loading.value = true
    const profiles = await profileService.getAllProfiles()
    const nameFromUrl = route.params.name as string
    const foundProfile = profiles.find(
      (p) => p.name.toLowerCase().replace(/\s+/g, '-') === nameFromUrl,
    )

    if (!foundProfile) {
      router.push('/')
      return
    }

    // Obtener los detalles completos del perfil
    profile.value = await profileService.getProfileById(foundProfile.id)
  } catch (e) {
    error.value = 'Error al cargar el perfil'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-50">
    <BackButton />

    <!-- Header decorativo -->
    <div class="relative overflow-hidden bg-gradient-to-r from-red-400 via-pink-500 to-red-400">
      <div class="absolute inset-0 bg-[url('/hearts-pattern.png')] opacity-10"></div>
      <div class="relative px-4 py-8 max-w-7xl mx-auto">
        <h1 class="text-4xl font-dancing text-white text-center mb-2 drop-shadow-lg">
          {{ profile?.name || 'Perfil Romántico' }}
        </h1>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="loading" class="flex justify-center items-center h-[400px]">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
      </div>

      <div v-else-if="error" class="text-center text-red-500 p-4 bg-red-50 rounded-xl">
        {{ error }}
      </div>

      <div v-else-if="profile" class="space-y-6 md:space-y-8">
        <!-- Sección principal con imagen y botón de WhatsApp -->
        <div class="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div class="relative">
            <div class="aspect-[3/2] md:aspect-[2/1]">
              <img
                :src="getImageUrl(profile.cover_image)"
                :alt="profile.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            ></div>

            <!-- Información superpuesta -->
            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 class="text-3xl md:text-4xl font-dancing mb-2 drop-shadow-lg">
                {{ profile.name }}
              </h2>
              <p class="text-white/90 text-sm md:text-base line-clamp-2 md:line-clamp-none">
                {{ profile.description }}
              </p>
            </div>

            <!-- Botón de WhatsApp flotante -->
            <a
              v-if="profile.whatsapp_link"
              :href="profile.whatsapp_link"
              target="_blank"
              rel="noopener noreferrer"
              class="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg group"
            >
              <svg
                class="w-6 h-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                />
              </svg>
              <span class="font-medium">Chatear</span>
            </a>
          </div>
        </div>

        <!-- Galería de imágenes -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <template v-for="i in 3" :key="i">
            <div
              v-if="profile[`image_${i}` as keyof ProfileDetail]"
              class="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300"
            >
              <div class="aspect-square">
                <img
                  :src="getImageUrl(profile[`image_${i}` as keyof ProfileDetail])"
                  :alt="`Imagen ${i} de ${profile.name}`"
                  class="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          </template>
        </div>

        <!-- Sección de redes sociales -->
        <div class="bg-white rounded-3xl shadow-sm overflow-hidden p-6 md:p-8">
          <h3 class="text-2xl font-dancing text-pink-600 mb-6 text-center">Conecta Conmigo</h3>
          <div class="flex flex-col md:flex-row gap-4 justify-center">
            <a
              v-if="profile.whatsapp_link"
              :href="profile.whatsapp_link"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <svg
                class="w-6 h-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                />
              </svg>
              <span class="font-medium group-hover:scale-105 transition-transform">
                Iniciar Chat en WhatsApp
              </span>
            </a>
            <a
              v-if="profile.facebook_link"
              :href="profile.facebook_link"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <span class="text-2xl">👥</span>
              <span class="font-medium group-hover:scale-105 transition-transform">
                Visitar Facebook
              </span>
            </a>
          </div>
        </div>

        <!-- Footer romántico -->
        <div
          class="text-center p-6 md:p-8 bg-gradient-to-r from-pink-100 via-red-50 to-pink-100 rounded-3xl"
        >
          <p class="text-xl md:text-2xl font-dancing text-pink-600 mb-3">
            💝 ¿Te gustaría conocerme? 💝
          </p>
          <p class="text-sm text-gray-600 mb-6">
            No pierdas la oportunidad de comenzar una hermosa historia de amor
          </p>
          <a
            v-if="profile.whatsapp_link"
            :href="profile.whatsapp_link"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <svg
              class="w-6 h-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
              />
            </svg>
            <span class="font-medium text-lg group-hover:scale-105 transition-transform">
              Enviar Mensaje Ahora
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animaciones */
.bg-white {
  animation: fadeIn 0.6s ease-out;
}

/* Mejoras visuales */
img {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.aspect-square {
  position: relative;
  padding-top: 100%;
}

.aspect-square img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
