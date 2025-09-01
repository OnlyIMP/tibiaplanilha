import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      config_settings: {
        Row: {
          id: string;
          tc_value: number;
          tc_price_reais: number;
          tc_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tc_value: number;
          tc_price_reais: number;
          tc_amount: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tc_value?: number;
          tc_price_reais?: number;
          tc_amount?: number;
          updated_at?: string;
        };
      };
      farm_entries: {
        Row: {
          id: string;
          player_id: string;
          player_name: string;
          loot_gp: number;
          waste_gp: number;
          balance_gp: number;
          tc_value: number;
          tc_quantity: number;
          reais_value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          player_name: string;
          loot_gp: number;
          waste_gp: number;
          balance_gp: number;
          tc_value: number;
          tc_quantity: number;
          reais_value: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          player_name?: string;
          loot_gp?: number;
          waste_gp?: number;
          balance_gp?: number;
          tc_value?: number;
          tc_quantity?: number;
          reais_value?: number;
        };
      };
    };
  };
}