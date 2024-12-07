import React, { useState, useEffect } from 'react';
import TopNav from './components/TopNav';
import { SideNav } from './components/Sidebar';
import LeafletMap from './components/LeafletMap';
import MessagingWidget from './components/MessagingWidget';
import { LatLng, LatLngExpression, } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from './context/AuthContext';
import sampleImage from './assets/etap-photovoltaic-array-analysis-3.jpg';
import { updateUserLocation, getCurrentLocation, getUserInfo } from '@/services/userService';
import { fetchNearbyProducts } from './services/productService';
import UserInfo from './components/UserInfo';
import {Products} from '../backend/src/types/index';

interface UserInfo_ {
  _id: {
    $oid: string;
  };
  firebaseUid: string;
  email: string;
  username: string;
  pincode: string;
  phoneNumber: string;
  latitude: number; // Changed to number as per JSON
  longitude: number; // Changed to number as per JSON
  friendIds: string[];
  totalBarters: number;
  totalPoints: number;
  avatarLink: string;
  itemsSold: string[];
  itemsBought: string[];
  unSoldItems: string[];
  isPhoneVerified: boolean; // Made mandatory as per JSON
  userRatings: number;
  createdAt: {
    $date: string;
  };
  __v: number; // Added based on JSON
}





const Dashboard = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [userInfo, setUserInfo]= useState<UserInfo_ | null>(null);
  const [products, setProducts] = useState<Products[]>([]);
  const [productMarkers, setProductMarkers] = useState<Array<{
    position: LatLngExpression;
    product: Products;
  }>>([]);

  // Effect to update location on component mount and periodically
  useEffect(() => {
    const updateLocation = async () => {
      if (!currentUser) return;

      try {
        // Get current location
        const location = await getCurrentLocation();
        const userLatLng = L.latLng(location.latitude, location.longitude);
        // Update user location in state
        setUserLocation(L.latLng(location.latitude, location.longitude));
        
        // Update location in database
        const data = await getUserInfo(currentUser.uid);
        // data.firebaseUid = currentUser.uid;
        setUserInfo(data); // TypeScript will know data is of type UserInfo
        // const fetchedProducts = await fetchNearbyProducts(data.email, data.pincode);
        // setProducts(fetchedProducts);
        // const markers = products.map(product => ({
        //   position: [product.latitude, product.longitude] as LatLngExpression,
        //   product: product
        // }));
        // setProductMarkers(markers);
      } catch (error) {
        console.error('Failed to update location:', error);
      }
    };

    // Update location immediately on mount
    updateLocation();

    // Optionally, update location periodically (e.g., every 5 minutes)
    const locationInterval = setInterval(updateLocation, 5 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(locationInterval);
  }, [currentUser]);

  useEffect(() => {
    const updateProductList = async () => {
      
      if (!currentUser) return;
      const userInfo = await getUserInfo(currentUser.uid);
      try {
        const fetchedProducts = await fetchNearbyProducts(userInfo.username, userInfo.pincode);
        setProducts(fetchedProducts);
        
        const markers = fetchedProducts.map(product => ({
          position: [product.latitude, product.longitude] as LatLngExpression,
          product: product
        }));
        setProductMarkers(markers);
      } catch (error) {
        console.error('Failed to fetch nearby products:', error);
      }
    };
  
    // Call the function
    updateProductList();
  }, [currentUser]);

  const handleMapClick = (latlng: LatLng) => {
    console.log('Clicked location:', latlng);
  };

  const handleMapMove = (mapInfo: { center: LatLng; zoom: number; bounds: L.LatLngBounds }) => {
    console.log('Map moved:', mapInfo);
  };

  const handleLocationFound = (location: LatLng) => {
    // console.log('User location found:', location);
    setUserLocation(location); // Set location in state if needed
  };

  return (
    <div className="h-screen w-full flex flex-col">
      {/* <TopNav /> */}
      <TopNav userInfo={userInfo} />
      <div className="flex flex-1 pt-11">
        <SideNav 
          currentPath="/dashboard"
          onNavigate={() => {}}
          onMessageClick={() => setIsMessagingOpen(prev => !prev)}
        />
          
        <main className="flex-1 lg:ml-[140px] relative z-0">
          <LeafletMap 
            center={userLocation ? [userLocation.lat, userLocation.lng] : [51.505, -0.09]}
            zoom={13}
            markers={productMarkers}
            onLocationFound={handleLocationFound}
          />
        </main>
      </div>
      {isMessagingOpen && (
        <div className="fixed inset-0 pointer-events-none z-50 flex justify-end items-end p-4">
          <div className="pointer-events-auto">
            {currentUser && (
              <MessagingWidget 
                userId={userId as string} 
                onClose={() => setIsMessagingOpen(false)} 
              />
            )}
          </div>
        </div>
      )}  
    </div>
  );
};

export default Dashboard;