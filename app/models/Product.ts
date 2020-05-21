import mongoose, { Document, Schema } from "mongoose";

type StorePictureRef = Schema.Types.ObjectId;

interface IPRoduct extends Document {
  title: string;
  description: string;
  price: string;
  images: StorePictureRef[];
  createdAt: Date;
  editedAt?: Date;
}

const ProductSchema: Schema = new Schema({
  title: {
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

export default mongoose.model<IPRoduct>("Product", ProductSchema);