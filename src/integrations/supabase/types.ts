export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      client_logos: {
        Row: {
          created_at: string
          id: string
          link: string | null
          logo_url: string
          name: string
          sort_order: number
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          logo_url: string
          name: string
          sort_order?: number
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          logo_url?: string
          name?: string
          sort_order?: number
          status?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          business_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          project_details: string | null
          status: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          project_details?: string | null
          status?: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          project_details?: string | null
          status?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          created_at: string
          currency: string
          dashboard_enabled: boolean
          dashboard_notes: Json
          dashboard_pages: Json
          dashboard_title: string | null
          description: string | null
          id: string
          installments: Json
          launch_at: string | null
          logo_url: string | null
          payment_locked: boolean
          slug: string
          status: string
          title: string
          total_amount: number
          updated_at: string
          upi_id: string | null
          upi_name: string | null
          whatsapp_number: string
        }
        Insert: {
          created_at?: string
          currency?: string
          dashboard_enabled?: boolean
          dashboard_notes?: Json
          dashboard_pages?: Json
          dashboard_title?: string | null
          description?: string | null
          id?: string
          installments?: Json
          launch_at?: string | null
          logo_url?: string | null
          payment_locked?: boolean
          slug: string
          status?: string
          title: string
          total_amount?: number
          updated_at?: string
          upi_id?: string | null
          upi_name?: string | null
          whatsapp_number?: string
        }
        Update: {
          created_at?: string
          currency?: string
          dashboard_enabled?: boolean
          dashboard_notes?: Json
          dashboard_pages?: Json
          dashboard_title?: string | null
          description?: string | null
          id?: string
          installments?: Json
          launch_at?: string | null
          logo_url?: string | null
          payment_locked?: boolean
          slug?: string
          status?: string
          title?: string
          total_amount?: number
          updated_at?: string
          upi_id?: string | null
          upi_name?: string | null
          whatsapp_number?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          challenge: string | null
          created_at: string
          id: string
          live_link: string | null
          result: string | null
          slug: string
          solution: string | null
          sort_order: number
          status: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          challenge?: string | null
          created_at?: string
          id?: string
          live_link?: string | null
          result?: string | null
          slug: string
          solution?: string | null
          sort_order?: number
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          challenge?: string | null
          created_at?: string
          id?: string
          live_link?: string | null
          result?: string | null
          slug?: string
          solution?: string | null
          sort_order?: number
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          admin_notes: string | null
          budget: string | null
          business_name: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          industry: string | null
          project_value: number
          referrer_code: string | null
          referrer_id: string | null
          requirements: string | null
          reward_amount: number
          services: string[]
          status: string
          updated_at: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          admin_notes?: string | null
          budget?: string | null
          business_name?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          industry?: string | null
          project_value?: number
          referrer_code?: string | null
          referrer_id?: string | null
          requirements?: string | null
          reward_amount?: number
          services?: string[]
          status?: string
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          admin_notes?: string | null
          budget?: string | null
          business_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          industry?: string | null
          project_value?: number
          referrer_code?: string | null
          referrer_id?: string | null
          requirements?: string | null
          reward_amount?: number
          services?: string[]
          status?: string
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "referrers"
            referencedColumns: ["id"]
          },
        ]
      }
      referrers: {
        Row: {
          code: string
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          pricing: string | null
          sort_order: number
          status: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          pricing?: string | null
          sort_order?: number
          status?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          pricing?: string | null
          sort_order?: number
          status?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          agenda: string | null
          client_acknowledged: boolean
          created_at: string
          duration_minutes: number
          id: string
          meet_link: string | null
          participants: Json
          payment_id: string
          related_section: string | null
          scheduled_at: string
          sort_order: number
          status: string
          summary: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          agenda?: string | null
          client_acknowledged?: boolean
          created_at?: string
          duration_minutes?: number
          id?: string
          meet_link?: string | null
          participants?: Json
          payment_id: string
          related_section?: string | null
          scheduled_at: string
          sort_order?: number
          status?: string
          summary?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          agenda?: string | null
          client_acknowledged?: boolean
          created_at?: string
          duration_minutes?: number
          id?: string
          meet_link?: string | null
          participants?: Json
          payment_id?: string
          related_section?: string | null
          scheduled_at?: string
          sort_order?: number
          status?: string
          summary?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          business: string | null
          created_at: string
          id: string
          name: string
          quote: string
          rating: number | null
          sort_order: number
          status: string
        }
        Insert: {
          avatar_url?: string | null
          business?: string | null
          created_at?: string
          id?: string
          name: string
          quote: string
          rating?: number | null
          sort_order?: number
          status?: string
        }
        Update: {
          avatar_url?: string | null
          business?: string | null
          created_at?: string
          id?: string
          name?: string
          quote?: string
          rating?: number | null
          sort_order?: number
          status?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
