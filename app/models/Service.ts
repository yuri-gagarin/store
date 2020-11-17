import mongoose, { Document, Schema } from "mongoose";
import { IServiceImage } from "./ServiceImage";


export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  images: (IServiceImage | mongoose.Types.ObjectId)[];
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
    type: Number,
    required: true
  },
  images: [
    { type: Schema.Types.ObjectId, ref: "ServiceImage" }
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