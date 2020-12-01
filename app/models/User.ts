import mongoose, { Document, Mongoose, Schema } from "mongoose";

export enum MemberLevel {
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
  createdAt: Date;
  editedAt: Date;
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
    unique: true,
  },
  birthDate: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
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
  },
  membershipLevel: {
    type: MemberLevel,
    required: true,
    default: MemberLevel.Rookie
  }
});

UserSchema.pre("validate", function(this: IUser, next) {
  if (!this.membershipLevel) {
    this.membershipLevel = MemberLevel.Rookie;
  }
  next();
});
UserSchema.pre("validate", function(this: IUser, next) {
  if (!this.createdAt) {
    this.createdAt = new Date(Date.now());
  }
  next();
});
UserSchema.pre("validate", function(this: IUser, next) {
  if (!this.editedAt) {
    this.editedAt = new Date(Date.now());
  }
  next();
});
UserSchema.pre("validate", function(this: IUser, next) {
  if (!this.membershipLevel) {
    this.membershipLevel = MemberLevel.Rookie;
  }
  next();
});


UserSchema.pre("save", true, function(this: IUser, next, done) {
  let self = this;
  mongoose.models["User"].findOne({ email: this.email }, (err: Error, user: IUser) => {
    if (err) {
      done(err);
    } else if (user) {
      this.invalidate("email", "email must be unique");
      done(new Error("email must be unique"));
    } else {
      done();
    }
  });
  next();
});



export default mongoose.model<IUser>("User", UserSchema);