import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LatLng, LatLngExpression } from 'leaflet';
import { Product } from '@/types/Product';
import {Products} from '../../backend/src/types/index'
import ProductCard from './ProductCard';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Marker {
  position: LatLngExpression;
  product: Products;
}

interface LeafletMapProps {
  center?: LatLngExpression;
  zoom?: number;
  markers?: Marker[];
  onLocationFound?: (location: LatLng) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  center = [42.30462759648109, -83.06599608852105], 
  zoom = 13, 
  markers = [], 
  onLocationFound 
}) => {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [initialZoomDone, setInitialZoomDone] = useState(false); // Track whether initial zoom is completed

  useEffect(() => {
    const requestLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const location = L.latLng(latitude, longitude);
            setUserLocation(location);

            // Perform initial zoom only once
            if (mapRef.current && !initialZoomDone) {
              mapRef.current.flyTo(location, 13, { duration: 1.5 });
              setInitialZoomDone(true); // Prevent further automatic zooming
            }

            onLocationFound && onLocationFound(location);
          },
          (error) => {
            console.error('Error getting location:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 150000,
            maximumAge: 0,
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        alert('Geolocation is not supported by your browser.');
      }
    };

    requestLocation();
  }, [onLocationFound, initialZoomDone]);

  // Handle "Locate Me" button
  const handleLocateMe = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.flyTo(userLocation, 13, { duration: 1.5 });
    }
  };

  return (
    <div className="relative h-[85vh] w-[1200px] z-10">
      {/* Map */}
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={(map) => (mapRef.current = map)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.divIcon({
              className: 'custom-div-icon',
              html: '<div style="background-color: blue; width: 20px; height: 20px; border-radius: 50%;"></div>',
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })}
          >
            <Popup>Your Current Location</Popup>
          </Marker>
        )}
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position}>
            <Popup className="custom-popup">
              <div className="w-72">
                <ProductCard product={marker.product} />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Locate Me Button */}
      <button
        onClick={handleLocateMe}
        className="absolute top-4 left-4 p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none"
      >
        Locate Me
      </button>
    </div>
  );
};

export default LeafletMap;
