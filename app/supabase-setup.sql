-- Création de la table des réservations
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  plan_name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  period TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending'
);

-- Création d'un index sur la date de check-in pour des recherches plus rapides
CREATE INDEX IF NOT EXISTS reservations_check_in_idx ON reservations (check_in);

-- Création d'un index sur le statut pour filtrer facilement
CREATE INDEX IF NOT EXISTS reservations_status_idx ON reservations (status);

-- Création de la table pour les images de la galerie
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  title TEXT NOT NULL,
  alt_text TEXT,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

-- Création d'un index sur la catégorie pour filtrer facilement
CREATE INDEX IF NOT EXISTS gallery_images_category_idx ON gallery_images (category);

-- Création d'un index sur featured pour filtrer facilement
CREATE INDEX IF NOT EXISTS gallery_images_featured_idx ON gallery_images (featured);

-- Politique de sécurité pour permettre les insertions publiques
-- (à exécuter dans l'interface SQL de Supabase)
CREATE POLICY "Enable public inserts" ON reservations
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Activer RLS (Row Level Security) sur la table
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture des réservations uniquement par les utilisateurs authentifiés
-- (à exécuter si vous souhaitez créer une interface d'administration)
CREATE POLICY "Enable read access for authenticated users only" ON reservations
  FOR SELECT
  TO authenticated
  USING (true);

-- Politique pour permettre la mise à jour des réservations uniquement par les utilisateurs authentifiés
-- (à exécuter si vous souhaitez créer une interface d'administration)
CREATE POLICY "Enable update access for authenticated users only" ON reservations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Activer RLS sur la table gallery_images
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture des images par tous
CREATE POLICY "Enable public read access for gallery images" ON gallery_images
  FOR SELECT
  TO anon
  USING (true);

-- Politique pour permettre la gestion des images uniquement par les utilisateurs authentifiés
CREATE POLICY "Enable full access for authenticated users only" ON gallery_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Configuration du bucket de stockage pour les images
-- Ces commandes sont automatiquement exécutées par la fonction setupStoragePolicies dans l'interface d'administration

-- Activer RLS sur la table storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour la lecture publique des fichiers du bucket gallery
CREATE POLICY "Allow public read access for gallery files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'gallery');

-- Créer une politique pour toutes les opérations aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated users full access to gallery files"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'gallery')
WITH CHECK (bucket_id = 'gallery'); 