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
  stroreId: {
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
    required: true
  },
  price: {
    type: String,
    required: true
  },
  categories: {
    type: Array,
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