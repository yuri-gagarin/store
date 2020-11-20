import mongoose, { Document, Schema, Model } from "mongoose";
import { IAdministrator } from "./Administrator";
import { IStore } from "./Store";

enum AccountLevel {
  Standard,
  Professional,
  Elite
}
export interface IAdminAccount extends Document {
  adminAccounts: (mongoose.Types.ObjectId | IAdministrator)[];
  stores: (mongoose.Types.ObjectId | IStore)[];
  accountLevel: AccountLevel;
  createdAt: Date;
  editedAt: Date; 
}
const AdminAccountSchema = new Schema({
  adminAccounts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Administrator"
    },
  ],
  linkedStores: [
    {
      type: Schema.Types.ObjectId,
      ref: "Store"
    }
  ],
  linkedServices: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product"
    }
  ],
  accountLevel: {
    type: AccountLevel,
    required: true,
    default: AccountLevel.Standard
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(Date.now())
  },
  editedAt: {
    type: Date,
    required: true,
    default: new Date(Date.now())
  }
});

export default mongoose.model<IAdminAccount>("AdminAccount", AdminAccountSchema);