import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, enum: ['staple', 'cash', 'horticulture', 'tree'], required: true },
    seasons: { type: [String], default: [] },
    regions: { type: [String], default: [] },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

cropSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Crop = mongoose.model('Crop', cropSchema);
