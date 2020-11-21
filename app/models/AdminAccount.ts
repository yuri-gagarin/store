import mongoose, { Document, Schema, Model } from "mongoose";
import { IAdministrator } from "./Administrator";
import { IProduct } from "./Product";
import { IService } from "./Service";
import { IStore } from "./Store";

export enum AccountLevel {
  Standard,
  Professional,
  Elite
}
export interface IAdminAccount extends Document {
  linkedAdmins: (mongoose.Types.ObjectId | IAdministrator)[];
  linkedStores: (mongoose.Types.ObjectId | IStore)[];
  linkedServices: (mongoose.Types.ObjectId | IService)[];
  linkedProducts: (mongoose.Types.ObjectId | IProduct)[];
  accountLevel: AccountLevel;
  createdAt: Date;
  editedAt: Date; 
}
const AdminAccountSchema = new Schema({
  linkedAdmins: [
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
      ref: "Service"
    }
  ],
  linkedProducts: [
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