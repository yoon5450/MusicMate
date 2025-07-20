export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      channels: {
        Row: {
          created_at: string
          description: string | null
          genre_code: number | null
          id: string
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          genre_code?: number | null
          id?: string
          name?: string
          owner_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          genre_code?: number | null
          id?: string
          name?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channels_genre_code_fkey"
            columns: ["genre_code"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["code"]
          },
        ]
      }
      feed_replies: {
        Row: {
          content: string
          created_at: string
          feed_id: string
          id: string
        }
        Insert: {
          content: string
          created_at?: string
          feed_id: string
          id?: string
        }
        Update: {
          content?: string
          created_at?: string
          feed_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_replies_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "feeds"
            referencedColumns: ["id"]
          },
        ]
      }
      feeds: {
        Row: {
          audio_url: string | null
          author_id: string
          channel_id: string
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          message_type: Database["public"]["Enums"]["message_type"]
          title: string | null
        }
        Insert: {
          audio_url?: string | null
          author_id?: string
          channel_id: string
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          message_type?: Database["public"]["Enums"]["message_type"]
          title?: string | null
        }
        Update: {
          audio_url?: string | null
          author_id?: string
          channel_id?: string
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          message_type?: Database["public"]["Enums"]["message_type"]
          title?: string | null
        }
        Relationships: []
      }
      genres: {
        Row: {
          code: number
          created_at: string
          name: string
        }
        Insert: {
          code?: number
          created_at?: string
          name: string
        }
        Update: {
          code?: number
          created_at?: string
          name?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          feed_id: string
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          feed_id: string
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          feed_id?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "feeds"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          feed_id: string | null
          id: string
          is_read: boolean
          reply_id: string | null
          sender_id: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feed_id?: string | null
          id?: string
          is_read?: boolean
          reply_id?: string | null
          sender_id: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          feed_id?: string | null
          id?: string
          is_read?: boolean
          reply_id?: string | null
          sender_id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_channels: {
        Row: {
          channel_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          user_id?: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_channels_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_genres: {
        Row: {
          genre_code: number
          user_id: string
        }
        Insert: {
          genre_code: number
          user_id?: string
        }
        Update: {
          genre_code?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_genres_genre_code_fkey"
            columns: ["genre_code"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["code"]
          },
        ]
      }
      user_profile: {
        Row: {
          created_at: string
          description: string | null
          id: string
          profile_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          profile_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          profile_url?: string | null
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
      message_type: "default" | "clip" | "image"
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
      message_type: ["default", "clip", "image"],
    },
  },
} as const
