'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface HeaderProps {
  propertyName: string;
  logoUrl?: string;
  className?: string;
}

export function Header({ propertyName, logoUrl, className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
    };
    
    checkUser();
    
    // Écouter les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsLoggedIn(!!session);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Gérer le défilement pour changer l'apparence du header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors du changement de section
  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };
  
  // Empêcher le défilement du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-black/20 backdrop-blur-md shadow-sm py-4' 
          : 'bg-transparent py-6',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center relative">
          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-10">
            <NavLinks isScrolled={isScrolled} onClick={handleNavClick} />
          </nav>

          {/* Bouton de réservation (Desktop) */}
          <div className="hidden md:block absolute right-4">
            <Link 
              href={isLoggedIn ? "/admin" : "/auth"} 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white px-4 py-2 rounded-md transition-all duration-300 hover:shadow-lg flex items-center gap-2 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {isLoggedIn ? "Espace Admin" : "Espace Client"}
            </Link>
          </div>

          {/* Bouton du menu mobile */}
          <button 
            className={`md:hidden absolute right-4 p-3 rounded-full transition-all duration-300 z-[60] ${
              isMobileMenuOpen 
                ? 'bg-primary text-white shadow-lg' 
                : !isScrolled 
                  ? 'text-white hover:bg-white/20 backdrop-blur-sm' 
                  : 'text-foreground hover:bg-black/20 backdrop-blur-sm'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Menu Mobile - Overlay complet */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center md:hidden"
        >
          <div className="container mx-auto px-6 py-10 relative">
            {/* Contenu du menu */}
            <motion.nav 
              className="flex flex-col gap-6 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MobileNavLinks onClick={handleNavClick} />
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="mt-6 w-full max-w-xs"
              >
                <Link 
                  href={isLoggedIn ? "/admin" : "/auth"} 
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white px-6 py-3 rounded-md text-center transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 font-medium w-full"
                  onClick={handleNavClick}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {isLoggedIn ? "Espace Admin" : "Espace Client"}
                </Link>
              </motion.div>
              
              {/* Bouton de fermeture en bas */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="mt-8 text-white/60 text-sm"
              >
                Appuyez sur X ou sur un lien pour fermer
              </motion.div>
            </motion.nav>
          </div>
        </motion.div>
      )}
    </header>
  );
}

// Composant pour les liens de navigation mobile
function MobileNavLinks({ onClick }: { onClick: () => void }) {
  const links = [
    { href: "#intro", text: "À propos" },
    { href: "#gallery", text: "Galerie" },
    { href: "#amenities", text: "Équipements" },
    { href: "#location", text: "Emplacement" },
    { href: "#pricing", text: "Tarifs" },
    { href: "#contact", text: "Contact" }
  ];
  
  return (
    <>
      {links.map((link, index) => (
        <motion.div
          key={link.href}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="w-full max-w-xs"
        >
          <Link 
            href={link.href} 
            className="block w-full text-center py-4 text-white text-xl font-medium hover:text-primary transition-colors duration-200"
            onClick={onClick}
          >
            {link.text}
          </Link>
        </motion.div>
      ))}
    </>
  );
}

// Composant pour les liens de navigation desktop
function NavLinks({ isScrolled, onClick }: { isScrolled: boolean, onClick: () => void }) {
  const linkClass = isScrolled 
    ? "text-white hover:text-primary-200 transition-colors drop-shadow-sm text-base md:text-lg font-medium" 
    : "text-white hover:text-primary-200 transition-colors drop-shadow-sm text-base md:text-lg font-medium";
  
  const links = [
    { href: "#intro", text: "À propos" },
    { href: "#gallery", text: "Galerie" },
    { href: "#amenities", text: "Équipements" },
    { href: "#location", text: "Emplacement" },
    { href: "#pricing", text: "Tarifs" },
    { href: "#contact", text: "Contact" }
  ];
  
  return (
    <>
      {links.map((link, index) => (
        <motion.div
          key={link.href}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Link 
            href={link.href} 
            className={linkClass}
            onClick={onClick}
          >
            {link.text}
          </Link>
        </motion.div>
      ))}
    </>
  );
} 