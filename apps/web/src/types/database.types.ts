export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          date_of_birth: string;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          date_of_birth: string;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          date_of_birth?: string;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      dentists: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          specialty: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          specialty?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          specialty?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          dentist_id: string;
          start_time: string;
          end_time: string;
          type: string;
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          dentist_id: string;
          start_time: string;
          end_time: string;
          type: string;
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          dentist_id?: string;
          start_time?: string;
          end_time?: string;
          type?: string;
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      dentist_schedules: {
        Row: {
          id: string;
          dentist_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_available: boolean;
        };
        Insert: {
          id?: string;
          dentist_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_available?: boolean;
        };
        Update: {
          id?: string;
          dentist_id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          is_available?: boolean;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
