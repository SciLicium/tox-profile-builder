
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const useAuthFunctions = (
  setUser: (user: any) => void,
  setProfile: (profile: UserProfile | null) => void,
  setSession: (session: any) => void,
  fetchProfile: (userId: string) => Promise<void>,
  navigate: (path: string) => void
) => {
  const { toast } = useToast();
  
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur PreFillTox",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
      console.error('Login error:', error);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour activer votre compte",
      });
      
      navigate('/auth/verification');
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
      console.error('Signup error:', error);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      navigate('/');
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
      console.error('Signout error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/update-password',
      });
      
      if (error) throw error;
      
      toast({
        title: "Email envoyé",
        description: "Veuillez consulter votre boîte mail pour réinitialiser votre mot de passe",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
      console.error('Reset password error:', error);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!supabase.auth.getUser()) return;
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      
      console.log("Updating profile with data:", data);
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userData.user.id);
      
      if (error) {
        console.error('Update profile error:', error);
        throw error;
      }
      
      // Refetch profile to ensure we have latest data
      if (userData.user) {
        await fetchProfile(userData.user.id);
      }
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive",
      });
      console.error('Update profile error:', error);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  };
};
