import mongoose, { Schema, Document } from "mongoose";

export interface IProductImage extends Document {
  businessAccountId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  description?: string;
  url: string;
  fileName: string;
  imagePath: string;
  absolutePath: string;
  createdAt: Date;
  editedAt?: Date;
}

const ProductImageSchema: Schema = new Schema({
  businessAccountId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    retquired: true
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

export default mongoose.model<IProductImage>("ProductImage", ProductImageSchema);