// @ts-nocheck
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  apiKey: { type: String, required: true, unique: true, index: true, select: false },
  isActive: { type: Boolean, default: true }, 
  
  // Role-based access control field
  role: { 
    type: String, 
    enum: ['user', 'admin', 'super_admin'], 
    default: 'user',
    index: true 
  },
}, { timestamps: true });

// hot-reload এ "Cannot overwrite model" error এড়ানোর জন্য এই চেক জরুরি
export const User = mongoose.models?.User || mongoose.model('User', userSchema);
