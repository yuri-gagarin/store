import mongoose, { Document, Schema } from "mongoose";
import { IBusinessAccount } from "./BusinessAccount";
import { IStoreItemImage } from "./StoreItemImage";
type StoreItemImgRef = mongoose.Types.ObjectId;

export interface IStoreItem extends Document {
  businessAccountId: (mongoose.Types.ObjectId | IBusinessAccount);
  storeId: mongoose.Types.ObjectId;
  storeName: string;
  name: string;
  description: string;
  details: string;
  price: number;
  categories: string[];
  images: (StoreItemImgRef | IStoreItemImage )[];
  createdAt: Date;
  editedAt?: Date;
}

const StoreItemSchema: Schema = new Schema({
  businessAccountId: {
    type: Schema.Types.ObjectId,
    ref: "BusinessAccount",
    required: true
  },
  storeId: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "Store"
  },
  storeName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true
  },
  categories: {
    type: Array,
    required: true
  },
  images: [
    { type: Schema.Types.ObjectId, ref: "StoreItemImage" }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  editedAt: {
    type: Date
  }
});

export default mongoose.model<IStoreItem>("StoreItem", StoreItemSchema);