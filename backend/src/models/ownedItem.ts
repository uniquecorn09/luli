import { Schema, model, Document, Types } from "mongoose";

export interface IOwnedItem extends Document {
  product: Types.ObjectId;
  acquiredAt: Date;
  pending?: boolean;
}

const OwnedItemSchema = new Schema<IOwnedItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    acquiredAt: { type: Date, default: Date.now },
    pending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const OwnedItemModel = model<IOwnedItem>("OwnedItem", OwnedItemSchema);
export default OwnedItemModel;
