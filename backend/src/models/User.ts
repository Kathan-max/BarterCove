import mongoose from 'mongoose';
import { User } from '../types';

const userSchema = new mongoose.Schema<User>({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  pincode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  
}, {
  collection: 'User' // This explicitly sets the collection name
});

export const UserModel = mongoose.model<User>('User', userSchema);