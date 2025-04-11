
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/components/ui/use-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import AddSubstanceForm from '@/components/admin/AddSubstanceForm';
import SubstancesList from '@/components/admin/SubstancesList';
import { Button } from '@/components/ui/button';
import { Beaker, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SubstancesManagementPage: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  // Debug auth state
  useEffect(() => {
    console.log("Current user:", user?.id);
    console.log("User profile:", profile);
  }, [user, profile]);
  
  const toggleForm = () => {
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour gérer les substances.",
        variant: "destructive",
      });
      return;
    }
    
    setShowAddForm(!showAddForm);
  };
  
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
              onClick={toggleForm}
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
              <AddSubstanceForm />
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
