
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Substance } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, FileEdit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SubstancesList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: substances, isLoading, error } = useQuery({
    queryKey: ['substances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('substances')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Substance[];
    }
  });

  const deleteSubstanceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('substances')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['substances'] });
      toast({
        title: "Substance supprimée",
        description: "La substance a été supprimée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Échec de la suppression: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette substance ?")) {
      deleteSubstanceMutation.mutate(id);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/substances/edit/${id}`);
  };

  const handleViewProfile = (id: string) => {
    navigate(`/admin/substances/view/${id}`);
  };

  const handleEditSections = (id: string) => {
    navigate(`/admin/substances/sections/${id}`);
  };

  if (isLoading) return <div className="py-8 text-center">Chargement des substances...</div>;
  if (error) return <div className="py-8 text-center text-red-500">Erreur: {(error as Error).message}</div>;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Liste des substances</h2>
      
      {substances && substances.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Nom INCI</TableHead>
                <TableHead>Numéro CAS</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {substances.map((substance) => (
                <TableRow key={substance.id}>
                  <TableCell className="font-medium">{substance.name}</TableCell>
                  <TableCell>{substance.inciName || '-'}</TableCell>
                  <TableCell>{substance.casNumber || '-'}</TableCell>
                  <TableCell>
                    {substance.status === 'draft' ? (
                      <Badge variant="outline" className="bg-amber-50 text-amber-600">Brouillon</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-600">Publié</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewProfile(substance.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Voir
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(substance.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditSections(substance.id)}
                    >
                      <FileEdit className="h-4 w-4 mr-1" /> Sections
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(substance.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Aucune substance trouvée.
        </div>
      )}
    </div>
  );
};

export default SubstancesList;
