
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import AddSubstanceForm from '@/components/admin/AddSubstanceForm';

const SubstancesManagementPage: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8">Gestion des substances</h1>
          <div className="grid gap-8">
            <AddSubstanceForm />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default SubstancesManagementPage;
