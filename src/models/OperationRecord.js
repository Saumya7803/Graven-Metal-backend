import mongoose from 'mongoose';

const operationNoteSchema = new mongoose.Schema(
  {
    note: { type: String, required: true, trim: true, maxlength: 2000 },
    authorName: { type: String, default: '', trim: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: true }
);

const operationRecordSchema = new mongoose.Schema(
  {
    team: { type: String, enum: ['procurement', 'sales', 'lqt'], required: true, index: true },
    module: {
      type: String,
      enum: [
        'supplier-management',
        'price-requests',
        'vendor-comparison',
        'cost-analysis',
        'purchase-orders',
        'availability-tracking',
        'procurement-reports',
        'supplier-communication',
        'customer-management',
        'sales-reports',
      ],
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    owner: { type: String, default: '', trim: true, maxlength: 120 },
    detail: { type: String, default: '', trim: true, maxlength: 1000 },
    status: { type: String, default: 'open', trim: true, maxlength: 80, index: true },
    nextStep: { type: String, default: '', trim: true, maxlength: 300 },
    value: { type: String, default: '', trim: true, maxlength: 120 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    notes: { type: [operationNoteSchema], default: [] },
  },
  { timestamps: true }
);

export const OperationRecord = mongoose.model('OperationRecord', operationRecordSchema);
