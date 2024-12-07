import mongoose from 'mongoose';
import { User } from '../types';

const userSchema = new mongoose.Schema<User>({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  pincode: { type: String, required: true },
  // phoneNumber: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  latitude: { 
    type: Number, 
    default: 42.2959698476866,
    set: (v: string | number) => v === '' ? null : Number(v)
  },
  longitude: { 
    type: Number, 
    default: -83.01585001719441,
    set: (v: string | number) => v === '' ? null : Number(v)
  },
  friendIds: { type: [String], default: [] },
  totalBarters: {type: Number, default: 0},
  totalPoints: {type: Number, default: 0},
  avatarLink: {type: String, default: null},
  itemsSold: {type: [String], default: []},
  itemsBought: {type: [String], default: []},
  unSoldItems: {type: [String], default: []}, 
  createdAt: { type: Date, default: Date.now },
  userRatings: {type: Number, default: 0},
  isPhoneVerified: { type: Boolean, default: false}
}, {
  collection: 'User'
});

export const UserModel = mongoose.model<User>('User', userSchema);