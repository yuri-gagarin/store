import { IAdministrator } from "../../models/Administrator";
import { IUser } from "../../models/User";
// jwt imports //
import jsonWebToken from "jsonwebtoken";
import passportJwt, { StrategyOptions } from "passport-jwt";
const { ExtractJwt, Strategy: JWTStrategy } = passportJwt;
import { options } from "../../auth/passport";


export const issueJWT = (user: IAdministrator | IUser) => {
  const _id: string  = user._id;
  const expiresIn = "1d";
  const payload = { 
    sub: _id,
    iat: Date.now()
  };

  const signedToken = jsonWebToken.sign(payload, (options.secretOrKey as string), { expiresIn: expiresIn });
  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn
  }
};