# 🌊 Lenis Smooth Scroll - Intégration StellaLodge

## 📋 Vue d'ensemble

Lenis a été intégré dans votre projet StellaLodge pour offrir une expérience de défilement fluide et immersive, similaire à celle d'Instagram. Cette bibliothèque moderne améliore considérablement l'expérience utilisateur en créant des animations de scroll naturelles et performantes.

## 🚀 Fonctionnalités intégrées

### ✅ Configuration de base
- **Durée** : 1.2 secondes pour les animations
- **Easing** : Fonction d'accélération personnalisée pour un effet naturel
- **Orientation** : Défilement vertical
- **Multiplicateurs** : Optimisés pour souris et tactile

### ✅ Composants disponibles
- **LenisProvider** : Provider React pour l'état global
- **ScrollToTop** : Bouton de retour en haut animé
- **AnimatedSection** : Composant pour animer les sections
- **ProgressBar** : Barre de progression basée sur le scroll

### ✅ Hooks personnalisés
- **useLenis** : Hook de base pour utiliser Lenis
- **useLenisContext** : Hook pour accéder au contexte Lenis
- **useScrollAnimation** : Hook pour les animations au scroll
- **useParallax** : Hook pour les effets de parallaxe

## 🔧 Utilisation

### 1. Utilisation de base avec le contexte

```tsx
import { useLenisContext } from '@/components/providers/lenis-provider'

const MyComponent = () => {
  const { scrollTo } = useLenisContext()

  const handleClick = () => {
    scrollTo('#section-id', {
      duration: 2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    })
  }

  return (
    <button onClick={handleClick}>
      Aller à la section
    </button>
  )
}
```

### 2. Animations au scroll

```tsx
import { AnimatedSection } from '@/components/ui/animated-section'

const MyPage = () => {
  return (
    <div>
      <AnimatedSection animation="fade" delay={0.2}>
        <h1>Titre avec animation fade</h1>
      </AnimatedSection>
      
      <AnimatedSection animation="slide-up" delay={0.4}>
        <p>Paragraphe avec animation slide-up</p>
      </AnimatedSection>
      
      <AnimatedSection animation="parallax" parallaxSpeed={0.3}>
        <img src="/image.jpg" alt="Image avec parallaxe" />
      </AnimatedSection>
    </div>
  )
}
```

### 3. Hook d'animation personnalisé

```tsx
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

const MyComponent = () => {
  const { ref, isVisible, scrollProgress } = useScrollAnimation({
    threshold: 0.5,
    once: false
  })

  return (
    <div ref={ref}>
      <p>Visible: {isVisible ? 'Oui' : 'Non'}</p>
      <p>Progrès: {Math.round(scrollProgress * 100)}%</p>
    </div>
  )
}
```

### 4. Empêcher le smooth scroll sur certains éléments

```tsx
// Méthode 1 : Avec des attributs HTML
<div data-lenis-prevent>
  Contenu qui ne sera pas affecté par le smooth scroll
</div>

// Méthode 2 : Empêcher seulement les événements wheel
<div data-lenis-prevent-wheel>
  Contenu avec scroll tactile mais pas wheel
</div>

// Méthode 3 : Empêcher seulement les événements touch
<div data-lenis-prevent-touch>
  Contenu avec scroll wheel mais pas tactile
</div>
```

## 🎨 Personnalisation

### Modifier les paramètres globaux

Éditez le fichier `app/src/components/providers/lenis-provider.tsx` :

```tsx
lenisRef.current = new Lenis({
  duration: 1.5, // Durée plus longue
  easing: (t) => t, // Easing linéaire
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.8, // Scroll plus lent
  touchMultiplier: 1.5, // Scroll tactile plus rapide
  infinite: false,
})
```

### Créer des animations personnalisées

```tsx
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

const CustomAnimation = ({ children }) => {
  const { ref, isVisible, scrollProgress } = useScrollAnimation()

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: `scale(${0.8 + scrollProgress * 0.2})`,
    transition: 'all 0.6s ease-out'
  }

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  )
}
```

## 📱 Responsive et Performance

### Optimisations incluses
- **Détection automatique** : Adaptation aux appareils tactiles
- **Performance** : Utilisation de `requestAnimationFrame`
- **Mémoire** : Nettoyage automatique des event listeners
- **Responsive** : Adaptation automatique aux changements de taille

### Bonnes pratiques
1. **Utilisez `once: true`** pour les animations qui ne doivent se jouer qu'une fois
2. **Limitez les animations parallax** pour éviter les problèmes de performance
3. **Testez sur mobile** pour vérifier la fluidité tactile
4. **Utilisez les hooks avec parcimonie** sur les pages avec beaucoup d'éléments

## 🔍 Débogage

### Activer les logs de débogage

Dans `lenis-provider.tsx`, décommentez :

```tsx
lenisRef.current.on('scroll', (e) => {
  console.log(e) // Affiche les données de scroll
})
```

### Vérifier que Lenis fonctionne

```tsx
import { useLenisContext } from '@/components/providers/lenis-provider'

const DebugComponent = () => {
  const { lenis } = useLenisContext()
  
  useEffect(() => {
    console.log('Lenis instance:', lenis)
    console.log('Scroll position:', lenis?.scroll)
    console.log('Scroll progress:', lenis?.progress)
  }, [lenis])

  return <div>Vérifiez la console</div>
}
```

## 🎯 Exemples d'utilisation avancée

### Synchronisation avec GSAP (si vous l'utilisez)

```tsx
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenisContext } from '@/components/providers/lenis-provider'

const GSAPSync = () => {
  const { lenis } = useLenisContext()

  useEffect(() => {
    if (!lenis) return

    lenis.on('scroll', ScrollTrigger.update)
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    
    gsap.ticker.lagSmoothing(0)
  }, [lenis])

  return null
}
```

### Scroll vers une section avec offset

```tsx
const scrollToSection = (sectionId: string) => {
  scrollTo(sectionId, {
    offset: -100, // 100px au-dessus de la section
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  })
}
```

## 🚨 Limitations et considérations

- **iframes** : Le smooth scroll ne fonctionne pas au-dessus des iframes
- **CSS scroll-snap** : Non supporté, utilisez les alternatives Lenis
- **Performance mobile** : Limité à 60fps sur Safari, 30fps en mode économie d'énergie
- **Nested scroll** : Nécessite une configuration appropriée pour les conteneurs imbriqués

## 📚 Ressources utiles

- [Documentation officielle Lenis](https://lenis.darkroom.engineering/)
- [Exemples sur GitHub](https://github.com/darkroomengineering/lenis)
- [Communauté et support](https://github.com/darkroomengineering/lenis/discussions)

---

✨ **Votre site StellaLodge bénéficie maintenant d'un défilement fluide et professionnel !** 