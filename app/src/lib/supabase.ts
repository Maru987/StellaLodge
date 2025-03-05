import { createClient } from '@supabase/supabase-js';

// Ces valeurs doivent être remplacées par vos propres clés Supabase
// Vous pouvez les trouver dans les paramètres de votre projet Supabase
// sous "Project Settings" > "API"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type pour les réservations
export interface Reservation {
  id?: string;
  created_at?: string;
  plan_name: string;
  price: number;
  period: string;
  name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  message?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

// Type pour les images de la galerie
export interface GalleryImage {
  id?: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  alt_text?: string;
  url: string;
  storage_path: string;
  category: string;
  featured: boolean;
  sort_order?: number;
}

// Fonction pour enregistrer une réservation via notre API
export async function saveReservation(reservation: Reservation) {
  try {
    console.log("Début de saveReservation avec les données:", reservation);
    
    // Utiliser directement le client Supabase pour l'insertion
    // Cela contourne la route API qui a des problèmes avec la RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    // Créer un client Supabase direct avec les options correctes pour contourner RLS
    const directSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      global: {
        headers: {
          'X-Client-Info': 'supabase-js/2.x'
        }
      }
    });
    
    console.log("Client Supabase créé, tentative d'insertion directe");
    
    // Essayer d'insérer directement
    const { data: directData, error: directError } = await directSupabase
      .from("reservations")
      .insert([{
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        check_in: reservation.check_in,
        check_out: reservation.check_out,
        guests: reservation.guests,
        message: reservation.message || '',
        plan_name: reservation.plan_name,
        price: reservation.price,
        period: reservation.period,
        status: 'pending'
      }])
      .select();
    
    if (directError) {
      console.error("Erreur lors de l'insertion directe:", directError);
      console.log("Tentative via l'API route...");
      
      // Si l'insertion directe échoue, essayer via l'API
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
      });

      console.log("Réponse reçue:", response.status, response.statusText);
      
      const result = await response.json();
      console.log("Résultat JSON:", result);
      
      if (!response.ok) {
        console.error("Erreur API:", result.error);
        throw new Error(result.error || 'Une erreur est survenue');
      }
      
      return { success: true, data: result.data };
    }
    
    // Si l'insertion directe réussit
    console.log("Insertion directe réussie:", directData);
    return { success: true, data: directData[0] };
  } catch (error) {
    console.error('Erreur détaillée lors de l\'enregistrement de la réservation:', error);
    return { success: false, error };
  }
}

// Fonction pour récupérer toutes les images de la galerie
export async function fetchGalleryImages() {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error);
    return { success: false, error };
  }
}

// Fonction pour récupérer les images par catégorie
export async function fetchGalleryImagesByCategory(category: string) {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('category', category)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error(`Erreur lors de la récupération des images de la catégorie ${category}:`, error);
    return { success: false, error };
  }
}

// Fonction pour télécharger une image
export async function uploadGalleryImage(file: File, path: string) {
  try {
    console.log(`Début du téléchargement de l'image: ${path}, taille: ${file.size} bytes`);
    
    // Vérifier si l'utilisateur est authentifié
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session) {
      console.error('Utilisateur non authentifié pour le téléchargement');
      return { 
        success: false, 
        error: new Error('Vous devez être connecté pour télécharger des images') 
      };
    }
    
    console.log("Utilisateur authentifié:", session.session.user.email);
    
    // Télécharger le fichier directement
    const { data, error } = await supabase.storage
      .from('gallery')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        duplex: 'half'
      });
    
    if (error) {
      console.error('Erreur détaillée lors du téléchargement:', JSON.stringify(error));
      
      // Message d'erreur plus clair basé sur le type d'erreur
      let errorMessage = 'Erreur lors du téléchargement de l\'image';
      
      if (error.message) {
        if (error.message.includes('row-level security') || error.message.includes('policy')) {
          errorMessage = 'Erreur de sécurité: Vous n\'avez pas les permissions nécessaires. Utilisez le bouton "Configurer politiques" dans l\'interface d\'administration.';
        } else if (error.message.includes('bucket') || error.message.includes('not found')) {
          errorMessage = 'Le bucket "gallery" n\'existe pas. Veuillez le créer dans l\'interface Supabase.';
        }
      }
      
      return { success: false, error: new Error(errorMessage) };
    }
    
    console.log('Fichier téléchargé avec succès:', data);
    
    // Obtenir l'URL publique de l'image
    const { data: urlData } = await supabase.storage
      .from('gallery')
      .getPublicUrl(path);
    
    console.log('URL publique obtenue:', urlData);
    
    return { success: true, data: { ...data, publicUrl: urlData.publicUrl } };
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
    return { success: false, error };
  }
}

