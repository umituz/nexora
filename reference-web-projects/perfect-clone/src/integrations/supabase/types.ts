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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string
          id: string
          key: string
          last_used: string | null
          name: string
          permissions: string[]
          type: Database["public"]["Enums"]["api_key_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          key?: string
          last_used?: string | null
          name: string
          permissions?: string[]
          type?: Database["public"]["Enums"]["api_key_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          last_used?: string | null
          name?: string
          permissions?: string[]
          type?: Database["public"]["Enums"]["api_key_type"]
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          ip_address: string | null
          resource: string
          resource_id: string | null
          user_id: string
          user_name: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          ip_address?: string | null
          resource: string
          resource_id?: string | null
          user_id: string
          user_name?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          ip_address?: string | null
          resource?: string
          resource_id?: string | null
          user_id?: string
          user_name?: string | null
        }
        Relationships: []
      }
      blocked_users: {
        Row: {
          blocked_email: string
          blocked_name: string | null
          created_at: string
          id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          blocked_email: string
          blocked_name?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          user_id: string
        }
        Update: {
          blocked_email?: string
          blocked_name?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          budget: number
          channel: string | null
          conversions: number
          created_at: string
          end_date: string | null
          id: string
          name: string
          roi: number
          spent: number
          start_date: string
          status: Database["public"]["Enums"]["campaign_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: number
          channel?: string | null
          conversions?: number
          created_at?: string
          end_date?: string | null
          id?: string
          name: string
          roi?: number
          spent?: number
          start_date?: string
          status?: Database["public"]["Enums"]["campaign_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number
          channel?: string | null
          conversions?: number
          created_at?: string
          end_date?: string | null
          id?: string
          name?: string
          roi?: number
          spent?: number
          start_date?: string
          status?: Database["public"]["Enums"]["campaign_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chargebacks: {
        Row: {
          amount: number
          created_at: string
          customer_id: string
          due_date: string | null
          filed_date: string
          id: string
          reason: string | null
          status: Database["public"]["Enums"]["chargeback_status"]
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id: string
          due_date?: string | null
          filed_date?: string
          id?: string
          reason?: string | null
          status?: Database["public"]["Enums"]["chargeback_status"]
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string
          due_date?: string | null
          filed_date?: string
          id?: string
          reason?: string | null
          status?: Database["public"]["Enums"]["chargeback_status"]
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chargebacks_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chargebacks_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      checkout_pages: {
        Row: {
          conversion_rate: number
          conversions: number
          created_at: string
          custom_css: string | null
          id: string
          name: string
          slug: string
          status: Database["public"]["Enums"]["checkout_status"]
          template: string | null
          updated_at: string
          user_id: string
          visitors: number
        }
        Insert: {
          conversion_rate?: number
          conversions?: number
          created_at?: string
          custom_css?: string | null
          id?: string
          name: string
          slug: string
          status?: Database["public"]["Enums"]["checkout_status"]
          template?: string | null
          updated_at?: string
          user_id: string
          visitors?: number
        }
        Update: {
          conversion_rate?: number
          conversions?: number
          created_at?: string
          custom_css?: string | null
          id?: string
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["checkout_status"]
          template?: string | null
          updated_at?: string
          user_id?: string
          visitors?: number
        }
        Relationships: []
      }
      customers: {
        Row: {
          avatar_url: string | null
          converted_date: string | null
          country: string | null
          created_at: string
          email: string
          id: string
          last_payment: string | null
          ltv: number
          mrr: number
          name: string
          payment_method: string | null
          plan: string
          segment: string | null
          source: string | null
          status: Database["public"]["Enums"]["customer_status"]
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          converted_date?: string | null
          country?: string | null
          created_at?: string
          email: string
          id?: string
          last_payment?: string | null
          ltv?: number
          mrr?: number
          name: string
          payment_method?: string | null
          plan?: string
          segment?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["customer_status"]
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          converted_date?: string | null
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          last_payment?: string | null
          ltv?: number
          mrr?: number
          name?: string
          payment_method?: string | null
          plan?: string
          segment?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["customer_status"]
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string | null
          id: string
          max_usage: number
          status: Database["public"]["Enums"]["discount_status"]
          type: Database["public"]["Enums"]["discount_type"]
          updated_at: string
          usage_count: number
          user_id: string
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          max_usage?: number
          status?: Database["public"]["Enums"]["discount_status"]
          type?: Database["public"]["Enums"]["discount_type"]
          updated_at?: string
          usage_count?: number
          user_id: string
          value: number
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          max_usage?: number
          status?: Database["public"]["Enums"]["discount_status"]
          type?: Database["public"]["Enums"]["discount_type"]
          updated_at?: string
          usage_count?: number
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string | null
          count: number
          created_at: string
          id: string
          last_triggered: string | null
          metadata: Json | null
          name: string
          user_id: string
        }
        Insert: {
          category?: string | null
          count?: number
          created_at?: string
          id?: string
          last_triggered?: string | null
          metadata?: Json | null
          name: string
          user_id: string
        }
        Update: {
          category?: string | null
          count?: number
          created_at?: string
          id?: string
          last_triggered?: string | null
          metadata?: Json | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      experiment_variants: {
        Row: {
          conversion_rate: number
          conversions: number
          description: string | null
          experiment_id: string
          id: string
          name: string
          visitors: number
        }
        Insert: {
          conversion_rate?: number
          conversions?: number
          description?: string | null
          experiment_id: string
          id?: string
          name: string
          visitors?: number
        }
        Update: {
          conversion_rate?: number
          conversions?: number
          description?: string | null
          experiment_id?: string
          id?: string
          name?: string
          visitors?: number
        }
        Relationships: [
          {
            foreignKeyName: "experiment_variants_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      experiments: {
        Row: {
          confidence: number
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: Database["public"]["Enums"]["experiment_status"]
          traffic_split: number
          type: Database["public"]["Enums"]["experiment_type"]
          updated_at: string
          user_id: string
          winner: string | null
        }
        Insert: {
          confidence?: number
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["experiment_status"]
          traffic_split?: number
          type: Database["public"]["Enums"]["experiment_type"]
          updated_at?: string
          user_id: string
          winner?: string | null
        }
        Update: {
          confidence?: number
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["experiment_status"]
          traffic_split?: number
          type?: Database["public"]["Enums"]["experiment_type"]
          updated_at?: string
          user_id?: string
          winner?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          customer_id: string
          due_date: string
          id: string
          items: Json
          paid_date: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id: string
          due_date: string
          id?: string
          items?: Json
          paid_date?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string
          due_date?: string
          id?: string
          items?: Json
          paid_date?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string
          email_notifications: boolean
          id: string
          slack_notifications: boolean
          updated_at: string
          user_id: string
          weekly_report: boolean
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          slack_notifications?: boolean
          updated_at?: string
          user_id: string
          weekly_report?: boolean
        }
        Update: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          slack_notifications?: boolean
          updated_at?: string
          user_id?: string
          weekly_report?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          currency: string | null
          display_name: string | null
          id: string
          language: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          currency?: string | null
          display_name?: string | null
          id?: string
          language?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          currency?: string | null
          display_name?: string | null
          id?: string
          language?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      segments: {
        Row: {
          created_at: string
          criteria: Json
          customer_count: number
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          criteria?: Json
          customer_count?: number
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          criteria?: Json
          customer_count?: number
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          joined_at: string
          last_active: string
          name: string
          owner_user_id: string
          status: Database["public"]["Enums"]["team_member_status"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          joined_at?: string
          last_active?: string
          name: string
          owner_user_id: string
          status?: Database["public"]["Enums"]["team_member_status"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          joined_at?: string
          last_active?: string
          name?: string
          owner_user_id?: string
          status?: Database["public"]["Enums"]["team_member_status"]
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_id: string
          description: string | null
          id: string
          status: Database["public"]["Enums"]["transaction_status"]
          stripe_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer_id: string
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          stripe_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_id?: string
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          stripe_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      trials: {
        Row: {
          created_at: string
          customer_id: string
          days_remaining: number
          end_date: string
          engagement_score: number
          id: string
          plan: string
          smart_charge_amount: number
          smart_charge_status: Database["public"]["Enums"]["smart_charge_status"]
          source: string | null
          start_date: string
          status: Database["public"]["Enums"]["trial_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          days_remaining?: number
          end_date: string
          engagement_score?: number
          id?: string
          plan: string
          smart_charge_amount?: number
          smart_charge_status?: Database["public"]["Enums"]["smart_charge_status"]
          source?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["trial_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          days_remaining?: number
          end_date?: string
          engagement_score?: number
          id?: string
          plan?: string
          smart_charge_amount?: number
          smart_charge_status?: Database["public"]["Enums"]["smart_charge_status"]
          source?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["trial_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trials_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string
          events: string[]
          failure_count: number
          id: string
          last_triggered: string | null
          secret: string
          status: Database["public"]["Enums"]["webhook_status"]
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          events?: string[]
          failure_count?: number
          id?: string
          last_triggered?: string | null
          secret?: string
          status?: Database["public"]["Enums"]["webhook_status"]
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          events?: string[]
          failure_count?: number
          id?: string
          last_triggered?: string | null
          secret?: string
          status?: Database["public"]["Enums"]["webhook_status"]
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      api_key_type: "live" | "test"
      app_role: "admin" | "member" | "viewer"
      campaign_status: "active" | "paused" | "completed"
      chargeback_status: "open" | "under_review" | "won" | "lost"
      checkout_status: "active" | "draft" | "archived"
      customer_status: "active" | "trial" | "churned" | "blocked" | "cancelled"
      discount_status: "active" | "expired" | "disabled"
      discount_type: "percentage" | "fixed"
      experiment_status: "draft" | "running" | "paused" | "completed"
      experiment_type: "checkout" | "pricing" | "trial_length" | "smart_charge"
      invoice_status: "paid" | "pending" | "overdue" | "cancelled"
      smart_charge_status: "pending" | "captured" | "released" | "failed"
      team_member_status: "active" | "invited" | "disabled"
      transaction_status: "succeeded" | "pending" | "failed" | "refunded"
      transaction_type: "subscription" | "smart_charge" | "refund" | "one_time"
      trial_status: "active" | "converted" | "expired" | "cancelled"
      webhook_status: "active" | "inactive"
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
    Enums: {
      api_key_type: ["live", "test"],
      app_role: ["admin", "member", "viewer"],
      campaign_status: ["active", "paused", "completed"],
      chargeback_status: ["open", "under_review", "won", "lost"],
      checkout_status: ["active", "draft", "archived"],
      customer_status: ["active", "trial", "churned", "blocked", "cancelled"],
      discount_status: ["active", "expired", "disabled"],
      discount_type: ["percentage", "fixed"],
      experiment_status: ["draft", "running", "paused", "completed"],
      experiment_type: ["checkout", "pricing", "trial_length", "smart_charge"],
      invoice_status: ["paid", "pending", "overdue", "cancelled"],
      smart_charge_status: ["pending", "captured", "released", "failed"],
      team_member_status: ["active", "invited", "disabled"],
      transaction_status: ["succeeded", "pending", "failed", "refunded"],
      transaction_type: ["subscription", "smart_charge", "refund", "one_time"],
      trial_status: ["active", "converted", "expired", "cancelled"],
      webhook_status: ["active", "inactive"],
    },
  },
} as const
