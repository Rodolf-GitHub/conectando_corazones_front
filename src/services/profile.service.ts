import axios from 'axios'
import { authService } from './auth.service'
import type { Profile, ProfileDetail, ProfileUpdate } from '@/types/profile.type'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Interceptor para agregar el token en cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

const defaultImage = '/src/assets/images/img1.jpg'

const setDefaultImages = (profile: Profile): Profile => {
  return {
    ...profile,
    cover_image: profile.cover_image || defaultImage,
  }
}

const setDefaultImagesDetail = (profile: ProfileDetail): ProfileDetail => {
  return {
    ...profile,
    cover_image: profile.cover_image || defaultImage,
    image_1: profile.image_1 || defaultImage,
    image_2: profile.image_2 || defaultImage,
    image_3: profile.image_3 || defaultImage,
  }
}

class ProfileService {
  async getAllProfiles(): Promise<Profile[]> {
    try {
      const response = await apiClient.get('/api/profiles')
      return response.data.map((profile: Profile) => setDefaultImages(profile))
    } catch (error) {
      console.error('Error al obtener perfiles:', error)
      return []
    }
  }

  async getProfileById(id: string): Promise<ProfileDetail> {
    const response = await apiClient.get(`/api/profiles/${id}`)
    return setDefaultImagesDetail(response.data)
  }

  async updateProfile(id: string, data: ProfileUpdate): Promise<ProfileDetail> {
    const response = await apiClient.put(`/api/profiles/${id}`, data)
    return setDefaultImagesDetail(response.data)
  }

  async getMyProfile(): Promise<ProfileDetail> {
    const response = await apiClient.get('/api/profiles/me')
    return setDefaultImagesDetail(response.data)
  }

  async updateMyProfile(
    data: ProfileUpdate,
    files?: {
      cover_image?: File
      image_1?: File
      image_2?: File
      image_3?: File
    },
  ): Promise<ProfileDetail> {
    const formData = new FormData()

    // Añadir los campos de texto
    if (data.name) formData.append('name', data.name)
    if (data.description) formData.append('description', data.description)
    if (data.whatsapp_link) formData.append('whatsapp_link', data.whatsapp_link)
    if (data.facebook_link) formData.append('facebook_link', data.facebook_link)

    // Añadir las imágenes si existen
    if (files?.cover_image) formData.append('cover_image', files.cover_image)
    if (files?.image_1) formData.append('image_1', files.image_1)
    if (files?.image_2) formData.append('image_2', files.image_2)
    if (files?.image_3) formData.append('image_3', files.image_3)

    const response = await apiClient.put('/api/profiles/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return setDefaultImagesDetail(response.data)
  }
}

export default new ProfileService()
