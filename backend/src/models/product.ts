import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  tonieId: string;
  name: string;
  imageUrl?: string;
  productUrl?: string;
  availability: 'in_stock' | 'out_of_stock' | 'unknown';
  price?: number | string;
  lastSyncedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    tonieId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    imageUrl: String,
    productUrl: String,
    availability: {
      type: String,
      enum: ['in_stock', 'out_of_stock', 'unknown'],
      default: 'unknown',
    },
    price: Schema.Types.Mixed,
    lastSyncedAt: Date,
  },
  { timestamps: true }
);

export const ProductModel = model<IProduct>('Product', ProductSchema);
export default ProductModel; 