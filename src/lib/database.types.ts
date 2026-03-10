export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          stripe_customer_id: string | null
          subscription_tier: string
          subscription_status: string
          credits_remaining: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          stripe_customer_id?: string | null
          subscription_tier?: string
          subscription_status?: string
          credits_remaining?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          stripe_customer_id?: string | null
          subscription_tier?: string
          subscription_status?: string
          credits_remaining?: number
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          product_name: string | null
          brand_name: string | null
          description: string | null
          key_features: string[]
          target_audience: string | null
          category: string | null
          content_tone: string
          brand_colors: string[]
          source_urls: string[]
          scraped_data: Json | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          product_name?: string | null
          brand_name?: string | null
          description?: string | null
          key_features?: string[]
          target_audience?: string | null
          category?: string | null
          content_tone?: string
          brand_colors?: string[]
          source_urls?: string[]
          scraped_data?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          product_name?: string | null
          brand_name?: string | null
          description?: string | null
          key_features?: string[]
          target_audience?: string | null
          category?: string | null
          content_tone?: string
          brand_colors?: string[]
          source_urls?: string[]
          scraped_data?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      uploaded_assets: {
        Row: {
          id: string
          project_id: string
          user_id: string
          storage_path: string
          public_url: string | null
          file_name: string | null
          file_size: number | null
          mime_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          storage_path: string
          public_url?: string | null
          file_name?: string | null
          file_size?: number | null
          mime_type?: string | null
          created_at?: string
        }
        Update: {
          public_url?: string | null
          file_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uploaded_assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uploaded_assets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_images: {
        Row: {
          id: string
          project_id: string
          user_id: string
          storage_path: string
          public_url: string | null
          format_type: string
          width: number
          height: number
          prompt_used: string | null
          fal_request_id: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          storage_path: string
          public_url?: string | null
          format_type: string
          width: number
          height: number
          prompt_used?: string | null
          fal_request_id?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          public_url?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_images_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string
          stripe_price_id: string | null
          status: string
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id: string
          stripe_price_id?: string | null
          status: string
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          stripe_price_id?: string | null
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
