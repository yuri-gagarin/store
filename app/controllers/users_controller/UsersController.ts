import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../models/User";
// helpers //
import { checkDuplicateEmail, validateNewUser } from "./helpers/validationHelpers";
import { issueJWT } from "../helpers/authHelpers";
import { respondWithDBError, respondWithGeneralError, respondWithInputError } from "../helpers/controllerHelpers";
// additional types //
import { IGenericAuthController } from "../helpers/controllerInterfaces";
import { 
  UserData, UserControllerRes, UserLoginReq, UserParams 
} from "./type_declarations/usersControllerTypes";
import { IUser } from "../../models/User";

class UsersController implements IGenericAuthController {
  register(req: Request<{}, {}, UserData>, res: Response<UserControllerRes>): Promise<Response> {
    const saltRounds = 10;
    const userData: UserData = req.body;
    // validate correct input //
    const { valid, errorMessages } = validateNewUser(req.body);
    // respond with invalid 400 if bad user input //
    if (!valid) {
      return respondWithInputError(res, "User input error", 422, errorMessages);
    }
    const { email, password } = userData;
    return checkDuplicateEmail(email)
      .then((validationRes) => {
        const { valid, errorMessages } = validationRes;
        if (valid) {
          return bcrypt.hash(password, saltRounds)
            .then((passwordHash) => {
              return User.create({ ...userData, password: passwordHash })
            .then((user) => {
              const { token, expires } = issueJWT(user);
              return res.status(200).json({
                responseMsg: `Welcome ${user.firstName}`,
                user: user,
                jwtToken: {
                  token: token,
                  expiresIn: expires
                }
              });
            })
            .catch((err) => {
              return respondWithDBError(res, err);
            });
          })
          .catch((err) => {
            return respondWithGeneralError(res, err.message, 500);
          });
        } else {
          return respondWithInputError(res, "User input error", 422, errorMessages);
        }
    })
    .catch((err: Error) => {
      return respondWithGeneralError(res, err.message, 500);
    });
  }

  editRegistration(req: Request<{}, {}, UserData>, res: Response<UserControllerRes>): Promise<Response> {
    const userData: UserData = req.body;
    const { userId } = req.params as UserParams;
    // validate correct input //
    const { valid, errorMessages } = validateNewUser(userData);
    // respond with invalid 422 if bad user input //
    if (!valid) {
      return respondWithInputError(res, "User input error", 422, errorMessages);
    }
    const { password, oldPassword } = req.body;
    if (!oldPassword) {
      return respondWithInputError(res, "You need to enter your old password", 400);
    }
    return User.findOne({ _id: userId })
      .then((user) => {
        if (user) {
          return bcrypt.compare(oldPassword, user.password)
            .then((success) => {
              if (success) {
                // update user //
                return User.findOneAndUpdate({ _id: userId}, userData , { new: true })
                  .then((user) => {
                    if (user) {
                      return res.status(200).json({
                        responseMsg: `Updated user ${user.firstName}`,
                        editedUser: user
                      })
                    } else {
                      return respondWithGeneralError(res, "Could not resolve user", 404);
                    }
                  })
                  .catch((err: Error) => respondWithDBError(res, err));
              } else {
                return respondWithInputError(res, "Your old password is incorrect");
              }
            })
            .catch((err) => respondWithGeneralError(res, "Something went wrong on our end"));
        } else {
          return respondWithInputError(res, "Could not resolve user", 404);
        }
      })
      .catch((err: Error) => respondWithDBError(res, err));
    }

  deleteRegistration(req: Request, res: Response<UserControllerRes>): Promise<Response> {
    const { userId } = req.params;
    if (!userId) {
      respondWithInputError(res, "Cant resolve User to delete", 422, []);
    }
    const user = req.user as IUser

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
  login(req: Request<{}, {}, UserLoginReq>, res: Response<UserControllerRes>) {
    const { email, password } = req.body;
    console.log(req.body)
    if (!email && !password) {
      return respondWithInputError(res, "Email or password required", 400);
    }
    return User.findOne({ email: email }) 
      .then((user) => {
        // console.log(117)
        if (user) {
          // check password //
          return bcrypt.compare(password, user.password)
            .then((match) => {
              if (match) {
                const { token, expires } = issueJWT(user);
                return res.status(200).json({
                  responseMsg: `Welcome back ${user.firstName}`,
                  jwtToken: {
                    token: token,
                    expiresIn: expires
                  }
                });
              } else {
                return res.status(401).json({
                  responseMsg: "Wrong password"
                });
              }
            })
            .catch((err) => {
              return respondWithGeneralError(res, err.message, 500);
            })
        } else {
          return res.status(401).json({
            responseMsg: "Could not find the user for login"
          })
        }
      })
  }
  logout(req: Request, res: Response) {
    return Promise.resolve(res)
  }
};

export default UsersController;