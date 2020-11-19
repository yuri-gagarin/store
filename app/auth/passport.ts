import passport, { PassportStatic } from "passport";
import jwt from "jsonwebtoken";
import passportJWT, { StrategyOptions } from "passport-jwt";
import User from "../models/User";
const { ExtractJwt, Strategy : JWTStrategy } = passportJWT;

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "somethingdumbhere",
  //algorithms: ["RS256"]
}

const strategy = new JWTStrategy(options, (payload, done) => {
  console.log(14)
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
    });
})

export default function (passport: PassportStatic) {
  passport.use(strategy);
}

