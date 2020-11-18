import { IGenericAuthController } from "./helpers/controllerInterfaces";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { respondWithDBError, respondWithGeneralError, respondWithInputError } from "./helpers/controllerHelpers";
import Administrator, { IAdministrator } from "../models/Administrator";
import { resolve } from "path";
import jsonWebToken from "jsonwebtoken";
import passportJwt, { StrategyOptions } from "passport-jwt";
const { ExtractJwt, Strategy: JWTStrategy } = passportJwt;


const opts: StrategyOptions = {
  jwtFromRequest:  ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "somethingdumbhere",
  issuer: "we@us.com",
  audience: "ouradress.net"
};

const issueJWT = (user: IAdministrator) => {
  const _id: string  = user._id;
  const expiresIn = "1d";
  const payload = { 
    sub: _id,
    iat: Date.now()
  };

  const signedToken = jsonWebToken.sign(payload, <string>opts.secretOrKey, { expiresIn: expiresIn });
  return {
    token: `Beared ${signedToken}`,
    expires: expiresIn
  }
}

type AdminData = {
  firstName: string;
  lastName: string;
  handle?: string;
  email: string;
  phoneNumber?: string;
  birthdate?: string;
  oldPassword?: string;
  password: string;
  passwordConfirm: string;
}
type AdminLoginRequest = {
  email: string;
  password: string;
}
type AdminParams = {
  adminId: string;
}
type AdminControllerRes = {
  responseMsg: string;
  newAdmin?: IAdministrator;
  editedAdmin?: IAdministrator;
  deletedAdmin?: IAdministrator;
  success?: boolean;
  jwtToken?: {
    token: string;
    expiresIn: string;
  },
  error?: Error;
}
type ValidationResponse = {
  valid: boolean;
  errorMessages: string[]
}
const validateNewAdmin = (data: AdminData): ValidationResponse => {
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
class AdminsController implements IGenericAuthController {
  register(req: Request<{}, {}, AdminData>, res: Response<AdminControllerRes>): Promise<Response> {
    const saltRounds = 10;
    const adminData: AdminData = req.body;
    // validate correct input //
    const { valid, errorMessages } = validateNewAdmin(adminData);
    if (!valid) {
      return respondWithInputError(res, "User input error", 422, errorMessages);
    }
    const { password } = adminData;
    return bcrypt.hash(password, saltRounds)
      .then((passwordHash) => {
        return Administrator.create({
          ...adminData,
          password: passwordHash,
          approved: false
        })
        .then((newAdmin) => {
          return res.status(200).json({
            responseMsg: "Administrator account created but not yet approved",
            newAdmin: newAdmin
          });
        })
        .catch((err) => {
          return respondWithDBError(res, err);
        })
      })
      .catch((error) => {
        return respondWithGeneralError(res, error.message, 500);
      })
  }
  editRegistration(req: Request<{}, {}, AdminData>, res: Response): Promise<Response> {
    const saltRounds = 10;
    const adminData: AdminData = req.body;
    const { adminId } = req.params as AdminParams;
    // validate correct input /
    const { valid, errorMessages } = validateNewAdmin(adminData);
    if (!adminData.oldPassword) {
      return respondWithInputError(res, "Must enter old password to make changes", 401);
    }
    // validate old password first //
    if (!valid) {
      return respondWithInputError(res, "User input error", 422, errorMessages);
    }
    const { oldPassword } = adminData;
    return Administrator.findOne({ _id: adminId })
      .then((foundAdmin) => {
        if (!foundAdmin) {
          respondWithGeneralError(res, "Could not resolve admin to edit", 400);
        } else {
          // compare passwords //
          return bcrypt.compare(oldPassword, foundAdmin.password)
        }
      })
      .then((success) => {
        if (success) {
          return bcrypt.hash(adminData.password, saltRounds)
            .then((value) => {
              return Administrator.findOneAndUpdate({ _id: adminId }, { ...adminData, password: value }, { new: true });
            })
            .then((updatedAdmin) => {
              if (updatedAdmin) {
                return res.status(200).json({
                  responseMsg: `Administrator ${updatedAdmin.fullName} successfuly updated`,
                  editedAdmin: updatedAdmin
                });
              } else {
                return respondWithGeneralError(res, "Couldnt resolve administrator", 404);
              }
            })
            .catch((err) => {
              return respondWithGeneralError(res, "Couldn't update administrator", 500);
            })
        } else {
          return respondWithInputError(res, "Your old password is incorrect", 401);
        }
      })
      .catch((err) => {
        return respondWithGeneralError(res, "Coundnt reslove an Admin", 404);
      })
  }
  deleteRegistration(req: Request<{}, {} >, res: Response): Promise<Response> {
    const { adminId } = req.params as AdminParams;
    const admin: IAdministrator = req.user as IAdministrator;

    if (!adminId) {
      return respondWithInputError(res, "Could resolve a user id", 422);
    }
    if (String(admin._id) !== adminId) {
      return respondWithInputError(res, "Not Allowed to delete another admin", 401);
    }
    return Administrator.findOneAndDelete({ _id: adminId })
      .then((deletedAdmin) => {
        if (deletedAdmin) {
          return res.status(200).json({
            responseMsg: `Deleted admin ${deletedAdmin.fullName}`,
            deletedAdmin: deletedAdmin
          });
        } else {
          return respondWithGeneralError(res, "Couldn't resolve an admin to delete", 404);
        }
      })
      .catch((err) => {
        return respondWithDBError(res, err);
      })
  }
  login(req: Request<{}, {}, AdminLoginRequest>, res: Response<AdminControllerRes>): Promise<Response> {
    const { email, password } = req.body;
    if (!email || !password) {
      return respondWithInputError(res, "Email and password are required", 422);
    }
    // find admin, verify password //
    return Administrator.findOne({ email: email })
      .then((foundAdmin) => {
        if (foundAdmin) {
          return bcrypt.compare(password, foundAdmin.password)
            .then((success) => {
              if (success) {
                const { token, expires } = issueJWT(foundAdmin);
                return res.status(200).json({
                  responseMsg: `Welcome back ${foundAdmin.fullName}`,
                  success: true,
                  jwtToken: {
                    token: token,
                    expiresIn: expires
                  }
                });
              } else {
                return respondWithInputError(res, "Wrong password", 401);
              }
            })
            .catch((err) => {
              return respondWithGeneralError(res, err.message, 500);
            })
        } else {
          // admin was not found //
          return respondWithGeneralError(res, "No user found", 404);
        }
      })
      .catch((err) => {
        return respondWithDBError(res, err);
      })
  }
  logout(req: Request, res: Response): Promise<Response> {
    return Promise.resolve(res);
  }
}