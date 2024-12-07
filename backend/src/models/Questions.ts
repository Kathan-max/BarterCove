import mongoose, { Document, Schema } from 'mongoose';
import { Questions } from '../types';

// Define the schema for a question option
const QuestionOptionSchema = new Schema({
  text: {  // Match with the field name in JSON
    type: String,
    required: true,
  },
  score: {  // Match with the field name in JSON
    type: Number,
    required: true,
  },
});

// Define the schema for a question
const QuestionSchema = new Schema<Questions & Document>({
  category: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: false, // Optional for category-level questions
  },
  questionText: {  // Renamed from 'question' to 'questionText'
    type: String,
    required: true,
  },
  options: {
    type: [QuestionOptionSchema],
    required: true,
  },
});

// Create and export the model, explicitly specifying the collection name 'Questions'
export const QuestionModel = mongoose.model<Questions & Document>('Questions', QuestionSchema);
