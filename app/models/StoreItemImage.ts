import mongoose, { Schema, Document } from "mongoose";

export interface IStoreItemImage extends Document {
  description?: string;
  storeItemId: mongoose.Types.ObjectId;
  url: string;
  fileName: string;
  imagePath: string;
  absolutePath: string;
  createdAt: Date;
  editedAt?: Date;
}

const StoreItemImageSchema: Schema = new Schema({
  description: {
    type: String,
    required: false
  },
  storeItemId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "StoreItem"
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

export default mongoose.model<IStoreItemImage>("StoreItemImage", StoreItemImageSchema);