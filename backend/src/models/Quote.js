import mongoose from 'mongoose';

const quoteFileSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
    name: { type: String, default: '' },
    mimeType: { type: String, default: '' },
    size: { type: Number, default: 0 },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ['new', 'in_review', 'quoted', 'closed'], required: true },
    note: { type: String, default: '' },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false }
);

const quoteSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true },
    metal: { type: String, required: true, trim: true },
    requirement: { type: String, required: true },
    file: { type: quoteFileSchema, default: () => ({}) },
    status: { type: String, enum: ['new', 'in_review', 'quoted', 'closed'], default: 'new' },
    adminNotes: { type: String, default: '' },
    statusHistory: { type: [statusHistorySchema], default: [{ status: 'new', note: 'Quote submitted' }] },
  },
  { timestamps: true }
);

quoteSchema.virtual('fileUrl').get(function getFileUrl() {
  return this.file?.url || '';
});

quoteSchema.set('toJSON', { virtuals: true });
quoteSchema.set('toObject', { virtuals: true });

export const Quote = mongoose.model('Quote', quoteSchema);
