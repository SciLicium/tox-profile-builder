
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Skeleton } from "@/components/ui/skeleton";

const profileSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage: React.FC = () => {
  const { user, profile, loading, updateProfile } = useAuth();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: profile?.first_name || "",
      lastName: profile?.last_name || "",
    },
    // Re-initialize form when profile data loads
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  // Update form values when profile data changes
  React.useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfile({
      first_name: data.firstName,
      last_name: data.lastName,
    });
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
    <ProtectedRoute>
      <Layout>
        <div className="container max-w-4xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8">Mon profil</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Informations</CardTitle>
                  <CardDescription>Vos informations de base</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {loading ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Email</span>
                        <Skeleton className="h-4 w-[120px]" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Rôle</span>
                        <Skeleton className="h-6 w-[80px]" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Email</span>
                        <span className="font-medium">{user?.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Rôle</span>
                        <Badge className={getRoleBadgeColor(profile?.role || 'user')}>
                          {profile?.role || 'user'}
                        </Badge>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Modifier le profil</CardTitle>
                  <CardDescription>Mettre à jour vos informations personnelles</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm mb-2">Prénom</p>
                          <Skeleton className="h-9 w-full" />
                        </div>
                        <div>
                          <p className="text-sm mb-2">Nom</p>
                          <Skeleton className="h-9 w-full" />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Skeleton className="h-9 w-[200px]" />
                      </div>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prénom</FormLabel>
                                <FormControl>
                                  <Input placeholder="Prénom" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nom</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nom" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button 
                            type="submit" 
                            className="bg-tox-primary hover:bg-tox-secondary"
                            disabled={form.formState.isSubmitting}
                          >
                            {form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ProfilePage;
