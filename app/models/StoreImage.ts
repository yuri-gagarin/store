import mongoose, { Schema, Document } from "mongoose";
import { IBusinessAccount } from "./BusinessAccount";

export interface IStoreImage extends Document {
  //_id: Schema.Types.ObjectId;
  description?: string;
  businessAccountId: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  url: string;
  fileName: string;
  imagePath: string;
  absolutePath: string;
  createdAt: Date;
  editedAt?: Date;
}

const StoreImageSchema: Schema = new Schema({
  description: {
    type: String,
    required: false
  },
  businessAccountId: {
    type: Schema.Types.ObjectId,
    required: true,
    indexe: true
  },
  storeId: {
    type: Schema.Types.ObjectId,
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  editedAt: {
    type: Date,
    required: false
  }
});
/*
StorePictureSchema.virtual("images", {
  ref: "StoreImage",
  localField: "_id",
  foreignField: "StorePicture"
});
*/
export default mongoose.model<IStoreImage>("StoreImage", StoreImageSchema);