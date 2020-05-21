import mongoose, { Schema, Document } from "mongoose";

interface IProductPicture extends Document {
  description?: string;
  url: string;
  fileName: string;
  imagePath: string;
  absolutePath: string;
  createdAt: Date;
  editedAt?: Date;
}

const ProductPictureSchema: Schema = new Schema({
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

export default mongoose.model<IProductPicture>("ProductPicture", ProductPictureSchema);