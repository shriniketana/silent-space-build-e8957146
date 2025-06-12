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
      admin_users: {
        Row: {
          created_at: string | null
          email: string
        }
        Insert: {
          created_at?: string | null
          email: string
        }
        Update: {
          created_at?: string | null
          email?: string
        }
        Relationships: []
      }
      candidates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          role_id: string | null
          vote_boost: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          name: string
          role_id?: string | null
          vote_boost?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          role_id?: string | null
          vote_boost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "election_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      election_roles: {
        Row: {
          category: string
          created_at: string | null
          id: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      election_settings: {
        Row: {
          id: number
          results_release_date: string | null
          results_visible: boolean | null
          updated_at: string | null
          voting_open: boolean | null
        }
        Insert: {
          id?: number
          results_release_date?: string | null
          results_visible?: boolean | null
          updated_at?: string | null
          voting_open?: boolean | null
        }
        Update: {
          id?: number
          results_release_date?: string | null
          results_visible?: boolean | null
          updated_at?: string | null
          voting_open?: boolean | null
        }
        Relationships: []
      }
      students: {
        Row: {
          created_at: string | null
          grade: number | null
          house: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          grade?: number | null
          house?: string | null
          id: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          grade?: number | null
          house?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          id: string
          role_id: string | null
          student_id: string | null
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          role_id?: string | null
          student_id?: string | null
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          role_id?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "election_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
