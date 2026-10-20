import mongoose from 'mongoose';
import { LANGUAGES, REGIONS, ROLES } from '../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.FARMER,
      index: true,
    },
    phone: { type: String, trim: true, unique: true, sparse: true },
    region: {
      type: String,
      enum: Object.values(REGIONS),
      required: true,
    },
    village: { type: String, trim: true, maxlength: 120 },
    crops: { type: [String], default: [] },
    farmSizeHectares: { type: Number, min: 0, max: 1000 },
    farmingType: { type: String, enum: ['rainfed', 'irrigated'], default: 'rainfed' },
    language: { type: String, enum: LANGUAGES, default: 'en' },
    privacy: {
      showPhoneOnListings: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

userSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  },
});

export const User = mongoose.model('User', userSchema);
