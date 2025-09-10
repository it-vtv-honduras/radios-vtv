export interface Station {
  id: string
  name: string
  genre: string
  coverImage: string
  streamUrl: string
  description?: string
  isActive?: boolean
  frequency?: string
  location?: string
  website?: string
  social?: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
    whatsapp?: string
  }
  tags?: string[]
  programming?: ProgramSegment[]
  locutores?: string
}

export interface ProgramSegment {
  id: string
  horaInicio: string
  horaFin: string
  segmento: string 
  locutores: string 
}

export interface AdminUser {
  email: string
  password: string
  role: "admin"
}

export interface AudioState {
  currentStation: Station | null
  currentIndex: number
  isPlaying: boolean
  volume: number
  isMuted: boolean
  error: string | null
}

export interface ContactForm {
  name: string
  email: string
  message: string
}
