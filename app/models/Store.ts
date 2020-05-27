import mongoose, { Schema, Document } from "mongoose";
import { IStorePicture } from "./StorePicture";
type IStorePictureRef = Schema.Types.ObjectId 

export interface IStore extends Document {
  title: string;
  description: string;
  images: (IStorePicture | mongoose.Types.ObjectId)[];
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
const Store = mongoose.model<IStore>('Store', StoreSchema);
export default Store;