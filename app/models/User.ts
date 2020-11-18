import mongoose, { Document, Schema } from "mongoose";

enum MemberLevel {
  Rookie,
  Veteran,
  Pro,
  Elite
}
export interface IUser extends Document {
  firstName: string;
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
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
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

UserSchema.pre("validate", function(this: IUser, next) {
  if (!this.membershipLevel) {
    this.membershipLevel = MemberLevel.Rookie;
  }
  next();
});
UserSchema.pre("validate", function(this: IUser, next) {
  if (!this.registered) {
    this.registered = new Date(Date.now());
  }
  next();
})

export default mongoose.model<IUser>("User", UserSchema);