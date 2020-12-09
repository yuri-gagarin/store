import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Administrator, { IAdministrator, EAdminLevel } from "../../models/Administrator";
// helpers and validators //
import { validateAdminModel } from "./helpers/validationHelpers";
import { respondWithInputError } from "../helpers/controllerHelpers";
import { issueJWT } from "../helpers/authHelpers";
import { checkDuplicateEmail } from "../helpers/controllerHelpers";
// type declrations //
import { IGenericAuthController } from "../helpers/controllerInterfaces";
import {
  AdminData, AdminParams, AdminLoginRequest, AdminControllerRes
} from "./type_declarations/adminsControllerTypes";
import { NotFoundError, NotAllowedError, processErrorResponse, ValidationError } from "../helpers/errorHandlers";

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
          throw new ValidationError({ errMessage: "Registration error", messages: errorMessages, statusCode: 422 });
        }
      })
      .then((hashedPassword) => {
        return Administrator.create({
          ...adminData,
          password: hashedPassword,
          adminLevel: EAdminLevel.Moderator,
          approved: false,
          createdAt: new Date(Date.now())
        })
      })
      .then((createdAdmin) => {
        const { token, expires } = issueJWT(createdAdmin);
        return res.status(200).json({
          responseMsg: "New administrator profile created, you will need to be approved",
          newAdmin: createdAdmin,
          jwtToken: {
            token: token,
            expiresIn: expires
          }
        });
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      });
  }
  editRegistration(req: Request<{}, {}, AdminData>, res: Response<AdminControllerRes>): Promise<Response> {
    const saltRounds = 10;
    const adminData: AdminData = req.body;
    const { adminId } = req.params as AdminParams;
    const currentAdmin = req.user as IAdministrator;
    let foundAdminData: IAdministrator;
     // check for correct admin //
     if (String(currentAdmin._id) !== adminId) {
      return respondWithInputError(res, "Can't process request", 401, ["Not allowed to edit another admin account"]);
    }
    // validate old password first //
    if (!adminData.oldPassword) {
      return respondWithInputError(res, "Can't process request", 401, ["Your current password is required"]);
    };
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
          throw new NotFoundError({ messages: [ "Could not resolve admin profile" ] });
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
          throw new NotAllowedError({ messages: [ "Incorrect password to apply changes" ] });
        }
      })
      .then((adminExistsWithEmail) => {
        if (adminExistsWithEmail) { 
          throw new ValidationError({ messages: [ "A user exists with that email" ], statusCode: 422 });
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
          throw new NotFoundError({ messages: [ "Couldn't find admin profile to update" ] });
        }
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      });
  }

  deleteRegistration(req: Request, res: Response<AdminControllerRes>): Promise<Response> {
    const { adminId } = req.params as AdminParams;
    const admin: IAdministrator = req.user as IAdministrator;
    const password: string = req.body.password as string;

    if (!adminId) {
      return respondWithInputError(res, "User input error", 422, [ "Could not resolve a user id" ]);
    }
    if (String(admin._id) !== adminId) {
      return respondWithInputError(res, "Not allowed", 401, [ "NOt allowed to delete another admin" ]);
    }
    if (!password) {
      return respondWithInputError(res, "User input error", 401, [ "Must enter your password to delete account" ]);
    }
    return Administrator.findOne({ _id: adminId })
      .then((foundAdmin) => {
        if (foundAdmin) {
          return bcrypt.compare(password, foundAdmin.password);
        } else {
          throw new NotFoundError({ messages: [ "Admin to delete not found" ] });
        }
      })
      .then((match) => {
        if (match) {
          return Administrator.findOneAndDelete({ _id: adminId });
        } else {
          throw new NotAllowedError({ messages: [ "Incorrect password" ] });
        }
      })
      .then((deletedAdmin) => {
        if (deletedAdmin) {
          return res.status(200).json({
            responseMsg: `Deleted admin account ${deletedAdmin.fullName}`,
            deletedAdmin: deletedAdmin
          });
        } else {
          throw new NotFoundError({ messages: [ "Admin to delete not found in database" ] });
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
      return respondWithInputError(res, "Login error", 422, [ "Email and password are required" ]);
    }
    // find admin, verify password //
    return Administrator.findOne({ email: email })
      .then((foundAdmin) => {
        if (foundAdmin) {
          _foundAdmin = foundAdmin;
          return bcrypt.compare(password, foundAdmin.password);
        } else {
          throw new NotFoundError({ messages: [ "Did not find an account with this email" ] });
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
          throw new NotAllowedError({ errMessage: "Login Error", messages: [ "Incorrect password" ] });
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