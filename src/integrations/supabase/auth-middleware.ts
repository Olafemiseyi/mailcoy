import { createMiddleware } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

export const requireSupabaseAuth = createMiddleware({ type: 'function' })
  .client(async ({ next }) => {
    let token: string | undefined;
    if (typeof window !== 'undefined') {
      try {
        const { supabase } = await import('./client');
        const sessionRes = await supabase.auth.getSession();
        token = sessionRes.data?.session?.access_token;
      } catch (err) {
        console.warn('[auth-middleware] client session token lookup error:', err);
      }
    }
    return next({
      headers: token ? { authorization: `Bearer ${token}` } : {},
    });
  })
  .server(async ({ next }) => {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      const missing = [
        ...(!SUPABASE_URL ? ['SUPABASE_URL'] : []),
        ...(!SUPABASE_PUBLISHABLE_KEY ? ['SUPABASE_PUBLISHABLE_KEY'] : []),
      ];
      const message = `Missing Supabase environment variable(s): ${missing.join(', ')}.`;
      console.error(`[Supabase] ${message}`);
      throw new Error(message);
    }

    const request = getRequest();
    let token = '';

    const authHeader = request?.headers?.get('authorization') || request?.headers?.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace(/^Bearer\s+/i, '').trim();
    }

    if (!token && request?.headers?.get('cookie')) {
      const cookieHeader = request.headers.get('cookie') || '';
      const matches = cookieHeader.match(/sb-[^=]+-auth-token=([^;]+)/) || cookieHeader.match(/sb-access-token=([^;]+)/);
      if (matches && matches[1]) {
        try {
          const decoded = decodeURIComponent(matches[1]);
          if (decoded.startsWith('base64-')) {
            const parsed = JSON.parse(Buffer.from(decoded.slice(7), 'base64').toString());
            token = parsed.access_token || parsed[0] || '';
          } else if (decoded.startsWith('{') || decoded.startsWith('[')) {
            const parsed = JSON.parse(decoded);
            token = parsed.access_token || parsed[0] || '';
          } else {
            token = decoded;
          }
        } catch {}
      }
    }

    if (!token) {
      throw new Error('Unauthorized: No authorization token provided. Please log in.');
    }

    const supabase = createClient<Database>(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        global: {
          fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        auth: {
          storage: undefined,
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    let userId: string | null = null;
    let claims: any = {};

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      if (!userError && userData?.user?.id) {
        userId = userData.user.id;
        claims = userData.user;
      }
    } catch {}

    if (!userId) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
          if (payload.sub && (!payload.exp || payload.exp * 1000 > Date.now())) {
            userId = payload.sub;
            claims = payload;
          }
        }
      } catch {}
    }

    if (!userId) {
      throw new Error('Unauthorized: Invalid or expired session token. Please log in again.');
    }

    return next({
      context: {
        supabase,
        userId,
        claims,
      },
    });
  });
