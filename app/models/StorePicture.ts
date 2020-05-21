import mongoose, { Schema, Document } from "mongoose";

export interface IStorePicture extends Document {
  description?: string;
  url: string;
  fileName: string;
  imagePath: string;
  absolutePath: string;
  createdAt: Date;
  editedAt?: Date;
}

const StorePictureSchema: Schema = new Schema({
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
/*
StorePictureSchema.virtual("images", {
  ref: "StoreImage",
  localField: "_id",
  foreignField: "StorePicture"
});
*/
export default mongoose.model<IStorePicture>("StorePicture", StorePictureSchema);