import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInfo } from "@/services/userService";
import { getProductsByIds } from "@/services/productService";
import { Rating } from "./ui/rating";
import { SideNav } from "./Sidebar";
import MessagingWidget from "./MessagingWidget";
import { Products } from "../../backend/src/types";
import ProductCard from "./ProductCard";

interface Userinfo_ {
  firebaseUid: string;
  email: string;
  username: string;
  avatarLink: string;
  totalBarters: number;
  totalPoints: number;
  userRatings: number;
  latitude: number;
  longitude: number;
  itemsSold: string[];
  itemsBought: string[];
  unSoldItems: string[];
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const UserProfile: React.FC = () => {
  const { firebaseUid } = useParams();
  const [user, setUserInfo] = useState<Userinfo_ | null>(null);
  const [itemsSold, setItemsSold] = useState<Products[]>([]);
  const [itemsBought, setItemsBought] = useState<Products[]>([]);
  const [unSoldItems, setUnsoldItems] = useState<Products[]>([]);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo(firebaseUid as string);
        setUserInfo(data);

        const [sold, bought, unsold] = await Promise.all([
          getProductsByIds(data.itemsSold),
          getProductsByIds(data.itemsBought),
          getProductsByIds(data.unSoldItems),
        ]);
        setItemsSold(sold as Products[]);
        setItemsBought(bought);
        setUnsoldItems(unsold);
      } catch (error) {
        console.error("Failed to fetch user info or product data:", error);
      }
    };

    fetchUserInfo();
  }, [firebaseUid]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <SideNav
        currentPath={`/user-profile/${user.firebaseUid}`}
        onNavigate={() => {}}
        onMessageClick={() => setIsMessagingOpen((prev) => !prev)}
      />
      <div className="flex-1 p-4 overflow-auto w-full">
        <Card className="w-full h-full flex flex-col">
          <CardHeader>
            <div
              className="relative h-40 bg-cover bg-center rounded-t-lg"
              style={{ backgroundImage: `url('/background.jpg')` }}
            >
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4 flex justify-center">
                <Avatar>
                  <AvatarImage src={user.avatarLink} alt={user.username} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">{user.username}</h2>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-400">
                    Total Points: {user.totalPoints}
                  </p>
                  <p className="text-sm text-gray-400">
                    Total Barters: {user.totalBarters}
                  </p>
                  <Rating value={user.userRatings} />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">
                  Location: {user.latitude}, {user.longitude}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 h-full">
              <div className="overflow-auto">
                <h3 className="text-lg font-bold">Items Sold</h3>
                {itemsSold.map((product) => (
                  <div key={product._id} className="">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              <div className="overflow-auto">
                <h3 className="text-lg font-bold">Items Bought</h3>
                {itemsBought.map((product) => (
                  <div key={product._id} className="">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              <div className="overflow-auto">
                <h3 className="text-lg font-bold">Unsold Items</h3>
                {unSoldItems.map((product) => (
                  <div key={product._id} className="">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {isMessagingOpen && (
        <div className="fixed inset-0 pointer-events-none z-50 flex justify-end items-end p-4">
          <div className="pointer-events-auto">
            {user && (
              <MessagingWidget
                userId={user.firebaseUid}
                onClose={() => setIsMessagingOpen(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;