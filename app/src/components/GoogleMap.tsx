'use client';

import { useState, useCallback, useEffect } from 'react';

interface GoogleMapComponentProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  name: string;
  address: string;
  apiKey: string;
}

export default function GoogleMapComponent({
  latitude,
  longitude,
  zoom = 15,
  name,
  address,
  apiKey
}: GoogleMapComponentProps) {
  // Forcer l'utilisation des nouvelles coordonnées
  const actualLatitude = -17.527361;
  const actualLongitude = -149.559583;

  // Créer l'URL de l'iframe Google Maps
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${actualLatitude},${actualLongitude}&zoom=${zoom}&language=fr`;

  return (
    <div className="w-full h-full">
      <iframe
        title={`Carte de ${name}`}
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={mapUrl}
        allowFullScreen
      ></iframe>
    </div>
  );
} 