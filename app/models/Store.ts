import mongoose, { Schema, Document } from "mongoose";
import { IStorePicture } from "./StorePicture";
type IStorePictureRef = mongoose.Types.ObjectId | IStorePicture;

export interface IStore extends Document {
  title: string;
  description: string;
  images: IStorePictureRef[];
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