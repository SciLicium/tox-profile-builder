
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import AddSubstanceForm from '@/components/admin/AddSubstanceForm';
import SubstancesList from '@/components/admin/SubstancesList';
import EditSubstanceForm from '@/components/admin/EditSubstanceForm';
import { Button } from '@/components/ui/button';
import { Beaker, Plus } from 'lucide-react';

const SubstancesManagementPage: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  return (
    <ProtectedRoute requiredRole="admin">
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Beaker className="h-8 w-8 text-tox-primary" />
              Gestion des substances
            </h1>
            
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              variant={showAddForm ? "outline" : "default"}
            >
              {showAddForm ? (
                "Voir la liste"
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une substance
                </>
              )}
            </Button>
          </div>
          
          <div className="grid gap-8">
            {showAddForm ? (
              <EditSubstanceForm onSuccess={() => setShowAddForm(false)} />
            ) : (
              <SubstancesList />
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default SubstancesManagementPage;
