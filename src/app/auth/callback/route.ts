import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Initialisation du client Supabase côté serveur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Route de callback pour l'authentification Supabase
 * Cette route est appelée après que l'utilisateur a cliqué sur le lien dans l'email
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // Échange le code contre une session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirection vers la page d'admin
  return NextResponse.redirect(new URL('/admin', requestUrl.origin));
} 