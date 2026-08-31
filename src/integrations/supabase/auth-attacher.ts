// Global client middleware to attach Supabase JWT token to all server function RPCs.
import { createMiddleware } from '@tanstack/react-start'
import { supabase } from './client'

export const attachSupabaseAuth = createMiddleware({ type: 'function' }).client(
  async ({ next }) => {
    let token: string | undefined;
    try {
      const { data } = await supabase.auth.getSession();
      token = data?.session?.access_token;
    } catch (e) {
      console.warn('[attachSupabaseAuth] error retrieving session token:', e);
    }
    return next({
      headers: token ? { Authorization: `Bearer ${token}`, authorization: `Bearer ${token}` } : {},
    });
  },
);
