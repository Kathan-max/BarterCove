import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface UserInfoProps {
    user: {
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
        createdAt: {
          $date: string;
        };
        __v: number; // Added based on JSON
      } | null;
} 

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
    if (!user) {
        return <div>Loading...</div>;
    }
    const navigate = useNavigate();

    const handleClick = () => {
        // Navigate to the UserProfile page, passing the user's Firebase UID as a parameter
        navigate(`/user-profile/${user.firebaseUid}`);
    };

    return (
    <div className="flex items-center p-2 bg-white border-2 border-black rounded-full shadow-lg transition-all hover:bg-black hover:text-white"
    onClick={handleClick}>
      {/* Avatar with black border */}
      <Avatar className="border-2 border-black">
        <AvatarImage src={user.avatarLink || "/default-avatar.png"} alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="ml-2">
        <h4 className="text-sm font-semibold">{user.username}</h4>
        <p className="text-xs">Points: {user.totalPoints}</p>
      </div>
    </div>
  );
};

export default UserInfo;
