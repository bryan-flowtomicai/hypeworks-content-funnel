export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          company: string | null
          website: string | null
          amazon_store_url: string | null
          plan: 'free' | 'pro' | 'enterprise'
          submission_count: number
          stripe_customer_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          company?: string | null
          website?: string | null
          amazon_store_url?: string | null
          plan?: 'free' | 'pro' | 'enterprise'
          submission_count?: number
          stripe_customer_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          company?: string | null
          website?: string | null
          amazon_store_url?: string | null
          plan?: 'free' | 'pro' | 'enterprise'
          submission_count?: number
          stripe_customer_id?: string | null
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          user_id: string
          product_url: string
          platform: string
          product_data: Json | null
          brand_assets: string[]
          user_inputs: Json | null
          generated_images: string[]
          status: 'pending' | 'processing' | 'completed' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_url: string
          platform: string
          product_data?: Json | null
          brand_assets?: string[]
          user_inputs?: Json | null
          generated_images?: string[]
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_url?: string
          platform?: string
          product_data?: Json | null
          brand_assets?: string[]
          user_inputs?: Json | null
          generated_images?: string[]
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
