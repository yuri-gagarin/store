import mongoose, { Document, Schema } from "mongoose";
import { IAdministrator } from "./Administrator";
import { IProductImage } from "./ProductImage";
type ProductImgRef = mongoose.Types.ObjectId;

export interface IProduct extends Document {
  creatorId: (mongoose.Types.ObjectId | IAdministrator);
  name: string;
  description: string;
  details: string;
  price: number;
  images: (ProductImgRef | IProductImage )[];
  createdAt: Date;
  editedAt?: Date;
}

function validateBusinessAccount (businessAccountId: string) {
  if (!businessAccountId) {
    return false;
  }
  return true;
}
const ProductSchema: Schema = new Schema({
  businessAccountId: {
    type: Schema.Types.ObjectId, 
    ref: "BusinessAccount",
    required: true,
    validate: {
      validator: validateBusinessAccount,
      message: "A valid business account Id is requited to create a new product"
    }
  },
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
    default: new Date(Date.now()),
    required: true
  },
  editedAt: {
    type: Date
  }
});

export default mongoose.model<IProduct>("Product", ProductSchema);