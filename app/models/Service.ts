import mongoose, { Document, Schema } from "mongoose";

type ServicePictureRef = Schema.Types.ObjectId;

interface IService extends Document {
  name: string;
  description: string;
  price: string;
  images: ServicePictureRef[];
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