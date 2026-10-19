import mongoose from 'mongoose';
import { REGIONS } from '../config/constants.js';

const alertSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['weather', 'pest', 'market'], required: true },
    severity: { type: String, enum: ['urgent', 'seasonal', 'info'], default: 'info' },
    region: { type: String, enum: Object.values(REGIONS), required: true, index: true },
    cropIds: { type: [String], default: [] },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    startsAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

alertSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.createdBy;
    delete ret.__v;
  },
});

export const Alert = mongoose.model('Alert', alertSchema);
