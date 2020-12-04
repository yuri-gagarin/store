import { IUser } from "../../../models/User";

// UserController login request body //
export type UserLoginReq = {
  email: string;
  password: string;
}
// expected UserData in request body //
export type UserData = {
  firstName: string;
  lastName: string;
  handle?: string;
  email: string;
  birthDate?: string;
  password: string;
  passwordConfirm: string;
  oldPassword?: string;
};
// general UsersController Response //
export type UserControllerRes = {
  responseMsg: string;
  messages?: string[];
  user?: IUser;
  newUser?: IUser;
  deletedUser?: IUser;
  editedUser?: IUser;
  error?: Error;
  jwtToken?: {
    token: string;
    expiresIn: string;
  }
  success?: boolean;
};
// general UserController Request params //
export type UserParams = {
  userId: string;
};