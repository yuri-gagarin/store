import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import { respondWithDBError, respondWithInputError } from "./helpers/controllerHelpers";
import { IGenericAuthController } from "./helpers/controllerInterfaces";

type ValidationResponse = {
  valid: boolean;
  errorMessages: string[];
}
const validateNewUser = (data: UserData): ValidationResponse => {
  const validationRes: ValidationResponse = {
    valid: true,
    errorMessages: []
  }
  const { firstName, lastName, email, password, passwordConfirm }  = data;
  // validate first name //
  if (!firstName) {
    validationRes.valid = false;
    validationRes.errorMessages.push("A first name is required");
  }
  // validate last name //
  if (!lastName) {
    validationRes.valid = false;
    validationRes.errorMessages.push("A last name is required");
  }
  // validate email //
  if (!email) {
    validationRes.valid = false;
    validationRes.errorMessages.push("An email is required");
  }
  if(!password) {
    validationRes.valid = false;
    validationRes.errorMessages.push("A password is required");
  }
  if(!passwordConfirm) {
    validationRes.valid = false;
    validationRes.errorMessages.push("A password confirmation is required");
  }
  if (password && passwordConfirm) {
    if (passwordConfirm !== passwordConfirm) {
      validationRes.valid = false;
      validationRes.errorMessages.push("Your passwords do not match");
    }
  }
  return validationRes
}
export type UserData = {
  firstName: string;
  lastName: string;
  handle?: string;
  email: string;
  birthDate?: string;
  password: string;
  passwordConfirm: string;
}
type UserControllerRes = {
  responseMsg: string;
  messages?: string[];
  user?: IUser;
  deletedUser?: IUser;
  editedUser?: IUser;
  error?: Error;
}
type UserParams = {
  userId: string;
}
class UserController implements IGenericAuthController {
  register(req: Request<{}, {}, UserData>, res: Response<UserControllerRes>): Promise<Response> {
    const userData: UserData = req.body;
    // validate correct input //
    const { valid, errorMessages } = validateNewUser(req.body);
    // respond with invalid 400 if bad user input //
    if (!valid) {
      respondWithInputError(res, "User input error", 422, errorMessages);
    }
    
    return User.create({ ...userData })
      .then((user) => {
        return res.status(200).json({
          responseMsg: `Welcome ${user.firstName}`,
          user: user
        })
      })
      .catch((err) => {
        return respondWithDBError(res, err);
      });
  }

  editRegistration(req: Request<UserParams, {}, UserData>, res: Response<UserControllerRes>) {
    const userData: UserData = req.body;
    const { userId } = req.params;
    // validate correct input //
    const { valid, errorMessages } = validateNewUser(userData);
    // respond with invalid 422 if bad user input //
    if (!valid) {
      respondWithInputError(res, "User input error", 422, errorMessages);
    }

    return User.findOneAndUpdate({ _id: userId }, userData, { new: true })
      .then((updatedUser) => {
        if (updatedUser) {
          return res.status(200).json({
            responseMsg: `Updated user ${updatedUser.firstName}`,
            editedUser: updatedUser
          });
        } else {
          return respondWithInputError(res, "Could not find user to update", 404)
        }
      })
      .catch((err) => {
        return respondWithDBError(res, err);
      });
  }

  deleteRegistration(req: Request, res: Response<UserControllerRes>): Promise<Response> {
    const { userId } = req.params;
    if (!userId) {
      respondWithInputError(res, "Cant resolve User to delete", 422, []);
    }

    return User.findOneAndDelete({ _id: userId })
      .then((deletedUser) => {
        if (deletedUser) {
          return res.status(200).json({
            responseMsg: `Deleted user: ${deletedUser.firstName}`,
            deletedUser: deletedUser
          });
        } else {
          return res.status(404).json({
            responseMsg: `An error occured`,
            messages: [`Could not delete find the user`]
          });
        }
      })
      .catch((error) => {
        return respondWithDBError(res, error)
      });
  }
  login(req: Request, res: Response) {
    return Promise.resolve(res)
  }
  logout(req: Request, res: Response) {
    return Promise.resolve(res)
  }
}