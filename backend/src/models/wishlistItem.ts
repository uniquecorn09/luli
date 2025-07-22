import { Schema, model, Document, Types } from "mongoose";

export interface IWishlistItem extends Document {
  product: Types.ObjectId;
  addedAt: Date;
  purchasedAt?: Date;
  purchasedBy?: string;
}

const WishlistItemSchema = new Schema<IWishlistItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    addedAt: { type: Date, default: Date.now },
    purchasedAt: Date,
    purchasedBy: String,
  },
  { timestamps: true }
);

export const WishlistItemModel = model<IWishlistItem>(
  "WishlistItem",
  WishlistItemSchema
);
export default WishlistItemModel;
