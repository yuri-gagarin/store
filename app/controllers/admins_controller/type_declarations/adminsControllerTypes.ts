import { IAdministrator } from "../../../models/Administrator";
// the data which is expected in request body on POST or PATCH requests //
export type AdminData = {
  firstName: string;
  lastName: string;
  handle?: string;
  email: string;
  newEmail?: string;
  phoneNumber?: string;
  birthdate?: string;
  oldPassword?: string;
  password: string;
  passwordConfirm: string;
};
// expected request body login data //
export type AdminLoginRequest = {
  email: string;
  password: string;
};
// admin params //
export type AdminParams = {
  adminId: string;
};
// generic AdminsController response object //
export type AdminControllerRes = {
  responseMsg: string;
  admin?: IAdministrator;
  newAdmin?: IAdministrator;
  editedAdmin?: IAdministrator;
  deletedAdmin?: IAdministrator;
  success?: boolean;
  jwtToken?: {
    token: string;
    expiresIn: string;
  },
  error?: Error;
  errorMessages?: string[];
};
