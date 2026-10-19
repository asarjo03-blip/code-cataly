import mongoose from 'mongoose';
import { REGIONS } from '../config/constants.js';

const marketSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    region: { type: String, enum: Object.values(REGIONS), required: true, index: true },
    location: { type: String, required: true, trim: true },
    marketDays: { type: [String], default: [] },
    cropsTraded: { type: [String], default: [] },
    note: { type: String, default: '' },
  },
  { timestamps: true },
);

marketSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = ret.slug;
    delete ret._id;
    delete ret.slug;
    delete ret.__v;
  },
});

export const Market = mongoose.model('Market', marketSchema);
