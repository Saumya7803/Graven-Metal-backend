import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    subject: { type: String, default: '', trim: true, maxlength: 180 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied', 'archived'],
      default: 'unread',
      index: true,
    },
    adminNotes: { type: String, default: '', trim: true, maxlength: 1000 },
    repliedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Contact = mongoose.model('Contact', contactSchema);
