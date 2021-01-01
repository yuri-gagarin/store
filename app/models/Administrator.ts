import mongoose, { Document, Schema } from "mongoose";
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
  [key: string]: any;
  firstName: string;
  lastName: string;
  fullName: string;
  handle?: string;
  email: string;
  birthDate?: string;
  password: string;
  avatarImage?: AvatarImage;
  adminLevel: EAdminLevel;
  adminAccountId?: mongoose.Types.ObjectId;
  businessAccountId?: mongoose.Types.ObjectId;
  storesManaged: (StoreRef | IStore)[];
  approved: boolean;
  createdAt: Date;
  editedAt: Date;
  lastLogin?: Date;
};

// custom validators //
function adminHandleValidator(handle: string): Promise<boolean> {
  return mongoose.models["Administrator"].findOne({ handle: handle }).exec()
    .then((admin: IAdministrator) => {
      if (admin) {
        return false;
      } else {
        return true;
      }
    })
    .catch((err: Error) => {
      throw err;
    });
};

function adminEmailValidator(email: string): Promise<boolean> {
  return mongoose.models["Administrator"].findOne({ email: email }).exec()
    .then((admin: IAdministrator) => {
      if (admin) {
        return false;
      } else {
        return true;
      }
    })
    .catch((err) => {
      throw err;
    });
};


const AdministratorSchema: Schema = new Schema({
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
    required: false,
    validate: {
      validator: adminHandleValidator,
      message: "Someone is already using this handle"
    }
  },
  email: {
    type: String,
    required: true,
    index: true,
    validate: {
      validator: adminEmailValidator,
      message: "An account with this email already exists"
    }
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
    default: EAdminLevel.Moderator
  },
  businessAccountId: {
    type: Schema.Types.ObjectId, 
    ref: "BusinessAccount",
    default: null
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
    default: false
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
});
/*
AdministratorSchema.pre("validate", function(this: IAdministrator, next) {
  if (!this.approved) {
    this.approved = false;
  }
  next();
});
*/

export default mongoose.model<IAdministrator>("Administrator", AdministratorSchema);