import { Schema, model, Document, Types } from "mongoose";

export interface IWishlistItem extends Document {
  product: Types.ObjectId;
  addedAt: Date;
  purchasedAt?: Date;
  purchasedBy?: string;
  proposed?: boolean;
}

const WishlistItemSchema = new Schema<IWishlistItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    addedAt: { type: Date, default: Date.now },
    purchasedAt: Date,
    purchasedBy: String,
    proposed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const WishlistItemModel = model<IWishlistItem>(
  "WishlistItem",
  WishlistItemSchema
);
export default WishlistItemModel;
