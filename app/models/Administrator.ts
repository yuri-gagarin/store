import mongoose, { Document, Schema, Model } from "mongoose";
import { IStore } from "./Store";

export enum EAdminLevel {
  Moderator,
  Administrator,
  Owner
}
type AvatarImage = {
  url: string;
  fileName: string;
  absolutePath: string;
  imagePath: string;
}
type StoreRef = mongoose.Types.ObjectId;
export interface IAdministrator extends Document {
  firstName: string;
  lastName: string;
  fullName: string;
  handle?: string;
  email: string;
  birthDate: string;
  password: string;
  avatarImage?: AvatarImage;
  adminLevel: EAdminLevel;
  adminAccountId?: mongoose.Types.ObjectId;
  storesManaged: (StoreRef | IStore)[];
  approved: boolean;
  createdAt: Date;
  editedAt: Date;
  lastLogin?: Date;
};


const AdministratorSchema: Schema = new Schema<IAdministrator>({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  handle: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  birthDate: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  adminLevel: {
    type: EAdminLevel,
    required: true,
    default: EAdminLevel.Administrator
  },
  storesManaged: [
    {
      type: Schema.Types.ObjectId, ref: "Store"
    }
  ],
  avatarImage: {
    url: {
      type: String
    },
    fileName: {
      type: String
    },
    absolutePath: {
      type: String
    },
    imagePath: {
      type: String
    }
  },
  approved: {
    type: Boolean,
    required: true,
    defaul: false
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(Date.now())
  },
  editedAt: {
    type: Date,
    required: true,
    default: new Date(Date.now())
  },
  lastLogin: {
    type: Date,
    required: false
  }
});

AdministratorSchema.virtual("fullName").get(function(this: IAdministrator) {
  return this.firstName + this.lastName;
})
export default mongoose.model<IAdministrator>("Administrator", AdministratorSchema);