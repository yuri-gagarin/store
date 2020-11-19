import { IAdministrator } from "../../models/Administrator";
import { IUser } from "../../models/User";
// jwt imports //
import jsonWebToken from "jsonwebtoken";
import passportJwt, { StrategyOptions } from "passport-jwt";
const { ExtractJwt, Strategy: JWTStrategy } = passportJwt;


const opts: StrategyOptions = {
  jwtFromRequest:  ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "somethingdumbhere",
  //issuer: "we@us.com",
  // audience: "ouradress.net"
};

export const issueJWT = (user: IAdministrator | IUser) => {
  const _id: string  = user._id;
  const expiresIn = "1d";
  const payload = { 
    sub: _id,
    iat: Date.now()
  };

  const signedToken = jsonWebToken.sign(payload, <string>opts.secretOrKey, { expiresIn: expiresIn });
  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn
  }
};