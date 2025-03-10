'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { createPortal } from 'react-dom';

interface HeaderProps {
  propertyName: string;
  logoUrl?: string;
  className?: string;
}

export function Header({ propertyName, logoUrl, className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Vérifier si le composant est monté (côté client)
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled 
            ? 'bg-black/20 backdrop-blur-md shadow-sm py-4 md:py-4' 
            : 'bg-transparent py-4 md:py-6',
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
              className={`md:hidden absolute right-4 p-2 rounded-full transition-all duration-300 ${
                isMobileMenuOpen 
                  ? 'bg-primary text-white shadow-lg' 
                  : isScrolled 
                    ? 'text-white hover:bg-transparent' 
                    : 'text-white hover:bg-white/20 backdrop-blur-sm'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              style={{ zIndex: 9999 }}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2} className="text-white" />}
              </motion.div>
            </button>
          </div>
        </div>
      </header>

      {/* Menu Mobile - Rendu via un portail pour éviter les problèmes de z-index */}
      {isMounted && isMobileMenuOpen && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(16px)',
            zIndex: 9000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'auto'
          }}
          className="md:hidden"
        >
          {/* Bouton de fermeture en haut à droite */}
          <button 
            onClick={handleNavClick}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-primary transition-colors duration-200 z-[9001]"
            aria-label="Fermer le menu"
          >
            <X size={24} strokeWidth={2.5} />
          </button>

          <div className="container mx-auto px-4 py-6 relative h-full flex flex-col justify-center">
            {/* Contenu du menu */}
            <div className="flex flex-col gap-3 items-center max-h-[80vh] overflow-y-auto py-4">
              {/* Liens de navigation */}
              {[
                { href: "#intro", text: "À propos" },
                { href: "#gallery", text: "Galerie" },
                { href: "#amenities", text: "Équipements" },
                { href: "#location", text: "Emplacement" },
                { href: "#pricing", text: "Tarifs" },
                { href: "#contact", text: "Contact" }
              ].map((link, index) => (
                <div
                  key={link.href}
                  className="w-full max-w-[250px]"
                >
                  <Link 
                    href={link.href} 
                    className="block w-full text-center py-2.5 text-white text-lg font-medium hover:text-primary transition-colors duration-200 bg-black/80 border border-gray-800 backdrop-blur-md rounded-md mb-1 shadow-md"
                    onClick={handleNavClick}
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {link.text}
                  </Link>
                </div>
              ))}
              
              <div className="mt-4 w-full max-w-[250px]">
                <Link 
                  href={isLoggedIn ? "/admin" : "/auth"} 
                  className="bg-primary/90 hover:bg-primary text-white px-4 py-2 rounded-md text-center transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 font-medium w-full"
                  onClick={handleNavClick}
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {isLoggedIn ? "Espace Admin" : "Espace Client"}
                </Link>
              </div>
              
              {/* Texte d'instruction en bas */}
              <div className="mt-4 text-white text-xs font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                Appuyez sur X ou sur un lien pour fermer
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
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