
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import SubstanceProfile from '@/components/SubstanceProfile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Substance, ToxicologicalSection } from '@/types';

const ViewSubstancePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: substance, isLoading: substanceLoading } = useQuery({
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

  const { data: sections = [], isLoading: sectionsLoading } = useQuery({
    queryKey: ['toxicologicalSections', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('toxicological_sections')
        .select('*')
        .eq('substance_id', id);
      
      if (error) throw error;
      
      return data.map(section => ({
        id: section.id,
        substanceId: section.substance_id,
        sectionType: section.section_type,
        title: section.title,
        content: section.content || '',
        references: section.reference_list || [],
        sourceUrls: section.source_urls || [],
        acquisitionDate: section.acquisition_date,
        status: section.status
      })) as ToxicologicalSection[];
    },
    enabled: !!id
  });

  const isLoading = substanceLoading || sectionsLoading;

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <Layout>
          <div className="container mx-auto py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tox-primary"></div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!substance) {
    return (
      <ProtectedRoute requiredRole="admin">
        <Layout>
          <div className="container mx-auto py-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center">Substance non trouvée</div>
              <div className="text-center mt-4">
                <Button onClick={() => navigate('/admin/substances')}>
                  Retour à la liste
                </Button>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <Layout>
        <div className="container mx-auto py-8">
          <SubstanceProfile 
            substance={substance} 
            sections={sections} 
            onBack={() => navigate('/admin/substances')} 
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ViewSubstancePage;
