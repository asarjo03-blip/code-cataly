import mongoose from 'mongoose';

const marketPriceSchema = new mongoose.Schema(
  {
    seedKey: { type: String, unique: true, sparse: true },
    crop: { type: String, required: true, lowercase: true, trim: true, index: true },
    marketId: { type: String, required: true, index: true },
    pricePerKg: { type: Number, required: true, min: 1 },
    previousPrice: { type: Number, required: true, min: 1 },
    source: { type: String, trim: true, maxlength: 120 },
    note: { type: String, trim: true, maxlength: 1000 },
    recordedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

marketPriceSchema.index({ crop: 1, marketId: 1, recordedAt: -1 });
marketPriceSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.seedKey;
    delete ret.__v;
  },
});

export const MarketPrice = mongoose.model('MarketPrice', marketPriceSchema);
