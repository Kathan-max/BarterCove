import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI|| 'mongodb://localhost:27017/barter_cove';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI,{
            dbName: 'barter_cove'
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};