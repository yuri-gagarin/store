import { Document, Model } from "mongoose";
import { PassportStatic } from "passport";
import passportJWT, { StrategyOptions } from "passport-jwt";
import User, { IUser } from "../models/User";
import Administrator, { IAdministrator } from "../models/Administrator";
import { NextFunction, Request, Response } from "express";

const { ExtractJwt, Strategy : JWTStrategy } = passportJWT;

export const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "somethingverysecret",
}

const adminJWTStrategy = new JWTStrategy(options, (payload, done) =>  {
  Administrator.findOne({ _id: payload.sub })
    .then((admin) => {
      if (admin) {
        done(null, admin);
      } else {
        done(null, false);
      }
    })
    .catch((err) => {
      done(err, null);
    });
});

const userJWTStrategy = new JWTStrategy(options, (payload, done) => {
  User.findOne({ _id: payload.sub })
    .then((user) => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
    .catch((err) => {
      done(err, null);
    })
})
export default function (passport: PassportStatic) {
  passport.use("adminJWT", adminJWTStrategy);
  passport.use("userJWT", userJWTStrategy);
}

