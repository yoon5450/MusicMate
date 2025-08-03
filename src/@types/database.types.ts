export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      channels: {
        Row: {
          created_at: string;
          description: string | null;
          genre_code: number | null;
          id: string;
          name: string;
          owner_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          genre_code?: number | null;
          id?: string;
          name?: string;
          owner_id?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          genre_code?: number | null;
          id?: string;
          name?: string;
          owner_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "channels_genre_code_fkey";
            columns: ["genre_code"];
            isOneToOne: false;
            referencedRelation: "genres";
            referencedColumns: ["code"];
          },
          {
            foreignKeyName: "channels_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
        ];
      };
      feed_replies: {
        Row: {
          author_id: string | null;
          content: string;
          created_at: string;
          feed_id: string;
          id: string;
        };
        Insert: {
          author_id?: string | null;
          content: string;
          created_at?: string;
          feed_id: string;
          id?: string;
        };
        Update: {
          author_id?: string | null;
          content?: string;
          created_at?: string;
          feed_id?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "feed_replies_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
          {
            foreignKeyName: "feed_replies_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "feeds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feed_replies_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["feed_id"];
          },
          {
            foreignKeyName: "feed_replies_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_user_and_likes";
            referencedColumns: ["feed_id"];
          },
          {
            foreignKeyName: "feed_replies_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "view_feed_search";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feed_replies_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "view_feed_with_user";
            referencedColumns: ["id"];
          },
        ];
      };
      feeds: {
        Row: {
          audio_url: string | null;
          author_id: string;
          channel_id: string;
          content: string | null;
          created_at: string;
          id: string;
          image_url: string | null;
          message_type: Database["public"]["Enums"]["message_type"];
          title: string | null;
        };
        Insert: {
          audio_url?: string | null;
          author_id?: string;
          channel_id: string;
          content?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          message_type?: Database["public"]["Enums"]["message_type"];
          title?: string | null;
        };
        Update: {
          audio_url?: string | null;
          author_id?: string;
          channel_id?: string;
          content?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          message_type?: Database["public"]["Enums"]["message_type"];
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "feeds_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
          {
            foreignKeyName: "feeds_channel_id_fkey";
            columns: ["channel_id"];
            isOneToOne: false;
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
        ];
      };
      genres: {
        Row: {
          code: number;
          created_at: string;
          name: string;
        };
        Insert: {
          code?: number;
          created_at?: string;
          name: string;
        };
        Update: {
          code?: number;
          created_at?: string;
          name?: string;
        };
        Relationships: [];
      };
      likes: {
        Row: {
          created_at: string;
          feed_id: string;
          id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          feed_id: string;
          id?: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          feed_id?: string;
          id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "likes_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "feeds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "likes_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["feed_id"];
          },
          {
            foreignKeyName: "likes_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_user_and_likes";
            referencedColumns: ["feed_id"];
          },
          {
            foreignKeyName: "likes_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "view_feed_search";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "likes_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "view_feed_with_user";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string;
          feed_id: string | null;
          id: string;
          is_read: boolean;
          reply_id: string | null;
          sender_id: string;
          type: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          feed_id?: string | null;
          id?: string;
          is_read?: boolean;
          reply_id?: string | null;
          sender_id: string;
          type: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          feed_id?: string | null;
          id?: string;
          is_read?: boolean;
          reply_id?: string | null;
          sender_id?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "feeds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["feed_id"];
          },
          {
            foreignKeyName: "notifications_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_user_and_likes";
            referencedColumns: ["feed_id"];
          },
          {
            foreignKeyName: "notifications_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "view_feed_search";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "view_feed_with_user";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
        ];
      };
      playlists: {
        Row: {
          created_at: string;
          genre_code: number | null;
          id: string;
          title: string;
          youtube_id: string;
        };
        Insert: {
          created_at?: string;
          genre_code?: number | null;
          id?: string;
          title: string;
          youtube_id: string;
        };
        Update: {
          created_at?: string;
          genre_code?: number | null;
          id?: string;
          title?: string;
          youtube_id?: string;
        };
        Relationships: [];
      };
      user_channels: {
        Row: {
          channel_id: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          channel_id: string;
          created_at?: string;
          user_id?: string;
        };
        Update: {
          channel_id?: string;
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_channels_channel_id_fkey";
            columns: ["channel_id"];
            isOneToOne: false;
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_channels_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
        ];
      };
      user_genres: {
        Row: {
          genre_code: number;
          user_id: string;
        };
        Insert: {
          genre_code: number;
          user_id?: string;
        };
        Update: {
          genre_code?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_genres_genre_code_fkey";
            columns: ["genre_code"];
            isOneToOne: false;
            referencedRelation: "genres";
            referencedColumns: ["code"];
          },
          {
            foreignKeyName: "user_genres_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
        ];
      };
      user_profile: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          nickname: string;
          profile_url: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id: string;
          nickname?: string;
          profile_url?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          nickname?: string;
          profile_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_profile_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
        ];
      };
    };
    Views: {
      get_feeds_with_all: {
        Row: {
          audio_url: string | null;
          author_id: string | null;
          author_nickname: string | null;
          author_profile_url: string | null;
          channel_id: string | null;
          content: string | null;
          created_at: string | null;
          feed_id: string | null;
          image_url: string | null;
          like_count: number | null;
          message_type: Database["public"]["Enums"]["message_type"] | null;
          title: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "feeds_channel_id_fkey";
            columns: ["channel_id"];
            isOneToOne: false;
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
        ];
      };
      get_feeds_with_user_and_likes: {
        Row: {
          audio_url: string | null;
          author_id: string | null;
          author_nickname: string | null;
          author_profile_url: string | null;
          channel_id: string | null;
          content: string | null;
          created_at: string | null;
          feed_id: string | null;
          image_url: string | null;
          like_count: number | null;
          message_type: Database["public"]["Enums"]["message_type"] | null;
          title: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "feeds_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
          {
            foreignKeyName: "feeds_channel_id_fkey";
            columns: ["channel_id"];
            isOneToOne: false;
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
        ];
      };
      get_replies_with_user: {
        Row: {
          author_id: string | null;
          content: string | null;
          created_at: string | null;
          description: string | null;
          feed_id: string | null;
          feed_reply_id: string | null;
          nickname: string | null;
          profile_url: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "feed_replies_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
          {
            foreignKeyName: "feed_replies_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "feeds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feed_replies_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["feed_id"];
          },
          {
            foreignKeyName: "feed_replies_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_user_and_likes";
            referencedColumns: ["feed_id"];
          },
          {
            foreignKeyName: "feed_replies_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "view_feed_search";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feed_replies_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "view_feed_with_user";
            referencedColumns: ["id"];
          },
        ];
      };
      user_genre_details: {
        Row: {
          genre_code: number | null;
          genre_name: string | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_genres_genre_code_fkey";
            columns: ["genre_code"];
            isOneToOne: false;
            referencedRelation: "genres";
            referencedColumns: ["code"];
          },
          {
            foreignKeyName: "user_genres_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
        ];
      };
      view_channel_user_profiles: {
        Row: {
          channel_id: string | null;
          created_at: string | null;
          description: string | null;
          id: string | null;
          nickname: string | null;
          profile_url: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_channels_channel_id_fkey";
            columns: ["channel_id"];
            isOneToOne: false;
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_profile_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
        ];
      };
      view_feed_search: {
        Row: {
          audio_url: string | null;
          author_id: string | null;
          channel_id: string | null;
          content: string | null;
          created_at: string | null;
          id: string | null;
          image_url: string | null;
          like_count: number | null;
          message_type: Database["public"]["Enums"]["message_type"] | null;
          nickname: string | null;
          profile_url: string | null;
          title: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "feeds_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
          {
            foreignKeyName: "feeds_channel_id_fkey";
            columns: ["channel_id"];
            isOneToOne: false;
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
        ];
      };
      view_feed_with_user: {
        Row: {
          audio_url: string | null;
          author_id: string | null;
          channel_id: string | null;
          content: string | null;
          created_at: string | null;
          id: string | null;
          image_url: string | null;
          message_type: Database["public"]["Enums"]["message_type"] | null;
          nickname: string | null;
          profile_url: string | null;
          title: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "feeds_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
          {
            foreignKeyName: "feeds_channel_id_fkey";
            columns: ["channel_id"];
            isOneToOne: false;
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
        ];
      };
      view_notification_detail: {
        Row: {
          created_at: string | null;
          feed_id: string | null;
          id: string | null;
          is_read: boolean | null;
          reply_id: string | null;
          sender_id: string | null;
          sender_nickname: string | null;
          sender_profile_url: string | null;
          type: string | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "feeds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["feed_id"];
          },
          {
            foreignKeyName: "notifications_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_user_and_likes";
            referencedColumns: ["feed_id"];
          },
          {
            foreignKeyName: "notifications_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "view_feed_search";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_feed_id_fkey";
            columns: ["feed_id"];
            isOneToOne: false;
            referencedRelation: "view_feed_with_user";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
        ];
      };
      view_user_channels: {
        Row: {
          channel_created_at: string | null;
          channel_description: string | null;
          channel_id: string | null;
          channel_name: string | null;
          owner_id: string | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "channels_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
          {
            foreignKeyName: "user_channels_channel_id_fkey";
            columns: ["channel_id"];
            isOneToOne: false;
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_channels_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
        ];
      };
      view_user_genres: {
        Row: {
          genre_code: number | null;
          genre_created_at: string | null;
          genre_name: string | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_genres_genre_code_fkey";
            columns: ["genre_code"];
            isOneToOne: false;
            referencedRelation: "genres";
            referencedColumns: ["code"];
          },
          {
            foreignKeyName: "user_genres_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "get_feeds_with_all";
            referencedColumns: ["author_id"];
          },
        ];
      };
    };
    Functions: {
      create_channel_and_link_user: {
        Args: { name: string; description?: string; genre_code?: number };
        Returns: string;
      };
      delete_feed: {
        Args: { p_feed_id: string };
        Returns: {
          data: Json;
          error: string;
        }[];
      };
      get_feeds_near_view: {
        Args: { target_feed_id: string; offset_count?: number };
        Returns: {
          audio_url: string | null;
          author_id: string | null;
          author_nickname: string | null;
          author_profile_url: string | null;
          channel_id: string | null;
          content: string | null;
          created_at: string | null;
          feed_id: string | null;
          image_url: string | null;
          like_count: number | null;
          message_type: Database["public"]["Enums"]["message_type"] | null;
          title: string | null;
        }[];
      };
      update_user_genres: {
        Args: { user_id: string; selected_genres: number[] };
        Returns: {
          data: boolean;
          error: string;
        }[];
      };
    };
    Enums: {
      message_type: "default" | "clip" | "image";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      message_type: ["default", "clip", "image"],
    },
  },
} as const;
