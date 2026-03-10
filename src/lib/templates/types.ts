import type { ImageFormatType } from '@/types'

export interface TemplateData {
  format: ImageFormatType
  productName: string
  brandName?: string
  keyFeatures: string[]
  description?: string
  targetAudience?: string
  contentTone?: string
  brandColors: string[]
  backgroundImageUrl?: string | null
}
