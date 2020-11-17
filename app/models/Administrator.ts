import mongoose, { Document, Schema } from "mongoose";
import { IStore } from "./Store";

enum AdminLevel {
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
  name: string;
  lastName: string;
  handle?: string;
  email: string;
  birthDate: string;
  password: string;
  registered: Date;
  lastLogin?: Date;
  avatarImage?: AvatarImage;
  membershipLevel: AdminLevel;
  storesManaged: (StoreRef | IStore)[];
};


const AdministratorSchema: Schema = new Schema<IAdministrator>({
  name: {
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
  registered: {
    type: Date,
    required: true
  },
  lastLogin: {
    type: Date,
    required: false
  },
  adminLevel: {
    type: AdminLevel,
    required: true
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
  }
});

export default mongoose.model<IAdministrator>("Administrator", AdministratorSchema);