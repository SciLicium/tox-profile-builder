
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface UserWithProfile {
  id: string;
  email: string;
  created_at: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user' | 'toxicologist' | 'reviewer';
}

const roleSchema = z.object({
  role: z.enum(['admin', 'user', 'toxicologist', 'reviewer'])
});

type RoleFormValues = z.infer<typeof roleSchema>;

const UsersManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role: 'user'
    }
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      form.setValue('role', selectedUser.role);
    }
  }, [selectedUser, form]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role');
      
      if (profilesError) throw profilesError;
      
      // Only admins can use admin-level Supabase APIs, so we'll work with the profiles we have
      // In a real implementation, you might want to add an admin-only edge function
      // that can fetch full user details from auth.users
      
      const usersWithProfiles = profiles.map(profile => ({
        id: profile.id,
        email: profile.id, // Using ID as email since we don't have direct access to auth.users
        created_at: new Date().toISOString(), // Placeholder
        first_name: profile.first_name,
        last_name: profile.last_name,
        role: profile.role
      }));
      
      setUsers(usersWithProfiles);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs: " + error.message,
        variant: "destructive",
      });
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const openRoleModal = (user: UserWithProfile) => {
    setSelectedUser(user);
  };

  const closeRoleModal = () => {
    setSelectedUser(null);
  };

  const openDeleteDialog = (user: UserWithProfile) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleUpdateRole = async (data: RoleFormValues) => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: data.role })
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      toast({
        title: "Rôle mis à jour",
        description: `Le rôle de l'utilisateur a été modifié en ${data.role}`,
      });
      
      // Update the user in the local state
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, role: data.role } 
          : user
      ));
      
      closeRoleModal();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      // In a real implementation with full admin access, you would use Supabase Admin API
      // For now, we'll show how it would work but won't actually delete
      toast({
        title: "Fonctionnalité limitée",
        description: "La suppression d'utilisateur nécessite des permissions administrateur avancées",
        variant: "destructive",
      });
      
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
      console.error('Error deleting user:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600';
      case 'toxicologist':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'reviewer':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Gestion des utilisateurs</h1>
          
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Input 
                  placeholder="Rechercher un utilisateur..." 
                  className="max-w-xs"
                />
                <Button className="bg-tox-primary hover:bg-tox-secondary">
                  Rechercher
                </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={() => fetchUsers()}
                disabled={loading}
              >
                {loading ? "Chargement..." : "Actualiser"}
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      {loading ? "Chargement des utilisateurs..." : "Aucun utilisateur trouvé"}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        {user.first_name} {user.last_name}
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openRoleModal(user)}
                          >
                            Changer rôle
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => openDeleteDialog(user)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {selectedUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Modifier le rôle de l'utilisateur</h3>
                <p className="mb-4">
                  {selectedUser.first_name} {selectedUser.last_name} ({selectedUser.email})
                </p>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleUpdateRole)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rôle</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un rôle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="user">Utilisateur</SelectItem>
                              <SelectItem value="toxicologist">Toxicologue</SelectItem>
                              <SelectItem value="reviewer">Réviseur</SelectItem>
                              <SelectItem value="admin">Administrateur</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={closeRoleModal}>
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-tox-primary hover:bg-tox-secondary">
                        Enregistrer
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          )}
          
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Cela supprimera définitivement le compte de l'utilisateur
                  {selectedUser && ` ${selectedUser.first_name} ${selectedUser.last_name}`} et toutes ses données associées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUser} className="bg-red-500 hover:bg-red-600">
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default UsersManagementPage;
