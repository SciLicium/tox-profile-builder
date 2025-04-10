
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import EditSubstanceForm from '@/components/admin/EditSubstanceForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Substance } from '@/types';

const EditSubstancePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: substance, isLoading, error } = useQuery({
    queryKey: ['substance', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('substances')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Map DB fields to interface fields
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
    enabled: !!id
  });

  return (
    <ProtectedRoute requiredRole="admin">
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/admin/substances')}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
            <h1 className="text-2xl font-bold">
              {isLoading ? 'Chargement...' : (substance ? `Modifier: ${substance.name}` : 'Substance non trouvée')}
            </h1>
          </div>

          {isLoading ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-red-500">Erreur: {(error as Error).message}</div>
            </div>
          ) : substance ? (
            <EditSubstanceForm 
              substance={substance} 
              onSuccess={() => navigate('/admin/substances')}
            />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center">Substance non trouvée</div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default EditSubstancePage;
