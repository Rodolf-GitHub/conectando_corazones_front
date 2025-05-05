export interface Profile {
  id: string
  name: string
  cover_image: string | null
}

export interface ProfileDetail extends Profile {
  image_1: string | null
  image_2: string | null
  image_3: string | null
  description: string | null
  whatsapp_link: string | null
  facebook_link: string | null
  created_at: string
  updated_at: string | null
  user_id: string
}

export interface ProfileUpdate {
  name?: string
  cover_image?: string | null
  image_1?: string | null
  image_2?: string | null
  image_3?: string | null
  description?: string | null
  whatsapp_link?: string | null
  facebook_link?: string | null
}
