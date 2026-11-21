/** Supabase is only used as a database, reached from the server with the service-role key. */
export const supabaseConfigured = () => !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
export const devMode = () => !supabaseConfigured() && process.env.NODE_ENV !== "production";
/** Single-user access code. Required in production; optional in local dev. */
export const passcodeRequired = () => !!process.env.APP_PASSCODE;
export const aiConfigured = () => !!process.env.OPENAI_API_KEY;
export const SINGLE_USER_ID = "00000000-0000-4000-8000-000000000001";
