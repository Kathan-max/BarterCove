import React, { useState } from 'react';
import TopNav from './components/TopNav';
import { SideNav } from './components/Sidebar';
import LeafletMap from './components/LeafletMap';
import MessagingWidget from './components/MessagingWidget';
import { LatLng, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from './context/AuthContext';
import sampleImage from './assets/etap-photovoltaic-array-analysis-3.jpg';

const Dashboard = () => {
  const {currentUser} = useAuth();
  const userId = currentUser?.uid;
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  
  const markers = [
    {
      position: [42.30462759648109, -83.06599608852105] as LatLngExpression,
      product: {
        id: '1',
        name: 'Eco-friendly Solar Panel',
        description: 'High-efficiency solar panels for residential use',
        ownerName: 'John Doe',
        pinCode: '560001',
        carbonFootprint: 50,
        postDate: '2024-03-01',
        totalBids: 5,
        tags: ['renewable', 'energy'],
        imageUrl: sampleImage,
      }
    },
    {
      position: [42.20462759648109, -83.86599608852105] as LatLngExpression,
      product: {
        id: '2',
        name: 'Eco-friendly Solar Panel',
        description: 'High-efficiency solar panels for residential use',
        ownerName: 'John Doe',
        pinCode: '560001',
        carbonFootprint: 50,
        postDate: '2024-03-01',
        totalBids: 5,
        tags: ['renewable', 'energy'],
        imageUrl: sampleImage,
      }
    },
  ];

  const handleMapClick = (latlng: LatLng) => {
    console.log('Clicked location:', latlng);
  };

  const handleMapMove = (mapInfo: { center: LatLng; zoom: number; bounds: L.LatLngBounds }) => {
    console.log('Map moved:', mapInfo);
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <TopNav />
      <div className="flex flex-1 pt-11">
        <SideNav 
          currentPath="/dashboard"
          onNavigate={() => {}}
          onMessageClick={() => setIsMessagingOpen(prev => !prev)}
          />
          
        <main className="flex-1 lg:ml-[140px]  relative z-0">
          <LeafletMap 
            center={[51.505, -0.09]}
            zoom={13}
            markers={markers}
            onMapClick={handleMapClick}
            onMoveEnd={handleMapMove}
          />
        </main>
      </div>
      {isMessagingOpen && (
        <div className="fixed inset-0 pointer-events-none z-50 flex justify-end items-end p-4">
          <div className="pointer-events-auto">
            { currentUser && (
              <MessagingWidget 
              userId={userId as string} 
              onClose={() => setIsMessagingOpen(false)} 
              />
            )
            }
          </div>
        </div>
      )}
      {/* {isMessagingOpen && <MessagingWidget userId="1" onClose={() => setIsMessagingOpen(false)} />}  */}
      
      
    </div>
  );
};

export default Dashboard;