import mongoose from 'mongoose';
import { Products } from '../types';

const ProductSchema = new mongoose.Schema<Products>({
  productId: {
    type: String,
    required: true,
    trim: true
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
    enum: ['Electronics', 'Furniture', 'Clothing', 'Vehicles', 'Books', 'Sports', 'Toys', 'Other'],
  },
  productOwner: {
    type: String,
    required: true,
  },
  productScore: {
    type: Number,
    default: 0,
  },
  postalCode: {
    type: String,
    required: false, // Made optional with a default fallback
    default: '000000',
  },
  totalBids: {
    type: Number,
    default: 0,
  },
  imagePath: {
    type: String,
    default: '', // Optional for scenarios without file uploads
  },
  productStatus: {
    type: String,
    enum: ['unsold', 'sold'],
    default: 'unsold',
  },
  barterOptions: {
    type: [String],
    default: [],
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

export const ProductModel = mongoose.model<Products>('Products', ProductSchema);
