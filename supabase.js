// supabase.js
import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://your-supabase-url.supabase.co";
// const supabaseKey = "your-anon-key";

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: { persistSession: false },
  }
);
