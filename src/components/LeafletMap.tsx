import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LatLng, LatLngExpression } from 'leaflet';
import { Product } from '@/types/Product';
import ProductCard from './ProductCard';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Marker {
  position: LatLngExpression;
  product: Product;
}

interface MapInfo {
  center: LatLng;
  zoom: number;
  bounds: L.LatLngBounds;
}

interface MapEventHandlerProps {
  onMapClick?: (latlng: LatLng) => void;
  onMoveEnd?: (mapInfo: MapInfo) => void;
}

const MapEventHandler: React.FC<MapEventHandlerProps> = ({ onMapClick, onMoveEnd }) => {
  useMapEvents({
    click: (e) => {
      onMapClick && onMapClick(e.latlng);
    },
    moveend: (e) => {
      const map = e.target;
      onMoveEnd && onMoveEnd({
        center: map.getCenter(),
        zoom: map.getZoom(),
        bounds: map.getBounds()
      });
    }
  });
  return null;
};

interface LeafletMapProps {
  center?: LatLngExpression;
  zoom?: number;
  markers?: Marker[];
  onMapClick?: (latlng: LatLng) => void;
  onMoveEnd?: (mapInfo: MapInfo) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ 
    center = [42.30462759648109, -83.06599608852105], 
    zoom = 13, 
    markers = [], 
    onMapClick, 
    onMoveEnd 
  }) => {
    const [mapState, setMapState] = useState({
      center,
      zoom
    });
  
    return (
      <div className="h-[85vh] w-[1200px] z-10"> {/* Calculate full viewport height minus TopNav */}
        <MapContainer 
          center={mapState.center} 
          zoom={mapState.zoom} 
          style={{ height: '100%', width: '100%' }}
        >
          <MapEventHandler 
            onMapClick={onMapClick}
            onMoveEnd={(mapInfo) => {
              setMapState({
                center: mapInfo.center,
                zoom: mapInfo.zoom
              });
              onMoveEnd && onMoveEnd(mapInfo);
            }}
          />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {markers.map((marker, index) => (
            <Marker 
              key={index} 
              position={marker.position}
            >
              <Popup className="custom-popup">
                <div className="w-72">
                  <ProductCard product={marker.product} />
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    );
  };
  
  export default LeafletMap;