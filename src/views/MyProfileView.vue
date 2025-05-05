<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { ProfileDetail, ProfileUpdate } from '@/types/profile.type'
import profileService from '@/services/profile.service'
import BackButton from '@/components/BackButton.vue'

const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const router = useRouter()
const profile = ref<ProfileDetail | null>(null)
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// Referencias para las imágenes
const coverImageInput = ref<HTMLInputElement | null>(null)
const image1Input = ref<HTMLInputElement | null>(null)
const image2Input = ref<HTMLInputElement | null>(null)
const image3Input = ref<HTMLInputElement | null>(null)

const imageInputRefs = [image1Input, image2Input, image3Input]

const getImageUrl = (imagePath: string | null | undefined) => {
  if (!imagePath) return '/default-image.jpg'
  if (imagePath.startsWith('blob:')) return imagePath
  return `${backendUrl}${imagePath}`
}

const loadProfile = async () => {
  try {
    loading.value = true
    profile.value = await profileService.getMyProfile()
  } catch (e) {
    error.value = 'Error al cargar el perfil'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleImageUpload = async (event: Event, field: keyof ProfileUpdate) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  // Crear una vista previa de la imagen
  if (profile.value) {
    profile.value[field] = URL.createObjectURL(file)
  }
}

const triggerImageInput = (index: number) => {
  imageInputRefs[index]?.value?.click()
}

const formatWhatsAppLink = (value: string) => {
  // Si ya es una URL completa, la devolvemos tal cual
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('wa.me/')) {
    return value
  }
  // Si es solo un número, lo convertimos en enlace
  const numberOnly = value.replace(/\D/g, '') // Elimina todo excepto números
  if (numberOnly) {
    return `https://wa.me/${numberOnly}`
  }
  return value
}

const showSuccessModal = ref(false)

const saveProfile = async () => {
  if (!profile.value) return

  try {
    saving.value = true
    error.value = null

    const updateData: ProfileUpdate = {
      name: profile.value.name,
      description: profile.value.description,
      whatsapp_link: profile.value.whatsapp_link
        ? formatWhatsAppLink(profile.value.whatsapp_link)
        : null,
      facebook_link: profile.value.facebook_link,
    }

    // Recopilar los archivos de imagen
    const files = {
      cover_image: coverImageInput.value?.files?.[0],
      image_1: image1Input.value?.files?.[0],
      image_2: image2Input.value?.files?.[0],
      image_3: image3Input.value?.files?.[0],
    }

    await profileService.updateMyProfile(updateData, files)
    showSuccessModal.value = true

    setTimeout(() => {
      showSuccessModal.value = false
    }, 3000)
  } catch (e) {
    error.value = 'Error al guardar los cambios'
    console.error(e)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-50 py-8 px-4">
    <BackButton />

    <!-- Modal de éxito -->
    <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div class="relative bg-white rounded-3xl shadow-xl p-6 transform animate-bounce-in">
        <div class="text-center">
          <div class="mb-4 text-5xl">💝</div>
          <h3 class="text-2xl font-dancing text-pink-600 mb-2">¡Perfil Actualizado!</h3>
          <p class="text-gray-600">Tus cambios se han guardado con éxito</p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-dancing text-pink-600 mb-2">Mi Perfil Romántico</h1>
        <p class="text-gray-600">Personaliza tu perfil para encontrar el amor verdadero ✨</p>
      </div>

      <div v-if="loading" class="flex justify-center items-center h-[400px]">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
      </div>

      <div v-else-if="error" class="text-center text-red-500 p-4 bg-red-50 rounded-xl">
        {{ error }}
      </div>

      <form v-else @submit.prevent="saveProfile" class="space-y-8">
        <!-- Mensajes de éxito -->
        <div
          v-if="successMessage"
          class="bg-green-50 text-green-600 p-4 rounded-xl text-center animate-fade-in"
        >
          {{ successMessage }}
        </div>

        <!-- Imagen de portada -->
        <div class="bg-white rounded-3xl shadow-sm overflow-hidden p-6">
          <h2 class="text-2xl font-dancing text-pink-600 mb-4">Imagen Principal</h2>
          <div class="relative">
            <div class="aspect-[3/2] rounded-2xl overflow-hidden bg-gray-100">
              <img
                :src="getImageUrl(profile?.cover_image)"
                alt="Imagen de portada"
                class="w-full h-full object-cover"
              />
            </div>
            <input
              ref="coverImageInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageUpload($event, 'cover_image')"
            />
            <button
              type="button"
              @click="coverImageInput?.click()"
              class="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-pink-600 hover:bg-white transition-colors shadow-lg"
            >
              Cambiar Imagen
            </button>
          </div>
        </div>

        <!-- Información básica -->
        <div class="bg-white rounded-3xl shadow-sm overflow-hidden p-6">
          <h2 class="text-2xl font-dancing text-pink-600 mb-4">Información Personal</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                v-model="profile!.name"
                type="text"
                class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                v-model="profile!.description"
                rows="4"
                class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Cuéntanos sobre ti..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Galería de imágenes -->
        <div class="bg-white rounded-3xl shadow-sm overflow-hidden p-6">
          <h2 class="text-2xl font-dancing text-pink-600 mb-4">Galería de Fotos</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="(_, index) in [0, 1, 2]" :key="index" class="relative">
              <div class="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <img
                  :src="getImageUrl(profile![`image_${index + 1}` as keyof ProfileDetail])"
                  :alt="`Imagen ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>
              <input
                :ref="
                  (el) => {
                    if (el) imageInputRefs[index].value = el as HTMLInputElement
                  }
                "
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageUpload($event, `image_${index + 1}` as keyof ProfileUpdate)"
              />
              <button
                type="button"
                @click="triggerImageInput(index)"
                class="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-pink-600 hover:bg-white transition-colors shadow-lg"
              >
                Cambiar
              </button>
            </div>
          </div>
        </div>

        <!-- Enlaces sociales -->
        <div class="bg-white rounded-3xl shadow-sm overflow-hidden p-6">
          <h2 class="text-2xl font-dancing text-pink-600 mb-4">Redes Sociales</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                <span class="flex items-center">
                  <span class="mr-2">💬</span>
                  WhatsApp
                </span>
              </label>
              <input
                v-model="profile!.whatsapp_link"
                type="text"
                class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Ingresa tu número o enlace de WhatsApp (ej: 34612345678)"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                <span class="flex items-center">
                  <span class="mr-2">👥</span>
                  Facebook
                </span>
              </label>
              <input
                v-model="profile!.facebook_link"
                type="url"
                class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="https://facebook.com/tu-perfil"
              />
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-center gap-4">
          <button
            type="button"
            @click="router.back()"
            class="px-6 py-3 border border-pink-200 text-pink-600 rounded-full hover:bg-pink-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            <span v-if="saving">Guardando...</span>
            <span v-else>Guardar Cambios 💝</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Animaciones específicas del perfil */
.animate-bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceIn {
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

/* Mejoras visuales */
img {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
</style>
