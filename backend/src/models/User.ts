import mongoose from 'mongoose';
import { User } from '../types';

const userSchema = new mongoose.Schema<User>({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  pincode: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  isPhoneVerified: { type: Boolean, default: false }
}, {
  collection: 'User'
});

export const UserModel = mongoose.model<User>('User', userSchema);