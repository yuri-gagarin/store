import mongoose, { Document, Schema } from "mongoose";
import { IProductImage } from "./ProductImage";
type ProductImgRef = mongoose.Types.ObjectId;

export interface IProduct extends Document {
  name: string;
  description: string;
  details: string;
  price: number;
  images: (ProductImgRef | IProductImage )[];
  createdAt: Date;
  editedAt?: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  details: {
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

export default mongoose.model<IProduct>("Product", ProductSchema);