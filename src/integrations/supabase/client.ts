// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://danucjejmszxcodnpucs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbnVjamVqbXN6eGNvZG5wdWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMDk5NTIsImV4cCI6MjA1OTc4NTk1Mn0.RUdjsT3wzIbDjAhX0G9mwxqzxz931nIkUQGdonLRy44";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);