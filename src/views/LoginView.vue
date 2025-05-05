<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import BackButton from '@/components/BackButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref<string | null>(null)
const credentials = ref({
  username_or_email: '',
  password: '',
})

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = null
    await authStore.login(credentials.value)
    router.push('/profile/me')
  } catch (e) {
    error.value = 'Credenciales inválidas'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-50 py-16 px-4">
    <BackButton />

    <div class="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
      <div class="px-8 pt-8 pb-6 bg-gradient-to-r from-red-500 via-pink-500 to-red-500">
        <h1 class="text-3xl font-bold text-white text-center font-dancing">Administración</h1>
      </div>

      <form @submit.prevent="handleLogin" class="p-8">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Usuario o Email </label>
            <input
              v-model="credentials.username_or_email"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Contraseña </label>
            <input
              v-model="credentials.password"
              type="password"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div v-if="error" class="text-red-500 text-sm text-center">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-red-500 via-pink-500 to-red-500 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            <span v-if="loading">Cargando...</span>
            <span v-else>Iniciar Sesión</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Animaciones específicas del login */
.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
