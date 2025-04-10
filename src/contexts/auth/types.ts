
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'user' | 'toxicologist' | 'reviewer';
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}
