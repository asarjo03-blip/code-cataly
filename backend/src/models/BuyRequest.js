import mongoose from 'mongoose';
import { REGIONS } from '../config/constants.js';

const buyRequestSchema = new mongoose.Schema(
  {
    seedKey: { type: String, unique: true, sparse: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    buyerName: { type: String, required: true, trim: true, maxlength: 120 },
    buyerPhone: { type: String, trim: true, maxlength: 40 },
    crop: { type: String, required: true, trim: true, lowercase: true, index: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, enum: ['kg', 'bag', 'crate'], default: 'kg' },
    offerPrice: { type: Number, required: true, min: 1 },
    region: { type: String, enum: Object.values(REGIONS), required: true, index: true },
    neededBy: { type: Date, default: Date.now },
    status: { type: String, enum: ['open', 'closed'], default: 'open', index: true },
    notes: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true },
);

buyRequestSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    ret.ownerId = String(ret.owner);
    delete ret._id;
    delete ret.owner;
    delete ret.seedKey;
    delete ret.__v;
  },
});

export const BuyRequest = mongoose.model('BuyRequest', buyRequestSchema);
