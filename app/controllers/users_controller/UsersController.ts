import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { EMemberLevel } from "../../models/User";
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
import { NotFoundError, NotAllowedError, processErrorResponse, ValidationError } from "../helpers/errorHandlers";

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
          throw new ValidationError({ errMessage: "Registration Error", messages: errorMessages, statusCode: 422 });
        }
      })
      .then((passwordHash) => {
        return User.create({ 
          ...userData, 
          password: passwordHash,
          membershipLevel: EMemberLevel.Rookie,
          createdAt: new Date(Date.now()),
          editedAt: new Date(Date.now())
        });
      })
      .then((user) => {
        const { token, expires } = issueJWT(user);
        return res.status(200).json({
          responseMsg: `Welcome ${user.firstName}`,
          newUser: user,
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
    // grab current logged in user //
    const currentUser = req.user as IUser;
    // validate correct input //
    const { valid, errorMessages } = validateNewUser(userData);
    // respond with invalid 422 if bad user input //
    const { email, password, oldPassword } = req.body;
    // respond with 401 if userIds dont match //
    if(userId !== String(currentUser._id)) {
      return respondWithInputError(res, "Not Allowed", 401, [ "You may not delete another user's account" ]);
    }
    if (!oldPassword) {
      return respondWithInputError(res, "Input error", 401, [ "You need to enter your old password" ]);
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
          throw new NotFoundError({ messages:  [ "Could not resolve user account" ] });
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
          throw new NotAllowedError({ messages: [ "Incorrect password" ] });
        }
      })
      .then((foundUserWithEmail) => {
        if (foundUserWithEmail) {
          throw new ValidationError({ messages: [ "Another user account exists with this email" ], statusCode: 422 });
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
          throw new NotFoundError({ messages: [ "Couldn't find the user profile to update" ] });
        }
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      }) 
    }

  deleteRegistration(req: Request, res: Response<UserControllerRes>): Promise<Response> {
    const { userId } = req.params as UserParams;
    const password: string = req.body.password as string;
    // grab current logged in user //
    const user: IUser = req.user as IUser;
    
    if (!userId) {
      return respondWithInputError(res, "Cant resolve User to delete", 422, [ "No user to delete" ]);
    }
    if (String(user._id) !== userId) {
      return respondWithInputError(res, "Action not allowed", 401,  [ "Cannot delete another users' account" ]);
    }
    if (!password) {
      return respondWithInputError(res, "Not allowed to delete", 401,  [ "Must enter your old password to delete account" ]);
    }

    return User.findOne({ _id: userId })
      .then((foundUser) => {
        if (foundUser) {
          return bcrypt.compare(password, foundUser.password);
        } else {
          throw new NotFoundError({ messages: [ "Not able to resolve user to delete" ] });
        }
      })
      .then((match) => {
        if (match) {
          return User.findOneAndDelete({ _id: userId });
        } else {
          throw new NotAllowedError({ errMessage: "Unable to delete", messages: [ "Your password is incorrect" ] });
        }
      })
      .then((deletedUser) => {
        if (deletedUser) {
          return res.status(200).json({
            responseMsg: `Deleted user ${deletedUser.firstName}`,
            deletedUser: deletedUser
          });
        } else {
          throw new NotFoundError({ messages: [ "User to delete was not found" ] });
        }
      })
      .catch((err) => {
        return processErrorResponse(res, err);
      });
  }

  login(req: Request<{}, {}, UserLoginReq>, res: Response<UserControllerRes>) {
    let foundUser: IUser;
    const { email, password } = req.body;

    if (!email && !password) {
      return respondWithInputError(res, "Email or password required", 400);
    }
    return User.findOne({ email: email }) 
      .then((user) => {
        if (user) {
          // check password //
          foundUser = user;
          return bcrypt.compare(password, user.password);
        } else {
          throw new NotFoundError({ messages: [ "Could not find a user with that email" ] });
        }
      })
      .then((match) => {
        if (match) {
          const { token, expires } = issueJWT(foundUser);
          return res.status(200).json({
            responseMsg: `Welcome back ${foundUser.firstName}`,
            jwtToken: {
              token: token,
              expiresIn: expires
            }
          });
        } else {
          throw new NotAllowedError({ errMessage: "Login error", messages: [ "Incorrect password" ] });
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