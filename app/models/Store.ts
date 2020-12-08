import mongoose, { Schema, Document } from "mongoose";
import { IBusinessAccount } from "./BusinessAccount";
import { IStoreImage } from "./StoreImage";
// custom validators //
import { validateBusinessAccount } from "./custom_validators/customValidators";

export interface IStore extends Document {
  businessAccountId:  (mongoose.Types.ObjectId | IBusinessAccount);
  title: string;
  description: string;
  images: (IStoreImage | mongoose.Types.ObjectId)[];
  numOfItems: number;
  createdAt: Date;
  editedAt?: Date;
}



const StoreSchema: Schema = new Schema({
  businessAccountId: {
    type: Schema.Types.ObjectId,
    ref: "BusinessAccount",
    required: true,
    validate: {
      validator: validateBusinessAccount,
      message: "A 'BusinessAccount' is required to create a new 'Store'"
    }
  },
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
      ref: "StoreImage"
    }
  ],
  numOfItems: {
    type: Number,
    required: true,
    default: 0
  },
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