import axios from 'axios';
import { getAuth } from 'firebase/auth';

axios.defaults.baseURL = 'http://localhost:3000'; // Set your backend server's base URL

interface LocationUpdate {
  latitude: number;
  longitude: number;
}
interface Userinfo_ {
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

export const getUserInfo = async (firebaseId: string):  Promise<Userinfo_> => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    const idToken = await currentUser.getIdToken();

    const response = await axios.get(`/api/users/${firebaseId}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    return response.data as Userinfo_;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

export const updateUserLocation = async (userId: string, location: LocationUpdate) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    const idToken = await currentUser.getIdToken();

    const response = await axios.patch(
      `/api/users/${userId}/location`,
      location,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error updating user location:', error);
    throw error;
  }
};

export const getCurrentLocation = (): Promise<LocationUpdate> => {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
};

export const updateUserUnSoldItems = async (firebaseId: string, productUuid: string) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    const idToken = await currentUser.getIdToken();

    // Making the API call to update the unsold items array
    const response = await axios.patch(
      `/users/unsold-items`,
      { userId: firebaseId, productUuid },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data; // Returns the updated user data
  } catch (error) {
    console.error('Error updating unsold items:', error);
    throw error;
  }
};