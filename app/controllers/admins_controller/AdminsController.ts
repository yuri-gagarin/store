import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Administrator, { IAdministrator } from "../../models/Administrator";
// helpers and validators //
import { validateNewAdmin } from "./helpers/validationHelpers";
import { respondWithDBError, respondWithGeneralError, respondWithInputError } from "../helpers/controllerHelpers";
import { issueJWT } from "../helpers/authHelpers"
// type declrations //
import { IGenericAuthController } from "../helpers/controllerInterfaces";
import {
  AdminData, AdminParams, AdminLoginRequest, AdminControllerRes
} from "./type_declarations/adminsControllerTypes";





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
              return respondWithGeneralError(res, err.message, 500);
            })
        } else {
          return respondWithInputError(res, "Your old password is incorrect", 401);
        }
      })
      .catch((err) => {
        return respondWithDBError(res, err.message);
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
};

export default AdminsController;