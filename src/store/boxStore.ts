import { create } from 'zustand';
import { supabase, type BoxEntry as SupabaseBoxEntry } from '@/lib/supabase';

export interface BoxEntry {
  id: string;
  date: string;
  boxType: 'Regard double' | 'Regard de chasse' | 'Regard normal';
  numberOfBoxes: number;
  totalCost: number;
  unitCost: number;
  unitMargin: number;
  totalMargin: number;
}

interface BoxState {
  entries: BoxEntry[];
  isLoading: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
  addEntry: (entry: Omit<BoxEntry, 'id' | 'unitCost' | 'unitMargin' | 'totalMargin'>) => Promise<void>;
  editEntry: (id: string, entry: Omit<BoxEntry, 'id' | 'unitCost' | 'unitMargin' | 'totalMargin'>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  importEntries: (entries: Omit<BoxEntry, 'id' | 'unitCost' | 'unitMargin' | 'totalMargin'>[]) => Promise<void>;
  getStatsByType: () => {
    [key: string]: {
      totalCost: number;
      totalMargin: number;
      count: number;
    };
  };
}

const COUT_UNITAIRE = 640; // Prix fixe en MAD

const mapToSupabaseEntry = (entry: Omit<BoxEntry, 'id' | 'unitCost' | 'unitMargin' | 'totalMargin'>): Omit<SupabaseBoxEntry, 'id' | 'created_at'> => {
  const unitMargin = COUT_UNITAIRE - (entry.totalCost / entry.numberOfBoxes);
  const totalMargin = (COUT_UNITAIRE * entry.numberOfBoxes) - entry.totalCost;
  
  return {
    date: entry.date,
    box_type: entry.boxType,
    number_of_boxes: entry.numberOfBoxes,
    total_cost: entry.totalCost,
    unit_cost: COUT_UNITAIRE,
    unit_margin: unitMargin,
    total_margin: totalMargin,
  };
};

const mapFromSupabaseEntry = (entry: SupabaseBoxEntry): BoxEntry => ({
  id: entry.id,
  date: entry.date,
  boxType: entry.box_type,
  numberOfBoxes: entry.number_of_boxes,
  totalCost: entry.total_cost,
  unitCost: entry.unit_cost,
  unitMargin: entry.unit_margin,
  totalMargin: entry.total_margin,
});

export const useBoxStore = create<BoxState>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  fetchEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('boxes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedEntries = data.map(mapFromSupabaseEntry);
      set({ entries: mappedEntries, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addEntry: async (newEntry) => {
    set({ isLoading: true, error: null });
    try {
      const supabaseEntry = mapToSupabaseEntry(newEntry);
      const { data, error } = await supabase
        .from('boxes')
        .insert([supabaseEntry])
        .select()
        .single();

      if (error) throw error;

      const mappedEntry = mapFromSupabaseEntry(data);
      set((state) => ({
        entries: [mappedEntry, ...state.entries],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  editEntry: async (id, updatedEntry) => {
    set({ isLoading: true, error: null });
    try {
      const supabaseEntry = mapToSupabaseEntry(updatedEntry);
      const { data, error } = await supabase
        .from('boxes')
        .update(supabaseEntry)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const mappedEntry = mapFromSupabaseEntry(data);
      set((state) => ({
        entries: state.entries.map((entry) =>
          entry.id === id ? mappedEntry : entry
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteEntry: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('boxes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  importEntries: async (newEntries) => {
    set({ isLoading: true, error: null });
    try {
      const supabaseEntries = newEntries.map(mapToSupabaseEntry);
      const { data, error } = await supabase
        .from('boxes')
        .insert(supabaseEntries)
        .select();

      if (error) throw error;

      const mappedEntries = data.map(mapFromSupabaseEntry);
      set((state) => ({
        entries: [...mappedEntries, ...state.entries],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  getStatsByType: () => {
    const { entries } = get();
    return entries.reduce((acc, entry) => {
      if (!acc[entry.boxType]) {
        acc[entry.boxType] = {
          totalCost: 0,
          totalMargin: 0,
          count: 0,
        };
      }
      acc[entry.boxType].totalCost += entry.totalCost;
      acc[entry.boxType].totalMargin += entry.totalMargin;
      acc[entry.boxType].count += entry.numberOfBoxes;
      return acc;
    }, {} as { [key: string]: { totalCost: number; totalMargin: number; count: number } });
  },
})); 