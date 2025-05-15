import { createClient } from "@supabase/supabase-js"; 

const SUPABASE_URL = "https://vnyrejkdgxhddfshqwxj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZueXJlamtkZ3hoZGRmc2hxd3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDc5MDEsImV4cCI6MjA2Mjg4MzkwMX0.RLN9lSM2qtVDmmnAihyWYaKCbWiIfUWBHLU6ywT82w8";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase  URL ou chave não estão configuradas corretamente.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);