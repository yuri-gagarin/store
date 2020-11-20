import mongoose, { Document, Schema, Model } from "mongoose";
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
  firstName: string;
  lastName: string;
  fullName: string;
  handle?: string;
  email: string;
  birthDate: string;
  password: string;
  avatarImage?: AvatarImage;
  adminLevel: AdminLevel;
  adminAccountId?: mongoose.Types.ObjectId;
  storesManaged: (StoreRef | IStore)[];
  approved: boolean;
  registered: Date;
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
    type: AdminLevel,
    required: true,
    default: AdminLevel.Administrator
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
    required: true
  },
  registered: {
    type: Date,
    required: true
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