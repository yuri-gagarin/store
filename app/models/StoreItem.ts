import mongoose, { Document, Schema } from "mongoose";
import { IStoreItemImage } from "./StoreItemImage";
type StoreItemImgRef = mongoose.Types.ObjectId;

export interface IStoreItem extends Document {
  storeId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  details: string;
  price: string;
  categories: string[];
  images: (StoreItemImgRef | IStoreItemImage )[];
  createdAt: Date;
  editedAt?: Date;
}

const StoreItemSchema: Schema = new Schema({
  storeId: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "Store"
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
    type: String,
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