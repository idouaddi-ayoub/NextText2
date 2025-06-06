import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
export const createBrowserClient = () => createClientComponentClient();

export type BoxEntry = {
  id: string;
  date: string;
  box_type: 'Regard double' | 'Regard de chasse' | 'Regard normal';
  number_of_boxes: number;
  total_cost: number;
  unit_cost: number;
  unit_margin: number;
  total_margin: number;
  created_at?: string;
}; 