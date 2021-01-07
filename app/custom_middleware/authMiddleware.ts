import passport from "passport";
import { NextFunction, Request, Response } from "express";
import { IAdministrator } from "../models/Administrator";
import { NotAllowedError } from "../controllers/_helpers/errorHandlers";

export const verifyLoggedInAdministrator = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("adminJWT", { session: false }, (error: Error, user: IAdministrator) => {
    if (error) return next(error);
    if (!user) {
      const error = new NotAllowedError({ errMessage: "Authentication failed", messages: [ "Could not resolve a user model" ] });
      return res.status(401).json({
        responseMsg: error.message,
        error: error,
        errorMessages: error.errorMessages
      });
    } else {
      req.login(user, (err) => {
        if (err) next(err);
        next();
      });
    }
  })(req, res, next);
};


