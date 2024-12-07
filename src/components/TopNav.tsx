// TopNav.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Bell, MessageCircle, PlusCircle, Search } from 'lucide-react';
import UserInfo from './UserInfo'; // Import the UserInfo component
import { useNavigate } from 'react-router-dom';

interface TopNavProps {
  userInfo: {
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
  } | null;

}

const TopNav: React.FC<TopNavProps> = ({ userInfo }) => {
  // console.log("In TopNav: ", userInfo?.firebaseUid);
  const navigate = useNavigate();
  const handleProductCreation = () => {
    // Navigate to the product creation form
    navigate('/create-product');
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="flex h-full items-center px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-2 w-[240px] ml-4">
          <img src="/src/assets/BarterCove.png" alt="Logo" className="h-10 w-50" />
        </div>

        {/* Search Section */}
        <div className="flex items-center flex-1 justify-center px-4">
          <div className="w-full max-w-2xl flex items-center space-x-2 relative">
            <Search className="w-4 h-4 text-muted-foreground absolute ml-2" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="ml-auto flex items-center space-x-4">
  
          <button className="p-2 hover:bg-accent rounded-full transition-colors group"
          onClick={handleProductCreation}>
            <PlusCircle className="h-5 w-5 text-white group-hover:text-black transition-colors" />
          </button>


        {/* Render User Info if available */}
        {userInfo && (
          <div className="ml-auto"> {/* Increased margin-top to create space from top */}
            <UserInfo user={userInfo}/>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
