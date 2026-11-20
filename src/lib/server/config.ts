export const supabaseConfigured = () => !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY);
export const devMode = () => !supabaseConfigured() && process.env.NODE_ENV !== "production";
export const aiConfigured = () => !!process.env.OPENAI_API_KEY;
