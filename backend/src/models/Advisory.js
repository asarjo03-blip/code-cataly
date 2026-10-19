import mongoose from 'mongoose';

const advisorySchema = new mongoose.Schema(
  {
    seedKey: { type: String, unique: true, sparse: true },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    category: {
      type: String,
      enum: ['pest', 'disease', 'soil', 'storage', 'general'],
      required: true,
      index: true,
    },
    crop: { type: String, default: null, lowercase: true, trim: true, index: true },
    language: { type: String, default: 'en', trim: true },
    summary: { type: String, required: true, trim: true, maxlength: 500 },
    body: { type: String, required: true, trim: true, maxlength: 10000 },
    published: { type: Boolean, default: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

advisorySchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.seedKey;
    delete ret.author;
    delete ret.__v;
  },
});

export const Advisory = mongoose.model('Advisory', advisorySchema);
