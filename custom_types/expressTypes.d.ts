import { IAdministrator } from "../app/models/Administrator";
import { IUser } from "../app/models/User";

declare module "express" {
  export interface Request {
    user?: IAdministrator | IUser
  }
}