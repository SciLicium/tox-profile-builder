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
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          date: string
          id: string
          pdf_content: string | null
          substance_id: string
          user_comment: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          pdf_content?: string | null
          substance_id: string
          user_comment?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          pdf_content?: string | null
          substance_id?: string
          user_comment?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_substance_id_fkey"
            columns: ["substance_id"]
            isOneToOne: false
            referencedRelation: "substances"
            referencedColumns: ["id"]
          },
        ]
      }
      scraping_sources: {
        Row: {
          content_type: string
          created_at: string
          created_by: string | null
          id: string
          name: string
          update_frequency: string
          updated_at: string
          updated_by: string | null
          url: string
        }
        Insert: {
          content_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          update_frequency: string
          updated_at?: string
          updated_by?: string | null
          url: string
        }
        Update: {
          content_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          update_frequency?: string
          updated_at?: string
          updated_by?: string | null
          url?: string
        }
        Relationships: []
      }
      search_history: {
        Row: {
          id: string
          search_date: string
          substance_id: string
          user_id: string
        }
        Insert: {
          id?: string
          search_date?: string
          substance_id: string
          user_id: string
        }
        Update: {
          id?: string
          search_date?: string
          substance_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_history_substance_id_fkey"
            columns: ["substance_id"]
            isOneToOne: false
            referencedRelation: "substances"
            referencedColumns: ["id"]
          },
        ]
      }
      substance_section_drafts: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          id: string
          reference_list: string[] | null
          section_type: Database["public"]["Enums"]["tox_section_type"]
          source_urls: string[] | null
          substance_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          reference_list?: string[] | null
          section_type: Database["public"]["Enums"]["tox_section_type"]
          source_urls?: string[] | null
          substance_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          reference_list?: string[] | null
          section_type?: Database["public"]["Enums"]["tox_section_type"]
          source_urls?: string[] | null
          substance_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "substance_section_drafts_substance_id_fkey"
            columns: ["substance_id"]
            isOneToOne: false
            referencedRelation: "substances"
            referencedColumns: ["id"]
          },
        ]
      }
      substances: {
        Row: {
          cas_number: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          inci_name: string | null
          name: string
          regulatory_status: string | null
          smiles: string | null
          status: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          cas_number?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          inci_name?: string | null
          name: string
          regulatory_status?: string | null
          smiles?: string | null
          status?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          cas_number?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          inci_name?: string | null
          name?: string
          regulatory_status?: string | null
          smiles?: string | null
          status?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      toxicological_sections: {
        Row: {
          acquisition_date: string
          content: string | null
          created_at: string
          created_by: string | null
          id: string
          reference_list: string[] | null
          section_type: Database["public"]["Enums"]["tox_section_type"]
          source_urls: string[] | null
          status: Database["public"]["Enums"]["section_status"]
          substance_id: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          acquisition_date?: string
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          reference_list?: string[] | null
          section_type: Database["public"]["Enums"]["tox_section_type"]
          source_urls?: string[] | null
          status?: Database["public"]["Enums"]["section_status"]
          substance_id: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          acquisition_date?: string
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          reference_list?: string[] | null
          section_type?: Database["public"]["Enums"]["tox_section_type"]
          source_urls?: string[] | null
          status?: Database["public"]["Enums"]["section_status"]
          substance_id?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "toxicological_sections_substance_id_fkey"
            columns: ["substance_id"]
            isOneToOne: false
            referencedRelation: "substances"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: { requested_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
    }
    Enums: {
      section_status: "valid" | "incomplete" | "verify" | "pending"
      tox_section_type:
        | "acute_toxicity"
        | "irritation_corrosion"
        | "repeated_dose"
        | "mutagenicity"
        | "carcinogenicity"
        | "reproduction"
        | "human_exposure"
        | "phototoxicity"
        | "metabolism"
        | "other_data"
        | "conclusion"
      user_role: "admin" | "user" | "toxicologist" | "reviewer"
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
    Enums: {
      section_status: ["valid", "incomplete", "verify", "pending"],
      tox_section_type: [
        "acute_toxicity",
        "irritation_corrosion",
        "repeated_dose",
        "mutagenicity",
        "carcinogenicity",
        "reproduction",
        "human_exposure",
        "phototoxicity",
        "metabolism",
        "other_data",
        "conclusion",
      ],
      user_role: ["admin", "user", "toxicologist", "reviewer"],
    },
  },
} as const
