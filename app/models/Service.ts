import mongoose, { Document, Schema } from "mongoose";
import { IServicePicture } from "./ServicePicture";

type ServicePictureRef = mongoose.Types.ObjectId;

export interface IService extends Document {
  name: string;
  description: string;
  price: string;
  images: (ServicePictureRef | IServicePicture)[];
  createdAt: Date;
  editedAt?: Date;
}

const ServiceSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String
  },
  images: [
    { type: Schema.Types.ObjectId, ref: "ProductImage" }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  editedAt: {
    type: Date
  }
});

export default mongoose.model<IService>("Service", ServiceSchema);