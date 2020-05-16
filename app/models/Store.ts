import mongoose, { Schema, Document } from "mongoose";

type IStorePictureRef = Schema.Types.ObjectId;

interface IStore extends Document {
  title: string;
  description: string;
  images: [IStorePictureRef];
  createdAt: Date;
  editedAt?: Date;
}

const StoreSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [
    {
      type: Schema.Types.ObjectId,
      ref: "StorePicture"
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  editedAt: {
    type: Date
  }
});

export default mongoose.model<IStore>('Store', StoreSchema);