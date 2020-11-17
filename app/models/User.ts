import mongoose, { Document, Schema } from "mongoose";

enum MemberLevel {
  Rookie,
  Veteran,
  Pro,
  Elite
}
export interface IUser extends Document {
  name: string;
  lastName: string;
  handle?: string;
  email: string;
  birthDate: string;
  password: string;
  registered: Date;
  lastLogin?: Date;
  membershipLevel: MemberLevel;
};


const UserSchema: Schema = new Schema<IUser>({
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
  membershipLevel: {
    type: MemberLevel,
    required: true
  }
});

export default mongoose.model<IUser>("User", UserSchema);