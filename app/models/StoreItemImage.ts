import mongoose, { Schema, Document } from "mongoose";
import { IBusinessAccount } from "./BusinessAccount";
import { IStore } from "./Store";
import { IStoreItem } from "./StoreItem";

export interface IStoreItemImage extends Document {
  businessAccountId: (mongoose.Types.ObjectId | IBusinessAccount);
  storeItemId: (mongoose.Types.ObjectId | IStoreItem);
  parentStoreId?: (mongoose.Types.ObjectId | IStore);
  url: string;
  fileName: string;
  imagePath: string;
  absolutePath: string;
  description?: string;
  createdAt: Date;
  editedAt?: Date;
}

const StoreItemImageSchema: Schema = new Schema({
  businessAccountId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "BusinessAccount"
  },
  storeItemId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "StoreItem"
  },
  parentStoreId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "Store"
  },
  url: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  absolutePath: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  editedAt: {
    type: Date,
    required: false
  }
});

export default mongoose.model<IStoreItemImage>("StoreItemImage", StoreItemImageSchema);