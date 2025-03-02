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