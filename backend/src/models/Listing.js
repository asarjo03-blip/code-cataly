import mongoose from 'mongoose';
import { REGIONS } from '../config/constants.js';

const listingSchema = new mongoose.Schema(
  {
    seedKey: { type: String, unique: true, sparse: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmerName: { type: String, required: true, trim: true, maxlength: 120 },
    farmerPhone: { type: String, trim: true, maxlength: 40 },
    category: { type: String, enum: ['crop', 'livestock'], default: 'crop', index: true },
    crop: { type: String, required: true, trim: true, lowercase: true, index: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, enum: ['kg', 'bag', 'crate', 'head'], default: 'kg' },
    askingPrice: { type: Number, required: true, min: 1 },
    region: { type: String, enum: Object.values(REGIONS), required: true, index: true },
    village: { type: String, trim: true, maxlength: 120 },
    availableFrom: { type: Date, default: Date.now },
    status: { type: String, enum: ['open', 'closed', 'sold'], default: 'open', index: true },
    notes: { type: String, trim: true, maxlength: 1000 },
    image: { type: String, trim: true },
  },
  { timestamps: true },
);

listingSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    ret.ownerId = String(ret.owner);
    delete ret._id;
    delete ret.owner;
    delete ret.seedKey;
    delete ret.__v;
  },
});

export const Listing = mongoose.model('Listing', listingSchema);
