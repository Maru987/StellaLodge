'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Gallery } from '@/components/sections/gallery';
import { Amenities } from '@/components/sections/amenities';
import { Location } from '@/components/sections/location';
import { Pricing } from '@/components/sections/pricing';
import { Contact } from '@/components/sections/contact';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { propertyData } from '@/config/property-config';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header propertyName={propertyData.name} logoUrl={propertyData.logo} />
      
      <Hero property={propertyData} />
      
      {propertyData.sections.intro.enabled && (
        <About property={propertyData} />
      )}
      
      {propertyData.sections.gallery.enabled && (
        <Gallery property={propertyData} />
      )}
      
      {propertyData.sections.amenities.enabled && (
        <Amenities property={propertyData} />
      )}
      
      {propertyData.sections.location.enabled && (
        <Location property={propertyData} />
      )}
      
      {propertyData.sections.pricing.enabled && (
        <Pricing property={propertyData} />
      )}
      
      {propertyData.sections.contact.enabled && (
        <Contact property={propertyData} />
      )}
      
      <Footer property={propertyData} />
      
      <ScrollToTop />
    </main>
  );
}
