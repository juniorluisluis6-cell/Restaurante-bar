import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qzczkwpundzwklqisutl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lfMaWv7343Oq4EXzBmcIpA_U7kCs3vE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface SupabaseOrder {
  id: string;
  customer_id: string;
  items: any[];
  total: number;
  status: OrderStatus;
  type: 'delivery' | 'pickup';
  payment_method: 'cash' | 'mpesa';
  payment_phone?: string;
  address?: string;
  created_at: string;
}

export interface SupabaseReservation {
  id: string;
  customer_id: string;
  customer_name: string;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  created_at: string;
}

export interface SupabaseMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  prep_time: number;
  image_url?: string;
}

export interface SupabaseUserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  points: number;
  created_at: string;
}
