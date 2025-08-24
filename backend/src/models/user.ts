import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "admin" | "guest";
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "guest"], default: "guest" },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", UserSchema);
export default UserModel;
