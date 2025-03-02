'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("Session existante détectée, redirection vers /admin");
        window.location.href = '/admin';
      }
    };
    
    checkSession();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'login') {
        // Connexion
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        console.log("Connexion réussie, redirection vers /admin");
        // Redirection directe vers la page admin
        window.location.href = '/admin';
      } else {
        // Inscription
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        setMessage({
          text: 'Vérifiez votre email pour confirmer votre inscription.',
          type: 'success',
        });
      }
    } catch (error: any) {
      setMessage({
        text: error.message || 'Une erreur est survenue',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-900 to-primary-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Connexion à votre espace' : 'Créer un compte'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'login' ? 'Accédez à votre espace administrateur' : 'Inscrivez-vous pour accéder à l\'espace administrateur'}
          </p>
        </div>

        {message && (
          <div className={`bg-${message.type}-50 border-l-4 border-${message.type}-400 p-4 mb-4`}>
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-${message.type}-700">{message.text}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
              />
            </div>
          </div>

          {mode === 'login' && (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/auth/reset-password" className="font-medium text-primary-600 hover:text-primary-500">
                  Mot de passe oublié?
                </Link>
              </div>
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'S\'inscrire'}
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            {mode === 'login' ? 'Créer un nouveau compte' : 'Déjà un compte? Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
} 