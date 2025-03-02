# Property Landing Page Starter Kit

Un kit de démarrage moderne pour créer des landing pages de propriétés de location, facilement personnalisable et extensible.

## Fonctionnalités

- 🎨 **Design moderne et élégant** - Interface utilisateur soignée et efficace
- 📱 **100% responsive** - Expérience optimale sur tous les appareils
- 🔧 **Hautement personnalisable** - Adaptez facilement les couleurs, images et contenus
- 🧩 **Architecture modulaire** - Composants réutilisables et faciles à maintenir
- 📊 **Système de booking intégré** - Widget de réservation avec calcul de prix
- 🗺️ **Intégration Google Maps** - Affichage de la localisation et des points d'intérêt
- 🌐 **Multi-langue** - Support de traduction intégré
- ⚡ **Performances optimisées** - Chargement rapide et expérience utilisateur fluide

## Stack Technique

- **Framework**: Next.js 14+ (avec App Router)
- **Langage**: TypeScript
- **UI Library**: React 18+
- **Composants**: ShadCN UI
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Dates**: date-fns
- **Base de données**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Déploiement**: Cloudflare Pages (recommandé)

## Structure du Projet

```
property-landing-starter/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                 # Page principale (landing page)
│   │   ├── book/                    # Section réservation
│   │   └── ... 
│   ├── api/                         # Routes API
│   └── ...
├── components/                      # Composants réutilisables
│   ├── ui/                          # Composants UI génériques
│   ├── layout/                      # Composants de structure
│   ├── sections/                    # Sections de landing page
│   ├── booking/                     # Composants de réservation
│   └── shared/                      # Composants partagés
├── lib/                             # Bibliothèques et utilitaires
│   ├── config/                      # Configuration du site
│   │   └── property-config.ts       # Configuration des propriétés
│   └── utils.ts                     # Fonctions utilitaires
├── types/                           # Types TypeScript
├── styles/                          # Styles globaux
├── public/                          # Fichiers statiques
└── ...
```

## Guide de démarrage rapide

### Prérequis

- Node.js 18+ 
- npm ou yarn
- IDE recommandé: VS Code, Cursor AI

### Installation

1. Clonez le repository:
```bash
git clone https://github.com/votre-username/property-landing-starter.git
cd property-landing-starter
```

2. Installez les dépendances:
```bash
npm install
# ou
yarn install
```

3. Lancez le serveur de développement:
```bash
npm run dev
# ou
yarn dev
```

4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Personnalisation

### Configuration de propriété

Le fichier principal pour configurer votre propriété se trouve dans `lib/config/property-config.ts`. C'est ici que vous définissez toutes les informations spécifiques à votre propriété:

```typescript
// Exemple de configuration pour une nouvelle propriété
export const myPropertyConfig: PropertyConfig = {
  id: 'my-property',
  slug: 'my-property',
  name: 'My Property Name',
  themeClass: 'theme-my-property',
  // ... autres propriétés
};
```

### Thème et styles

Vous pouvez personnaliser les couleurs et les styles dans:

1. `styles/theme.css` - Variables CSS pour les couleurs principales
2. `config/tailwind.config.js` - Configuration Tailwind

Pour ajouter un nouveau thème pour une propriété:

```css
/* Dans styles/theme.css */
.theme-my-property {
  --primary: #000000;
  --primary-50: #f2f2f2;
  /* ... autres variables de couleur */
}
```

### Images et médias

Placez les images de votre propriété dans le dossier approprié:

```
public/images/[property-slug]/
```

Puis référencez-les dans votre configuration:

```typescript
heroImage: '/images/my-property/hero.jpg',
gallery: [
  {
    id: 'exterior-1',
    url: '/images/my-property/exterior-1.jpg',
    alt: 'Vue extérieure',
    category: 'exterior',
  },
  // ... autres images
]
```

## Structure des composants

### Sections

Chaque section de la landing page est un composant modulaire:

- `HeroSection` - Section d'en-tête avec image principale
- `IntroSection` - Introduction à la propriété
- `GallerySection` - Galerie d'images
- `AmenitiesSection` - Équipements et caractéristiques
- `LocationSection` - Carte et points d'intérêt
- `PricingSection` - Tarifs et disponibilités
- `TestimonialsSection` - Témoignages des clients
- `ContactSection` - Formulaire de contact

### Widget de réservation

Le composant `BookingWidget` gère:

- Sélection des dates
- Calcul du prix
- Formulaire de réservation
- Confirmation de réservation

### Composants partagés

Des composants utilitaires réutilisables:

- `ImageGallery` - Affichage des images avec lightbox
- `MapView` - Intégration Google Maps
- `IconCard` - Carte avec icône pour les équipements
- `TestimonialCard` - Affichage des témoignages

## Utilisation avec Cursor AI

Cursor AI peut vous aider à:

1. **Générer des composants supplémentaires** - Demandez à Cursor de créer de nouveaux composants en suivant le style existant
2. **Modifier la configuration** - Obtenez de l'aide pour personnaliser votre configuration de propriété
3. **Résoudre les erreurs** - Si vous rencontrez des problèmes, demandez à Cursor de les diagnostiquer et les résoudre
4. **Améliorer les fonctionnalités** - Cursor peut vous aider à étendre les fonctionnalités existantes

Exemples de prompts utiles:
- "Crée un nouveau composant de testimonial qui affiche une note en étoiles"
- "Aide-moi à ajouter une fonctionnalité de galerie vidéo"
- "Comment puis-je intégrer un système de paiement dans le widget de réservation?"

## Déploiement

### Cloudflare Pages (recommandé)

1. Connectez votre repository à Cloudflare Pages
2. Configurez les variables d'environnement:
   - `PROPERTY_SLUG=your-property-slug`
   - `NEXT_PUBLIC_SUPABASE_URL=your-supabase-url`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key`
3. Déployez

### Vercel

1. Importez votre projet dans Vercel
2. Configurez les variables d'environnement
3. Déployez

## Intégration Supabase

1. Créez un projet sur [Supabase](https://supabase.com)
2. Créez les tables nécessaires (voir `lib/supabase/schema.ts`)
3. Configurez l'authentification
4. Ajoutez vos clés API à vos variables d'environnement

## Bonnes pratiques

- **Images**: Optimisez vos images avant de les ajouter au projet (formats WebP, dimensions appropriées)
- **Performances**: Utilisez des composants Server et Client appropriés
- **SEO**: Personnalisez les métadonnées dans `generateMetadata`
- **Accessibilité**: Conservez les fonctionnalités d'accessibilité intégrées
- **Internationalization**: Utilisez les fichiers de traduction pour ajouter des langues

## Ressources supplémentaires

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation ShadCN UI](https://ui.shadcn.com)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Framer Motion](https://www.framer.com/motion/)

## Licence

MIT
