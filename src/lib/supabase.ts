import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// These will be replaced with environment variables from Supabase
const supabaseUrl = 'https://kryfmcmnehhgivwfdzau.supabase.co' || '';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeWZtY21uZWhoZ2l2d2ZkemF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MzY2OTUsImV4cCI6MjA2MzAxMjY5NX0.S7HS8Unxf0J4qM9kLVrIeuS5GqzTT5in8ZHKDayiXs0' || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);