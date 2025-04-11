
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const fetchProfileById = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log("Fetching profile for user:", userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
    
    if (!data) {
      console.log("No profile found for user:", userId);
      return null;
    }
    
    console.log("Profile data received:", data);
    return {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role
    } as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};
