export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface User {
  firebaseUid: string;
  email: string; // got from the registration
  username: string; // got from the registration
  pincode: string; // got from the registration
  phoneNumber: string; // got from the registration
  latitude: string | number; // initialized to null
  longitude: string | number; // initialized to null
  friendIds: string[]; // initialized to []
  totalBarters: number; // initialized to 0
  totalPoints: number; // initialized to 0
  avatarLink: string; // initialized to ''
  itemsSold: string[]; // initialized to []
  itemsBought: string[]; // initialized to []
  unSoldItems: string[]; // initialized to []
  createdAt: Date;
  userRatings: number;
  isPhoneVerified?: boolean;
}

export interface Questions {
  category: string;
  productName?: string; // Optional for category-level questions
  questionText: string; // Renamed from 'question' to 'questionText'
  options: QuestionOption[];
}

// Interface for Question Option
export interface QuestionOption {
  text: string;  // Renamed from 'option' to 'text'
  score: number; // Renamed from 'value' to 'score'
}

// Interface for Product
export interface Products {
  _id?: string; // Optional for new products
  productId: string;
  productName: string;
  productDescription: string;
  productCategory: string;
  productOwner: string; // User ID or email
  productScore: number;
  postalCode: string;
  totalBids: number;
  imagePath: string;
  productStatus: 'unsold' | 'sold' | 'pending';
  barterOptions: string[];
  latitude: number;
  longitude: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Product Creation DTO (Data Transfer Object)
export interface ProductCreationDTO {
  productName: string;
  productDescription: string;
  productCategory: string;
  productScore: number;
  imagePath: string;
}

// Enum for Product Categories
export enum ProductCategory {
  Electronics = 'Electronics',
  Furniture = 'Furniture',
  Clothing = 'Clothing',
  Other = 'Other'
}
