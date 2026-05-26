import mongoose from 'mongoose';

const productImageSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    unit: { type: String, default: 'kg' },
    image: { type: productImageSchema, default: () => ({}) },
    stockQty: { type: Number, default: 0, min: 0 },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.pre('save', function syncStock() {
  this.inStock = this.stockQty > 0;
});

export const Product = mongoose.model('Product', productSchema);
