import mongoose, { Schema, Document } from "mongoose";

interface IStorePicture extends Document {
  description?: string;
  url: string;
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  editedAt: {
    type: Date,
    required: false
  }
});

export default mongoose.model<IStorePicture>("StorePicture", StorePictureSchema);