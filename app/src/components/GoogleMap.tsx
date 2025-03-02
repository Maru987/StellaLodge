'use client';

import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

interface GoogleMapComponentProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  name: string;
  address: string;
  apiKey: string;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

export default function GoogleMapComponent({
  latitude,
  longitude,
  zoom = 15,
  name,
  address,
  apiKey
}: GoogleMapComponentProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);

  // Forcer l'utilisation des nouvelles coordonnées
  const actualLatitude = -17.527361;
  const actualLongitude = -149.559583;

  const center = {
    lat: actualLatitude,
    lng: actualLongitude
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const toggleInfoWindow = () => {
    setIsInfoWindowOpen(!isInfoWindowOpen);
  };

  // Forcer le recentrage de la carte sur les nouvelles coordonnées
  useEffect(() => {
    if (map) {
      map.panTo(center);
    }
  }, [map, center]);

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        <Marker
          position={center}
          onClick={toggleInfoWindow}
        >
          {isInfoWindowOpen && (
            <InfoWindow
              position={center}
              onCloseClick={toggleInfoWindow}
            >
              <div className="p-2">
                <h3 className="font-bold text-lg">{name}</h3>
                <p className="text-sm text-gray-600">{address}</p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>
    </LoadScript>
  );
} 