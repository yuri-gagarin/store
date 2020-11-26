import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Administrator, { IAdministrator, EAdminLevel } from "../../models/Administrator";
// helpers and validators //
import { validateAdminModel } from "./helpers/validationHelpers";
import { respondWithGeneralError, respondWithInputError } from "../helpers/controllerHelpers";
import { issueJWT } from "../helpers/authHelpers";
import { checkDuplicateEmail } from "../helpers/controllerHelpers";
// type declrations //
import { IGenericAuthController } from "../helpers/controllerInterfaces";
import {
  AdminData, AdminParams, AdminLoginRequest, AdminControllerRes
} from "./type_declarations/adminsControllerTypes";

class ValidationError extends Error {
  public errorMessages: string[];
  public statusCode: number;
  constructor(errMessage: string, messages: string[], statusCode?: number) {
    super (errMessage);
    this.errorMessages = messages;
    this.statusCode = statusCode ? statusCode : 400;
  } 
};
class NotFoundError extends Error {
  public statusCode: number;
  constructor(errMessage: string, statusCode?: number) {
    super(errMessage);

    this.statusCode = statusCode ? statusCode : 404;
  }
};
class GeneralError extends Error {
  public statusCode: number;
  constructor(errMessage: string, statusCode?: number) {
    super(errMessage);
    this.statusCode = statusCode ? statusCode : 500;
  }
};
type ErrorResponse = {
  responseMsg: string;
  errorMessages?: string[]
  error: GeneralError;
}

type GenControllerError = (ValidationError | NotFoundError | GeneralError) & Error;
const processErrorResponse = (res: Response<ErrorResponse>, err: GenControllerError): Promise<Response> => {
  return Promise.resolve().then(() => {
    if (err instanceof ValidationError) {
      const { statusCode, errorMessages } = err; 
      return res.status(statusCode).json({
        responseMsg: "Validation error",
        errorMessages: errorMessages,
        error: err
      })
    } else if (err instanceof NotFoundError) {
      const { statusCode } = err;
      return res.status(statusCode).json({
        responseMsg: "Not found",
        errorMessages: [ err.message ],
        error: err
      })
    } else if (err instanceof GeneralError) {
      const { statusCode } = err;
      return res.status(statusCode).json({
        responseMsg: "An error occured",
        errorMessages: [ err.message ],
        error: err
      })
    } else {
      return res.status(500).json({
        responseMsg: "Something went wrong on our side",
        errorMessages: [ (err as Error).message ],
        error: err
      })
    }
  });
}


class AdminsController implements IGenericAuthController {
  register(req: Request<{}, {}, AdminData>, res: Response<AdminControllerRes>): Promise<Response> {
    const saltRounds = 10;
    const adminData: AdminData = req.body;
    // validate correct input //
    const { valid, errorMessages } = validateAdminModel(adminData);
    if (!valid) {
      return respondWithInputError(res, "User input error", 422, errorMessages);
    }
    const { email, password } = adminData;
    return checkDuplicateEmail(email, Administrator)
      .then((response) => {
        const { valid, errorMessages } = response;
        if (valid) {
          return bcrypt.hash(password, saltRounds)
        } else {
          throw new ValidationError("Registration error", errorMessages);
        }
      })
      .then((hashedPassword) => {
        return Administrator.create({
          ...adminData,
          password: hashedPassword,
          adminLevel: EAdminLevel.Administrator,
          approved: false,
          createdAt: new Date(Date.now())
        })
      })
      .then((createdAdmin) => {
        return res.status(200).json({
          responseMsg: "New administrator profile created, you will need to be approved",
          newAdmin: createdAdmin
        });
      })
      .catch((err) => {
        if (err instanceof ValidationError) {
          const { message, errorMessages, statusCode = 400 } = err;
          return respondWithInputError(res, message, statusCode, errorMessages);
        } else {
          return respondWithGeneralError(res, err.message, 500)
        }
      });
  }
  editRegistration(req: Request<{}, {}, AdminData>, res: Response<AdminControllerRes>): Promise<Response> {
    const saltRounds = 10;
    const adminData: AdminData = req.body;
    const { adminId } = req.params as AdminParams;
    let foundAdminData: IAdministrator;
     // validate old password first //
     if (!adminData.oldPassword) {
      return respondWithInputError(res, "Must enter old password to make changes", 401);
    }
    // validate correct input /
    const { valid, errorMessages } = validateAdminModel(adminData);
    if (!valid) {
      return respondWithInputError(res, "User input error", 422, errorMessages);
    }
    const { email, oldPassword, password } = adminData;
    return Administrator.findOne({ _id: adminId })
      .then((foundAdmin) => {
        if(foundAdmin) {
          foundAdminData = foundAdmin;
          return bcrypt.compare(oldPassword, foundAdmin.password);
        } else {
          throw new NotFoundError("Could not resolve admin profile");
        }
      })
      .then((success) => {
        if(success) {
          if (foundAdminData.email === email) {
            return Promise.resolve(null)
          } else {
            return Administrator.findOne({ email: email});
          }
        } else {
          throw new ValidationError("User input error", [ "Incorrect password to apply changes" ], 401);
        }
      })
      .then((adminExistsWithEmail) => {
        if (adminExistsWithEmail) { 
          throw new ValidationError("User input error", ["A user exists with that email"], 422);
        } else {
          return bcrypt.hash(password, saltRounds);
        }
      })
      .then((hashedPassword) => {
        return Administrator.findOneAndUpdate(
          { _id: adminId },
          { ...adminData, password: hashedPassword, editedAt: new Date(Date.now()) },
          { new: true }
        );
      })
      .then((updatedAdmin) => {
        if (updatedAdmin) {
          return res.status(200).json({
            responseMsg: `Administrator ${updatedAdmin.fullName} has been updated`,
            editedAdmin: updatedAdmin
          });
        } else {
          throw new NotFoundError("Couldn't find admin profile to update", 404);
        }
      })
      .catch((err) => {
        console.log(err)
        return processErrorResponse(res, err);
      });
  }

