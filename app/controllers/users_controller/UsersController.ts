import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { MemberLevel } from "../../models/User";
// helpers //
import { checkDuplicateEmail, validateNewUser } from "./helpers/validationHelpers";
import { issueJWT } from "../helpers/authHelpers";
import { respondWithInputError } from "../helpers/controllerHelpers";
// additional types //
import { IGenericAuthController } from "../helpers/controllerInterfaces";
import { 
  UserData, UserControllerRes, UserLoginReq, UserParams 
} from "./type_declarations/usersControllerTypes";
import { IUser } from "../../models/User";
import { NotFoundError, processErrorResponse, ValidationError } from "../helpers/errorHandlers";

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
        } else {
          throw new ValidationError("Registration Error", errorMessages, 422)
        }
      })
      .then((passwordHash) => {
        return User.create({ 
          ...userData, 
          password: passwordHash,
          membershipLevel: MemberLevel.Rookie,
          createdAt: new Date(Date.now()),
          editedAt: new Date(Date.now())
        });
      })
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
        return processErrorResponse(res, err);
      });
  }

  editRegistration(req: Request<{}, {}, UserData>, res: Response<UserControllerRes>): Promise<Response> {
    const saltRounds = 10;
    const userData: UserData = req.body;
    const { userId } = req.params as UserParams;
    let foundUser: IUser;
    // validate correct input //
    const { valid, errorMessages } = validateNewUser(userData);
    // respond with invalid 422 if bad user input //
    const { email, password, oldPassword } = req.body;

    if (!oldPassword) {
      return respondWithInputError(res, "Input error", 400, [ "You need to enter your old password" ]);
    }
    if (!valid) {
      return respondWithInputError(res, "User input error", 422, errorMessages);
    }
    
    return User.findOne({ _id: userId })
      .then((user) => {
        if (user) {
          foundUser = user;
          return bcrypt.compare(oldPassword, user.password);
        } else {
          throw new NotFoundError("Could not reslove user account", 404);
        }
      })
      .then((match) => {
        if (match) {
          // update user //
          if (foundUser.email === email) {
            return Promise.resolve(null);
          } else {
            return User.findOne({ email: email })
          }
        } else {
          throw new ValidationError("User input error", [ "Incorrect password"], 401);
        }
      })
      .then((foundUserWithEmail) => {
        if (foundUserWithEmail) {
          throw new ValidationError("User input error", [ "Another user account exists with this email"], 422);
        } else {
          return bcrypt.hash(password, saltRounds);
        }
      })
      .then((hashedPassword) => {
        return User.findOneAndUpdate(
          { _id: userId },
          { ...userData, password: hashedPassword, editedAt: new Date(Date.now()) },
          { new: true }
        );
      })   
      .then((updatedUser) => {
        if (updatedUser) {
          return res.status(200).json({
            responseMsg: `User ${updatedUser.firstName} has been updated`,
            editedUser: updatedUser
          });
        } else {
          throw new NotFoundError("Couldn't find the user profile to update", 404);
        }
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      }) 
    }

  deleteRegistration(req: Request, res: Response<UserControllerRes>): Promise<Response> {
    const { userId } = req.params as UserParams;
    const user: IUser = req.user as IUser;
    const password: string = req.body.password as string;

    if (!userId) {
      return respondWithInputError(res, "Cant resolve User to delete", 422, []);
    }
    if (String(user._id) !== userId) {
      return respondWithInputError(res, "Not allowed to delete another user profile", 401);
    }
    if (!password) {
      return respondWithInputError(res, "Must enter your password to delete account", 401);
    }

    return User.findOne({ _id: userId })
      .then((foundUser) => {
        if (foundUser) {
          return bcrypt.compare(password, foundUser.password);
        } else {
          throw new NotFoundError("Not able to resolve user to delete", 404);
        }
      })
      .then((match) => {
        if (match) {
          return User.findOneAndDelete({ _id: userId });
        } else {
          throw new ValidationError("Unable to complete", [ "Your password is incorrect "], 401);
        }
      })
      .then((deletedUser) => {
        if (deletedUser) {
          return res.status(200).json({
            responseMsg: `Deleted user ${deletedUser.firstName}`,
            deletedUser: deletedUser
          });
        } else {
          throw new NotFoundError("User to delete was not found", 404);
        }
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      });
  }

  login(req: Request<{}, {}, UserLoginReq>, res: Response<UserControllerRes>) {
    let user: IUser;
    const { email, password } = req.body;

    if (!email && !password) {
      return respondWithInputError(res, "Email or password required", 400);
    }
    return User.findOne({ email: email }) 
      .then((user) => {
        // console.log(117)
        if (user) {
          // check password //
          return bcrypt.compare(password, user.password);
        } else {
          throw new NotFoundError("Could not find a user with that email");
        }
      })
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
          throw new ValidationError("Login error", [ "Incorrect password" ], 401);
        }
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      })
  }
  logout(req: Request, res: Response) {
    return Promise.resolve(res)
  }
};

export default UsersController;