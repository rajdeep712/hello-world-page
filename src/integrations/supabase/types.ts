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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          created_at: string | null
          id: string
          is_default: boolean | null
          label: string
          landmark: string | null
          name: string
          phone: string
          pincode: string
          state: string
          street: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          label: string
          landmark?: string | null
          name: string
          phone: string
          pincode: string
          state: string
          street: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          label?: string
          landmark?: string | null
          name?: string
          phone?: string
          pincode?: string
          state?: string
          street?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          order_id: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          order_id?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          order_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          item_type: string
          product_id: string | null
          quantity: number
          session_id: string
          updated_at: string | null
          user_id: string
          workshop_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_type: string
          product_id?: string | null
          quantity?: number
          session_id: string
          updated_at?: string | null
          user_id: string
          workshop_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_type?: string
          product_id?: string | null
          quantity?: number
          session_id?: string
          updated_at?: string | null
          user_id?: string
          workshop_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_order_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          estimated_delivery_date: string | null
          estimated_price: number | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          preferred_size: string
          reference_images: string[] | null
          shipping_address: string | null
          status: string
          updated_at: string
          usage_description: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          estimated_delivery_date?: string | null
          estimated_price?: number | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          preferred_size?: string
          reference_images?: string[] | null
          shipping_address?: string | null
          status?: string
          updated_at?: string
          usage_description: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          estimated_delivery_date?: string | null
          estimated_price?: number | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          preferred_size?: string
          reference_images?: string[] | null
          shipping_address?: string | null
          status?: string
          updated_at?: string
          usage_description?: string
          user_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          item_name: string
          item_type: string
          order_id: string
          product_id: string | null
          quantity: number
          total_price: number
          unit_price: number
          workshop_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_name: string
          item_type: string
          order_id: string
          product_id?: string | null
          quantity: number
          total_price: number
          unit_price: number
          workshop_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_name?: string
          item_type?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
          workshop_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          gst_number: string | null
          id: string
          order_number: string
          order_status: string | null
          payment_status: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          session_id: string | null
          shipping_address: string | null
          shipping_cost: number | null
          subtotal: number
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          gst_number?: string | null
          id?: string
          order_number: string
          order_status?: string | null
          payment_status?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          session_id?: string | null
          shipping_address?: string | null
          shipping_cost?: number | null
          subtotal: number
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          gst_number?: string | null
          id?: string
          order_number?: string
          order_status?: string | null
          payment_status?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          session_id?: string | null
          shipping_address?: string | null
          shipping_cost?: number | null
          subtotal?: number
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          care_instructions: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          name: string
          price: number
          updated_at: string | null
          weight_kg: number | null
        }
        Insert: {
          care_instructions?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          name: string
          price: number
          updated_at?: string | null
          weight_kg?: number | null
        }
        Update: {
          care_instructions?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workshops: {
        Row: {
          created_at: string | null
          current_participants: number | null
          description: string | null
          duration: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          max_participants: number | null
          price: number
          title: string
          updated_at: string | null
          workshop_date: string | null
          workshop_type: string | null
        }
        Insert: {
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_participants?: number | null
          price: number
          title: string
          updated_at?: string | null
          workshop_date?: string | null
          workshop_type?: string | null
        }
        Update: {
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_participants?: number | null
          price?: number
          title?: string
          updated_at?: string | null
          workshop_date?: string | null
          workshop_type?: string | null
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
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