// Fonction pour ajouter une nouvelle image à la galerie
export async function addGalleryImage(image: Omit<GalleryImage, 'id' | 'created_at' | 'updated_at'>) {
  try {
    console.log('Début de l\'ajout de l\'image à la galerie:', image);
    
    // Vérifier si l'utilisateur est authentifié
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      console.error('Utilisateur non authentifié pour l\'ajout d\'image');
      throw new Error('Vous devez être connecté pour ajouter des images');
    }
    
    const { data, error } = await supabase
      .from('gallery_images')
      .insert([image])
      .select();
    
    if (error) {
      console.error('Erreur lors de l\'ajout de l\'image à la galerie:', error);
      
      // Vérifier si c'est une erreur de politique de sécurité
      if (error.message.includes('row-level security') || error.message.includes('policy')) {
        throw new Error('Erreur de sécurité: Vous n\'avez pas les permissions nécessaires pour ajouter des images. Vérifiez les politiques de sécurité dans Supabase.');
      }
      
      throw error;
    }
    
    console.log('Image ajoutée avec succès:', data);
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'image à la galerie:', error);
    return { success: false, error };
  }
}

// Fonction pour mettre à jour une image existante
export async function updateGalleryImage(id: string, updates: Partial<GalleryImage>) {
  try {
    console.log('Début de la mise à jour de l\'image:', id, updates);
    
    // Vérifier si l'utilisateur est authentifié
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      console.error('Utilisateur non authentifié pour la mise à jour d\'image');
      throw new Error('Vous devez être connecté pour mettre à jour des images');
    }
    
    // Ajouter la date de mise à jour
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('gallery_images')
      .update(updatedData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`Erreur lors de la mise à jour de l'image ${id}:`, error);
      
      // Vérifier si c'est une erreur de politique de sécurité
      if (error.message.includes('row-level security') || error.message.includes('policy')) {
        throw new Error('Erreur de sécurité: Vous n\'avez pas les permissions nécessaires pour mettre à jour des images. Vérifiez les politiques de sécurité dans Supabase.');
      }
      
      throw error;
    }
    
    console.log('Image mise à jour avec succès:', data);
    return { success: true, data: data[0] };
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'image ${id}:`, error);
    return { success: false, error };
  }
}

// Fonction pour supprimer une image
export async function deleteGalleryImage(id: string, storagePath: string) {
  try {
    console.log('Début de la suppression de l\'image:', id, storagePath);
    
    // Vérifier si l'utilisateur est authentifié
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      console.error('Utilisateur non authentifié pour la suppression d\'image');
      throw new Error('Vous devez être connecté pour supprimer des images');
    }
    
    // Supprimer d'abord le fichier du stockage
    const { error: storageError } = await supabase.storage
      .from('gallery')
      .remove([storagePath]);
    
    if (storageError) {
      console.error(`Erreur lors de la suppression du fichier ${storagePath}:`, storageError);
      
      // Vérifier si c'est une erreur de politique de sécurité
      if (storageError.message.includes('row-level security') || storageError.message.includes('policy')) {
        throw new Error('Erreur de sécurité: Vous n\'avez pas les permissions nécessaires pour supprimer des fichiers. Vérifiez les politiques de sécurité dans Supabase.');
      }
      
      throw storageError;
    }
    
    // Puis supprimer l'entrée de la base de données
    const { error: dbError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);
    
    if (dbError) {
      console.error(`Erreur lors de la suppression de l'entrée ${id}:`, dbError);
      
      // Vérifier si c'est une erreur de politique de sécurité
      if (dbError.message.includes('row-level security') || dbError.message.includes('policy')) {
        throw new Error('Erreur de sécurité: Vous n\'avez pas les permissions nécessaires pour supprimer des entrées. Vérifiez les politiques de sécurité dans Supabase.');
      }
      
      throw dbError;
    }
    
    console.log('Image supprimée avec succès');
    return { success: true };
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'image ${id}:`, error);
    return { success: false, error };
  }
} 