import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Ce middleware est simplifié pour éviter les conflits avec la gestion de session côté client
export async function middleware(request: NextRequest) {
  // Nous laissons la vérification de l'authentification se faire côté client
  // pour éviter les problèmes de synchronisation des cookies entre le middleware et le client
  
  return NextResponse.next();
}

// Spécifier les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  matcher: ['/admin/:path*'],
}; 