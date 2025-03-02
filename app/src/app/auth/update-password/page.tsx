'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        router.push('/auth');
      }
    };
    
    checkUser();
  }, [router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({
        text: 'Les mots de passe ne correspondent pas',
        type: 'error',
      });
      return;
    }
    
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      
      setMessage({
        text: 'Votre mot de passe a été mis à jour avec succès',
        type: 'success',
      });
      
      // Rediriger vers la page d'admin après 2 secondes
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (err: any) {
      setMessage({
        text: err.message || 'Une erreur est survenue',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-900 to-primary-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Chargement...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-900 to-primary-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Mettre à jour votre mot de passe
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Créez un nouveau mot de passe sécurisé
          </p>
        </div>

        {message && (
          <div className={`${
            message.type === 'success' ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
          } border-l-4 p-4 mb-4`}>
            <div className="flex">
              <div className="ml-3">
                <p className={`text-sm ${
                  message.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {message.text}
                </p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleUpdatePassword}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Nouveau mot de passe"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Confirmer le mot de passe"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link href="/auth" className="font-medium text-primary-600 hover:text-primary-500">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
} 