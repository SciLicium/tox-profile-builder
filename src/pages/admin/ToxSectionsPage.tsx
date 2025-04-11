
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useSubstanceQuery } from '@/hooks/substance/useSubstanceQuery';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ToxicologicalSection } from '@/types';
import ToxSectionManager from '@/components/admin/sections/ToxSectionManager';

const ToxSectionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: substance, isLoading: substanceLoading } = useSubstanceQuery(id);
  
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
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/admin/substances')}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
            <h1 className="text-2xl font-bold">Gestion des sections toxicologiques</h1>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <ToxSectionManager 
              substanceId={substance.id}
              substanceName={substance.name}
              initialSections={sections}
            />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ToxSectionsPage;
