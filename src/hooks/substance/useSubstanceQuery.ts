
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Substance } from '@/types';

export const useSubstanceQuery = (id?: string) => {
  return useQuery({
    queryKey: ['substance', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('substances')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Map from DB schema to our interface
      return {
        id: data.id,
        name: data.name,
        inciName: data.inci_name,
        casNumber: data.cas_number,
        smiles: data.smiles,
        description: data.description,
        regulatoryStatus: data.regulatory_status,
        status: data.status || 'published'
      } as Substance;
    },
    enabled: !!id,
  });
};