  deleteRegistration(req: Request, res: Response<AdminControllerRes>): Promise<Response> {
    const { adminId } = req.params as AdminParams;
    const admin: IAdministrator = req.user as IAdministrator;
    const password: string = req.body.password as string;

    if (!adminId) {
      return respondWithInputError(res, "Could resolve a user id", 422);
    }
    if (String(admin._id) !== adminId) {
      return respondWithInputError(res, "Not Allowed to delete another admin", 401);
    }
    if (!password) {
      return respondWithInputError(res, "Must enter your password to delete account", 401);
    }
    return Administrator.findOne({ _id: adminId })
      .then((foundAdmin) => {
        if (foundAdmin) {
          return bcrypt.compare(password, foundAdmin.password);
        } else {
          throw new NotFoundError("Admin to delete not found", 404);
        }
      })
      .then((match) => {
        if (match) {
          return Administrator.findOneAndDelete({ _id: adminId });
        } else {
          throw new GeneralError("Incorrect password", 401);
        }
      })
      .then((deletedAdmin) => {
        if (deletedAdmin) {
          return res.status(200).json({
            responseMsg: `Deleted admin account ${deletedAdmin.fullName}`,
            deletedAdmin: deletedAdmin
          });
        } else {
          throw new NotFoundError("Admin to delete not found in database", 404);
        }
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      });
  }

  login(req: Request<{}, {}, AdminLoginRequest>, res: Response<AdminControllerRes>): Promise<Response> {
    const { email, password } = req.body;
    let _foundAdmin: IAdministrator;

    if (!email || !password) {
      return respondWithInputError(res, "Email and password are required", 422);
    }
    // find admin, verify password //
    return Administrator.findOne({ email: email })
      .then((foundAdmin) => {
        if (foundAdmin) {
          _foundAdmin = foundAdmin;
          return bcrypt.compare(password, foundAdmin.password);
        } else {
          throw new NotFoundError("Did not find an account with this email", 404);
        }
      })
      .then((match) => {
        if (match) {
          const { token, expires } = issueJWT(_foundAdmin);
          return res.status(200).json({
            responseMsg: `Welcome back ${_foundAdmin.fullName}`,
            admin: _foundAdmin,
            success: true,
            jwtToken: {
              token: token,
              expiresIn: expires
            }
          });
        } else {
          throw new ValidationError("Login Error", [ "Incorrect passwrod" ], 401);
        }
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      })
  }
  logout(req: Request, res: Response): Promise<Response> {
    return Promise.resolve(res);
  }
};

export default AdminsController;