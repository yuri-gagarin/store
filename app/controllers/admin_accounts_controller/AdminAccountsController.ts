import { Request, Response } from "express";
import AdminAccount,  { AccountLevel, IAdminAccount } from "../../models/AdminAccount";
import { IAdministrator } from "../../models/Administrator";
import { respondWithDBError, respondWithGeneralError, respondWithInputError } from "../helpers/controllerHelpers";
import { IGenericController } from "../helpers/controllerInterfaces"

type AdminAccountsControllerRes = {
  responseMsg: string;
  adminAccounts?: IAdminAccount[];
  newAdminAcccount?: IAdminAccount;
  editedAdminAccount?: IAdminAccount;
  deletedAdminAccount?: IAdminAccount;
}
type AdminAccountReqParams = {
  adminAccountId: string;
}
class AdminAccountsController implements IGenericController {
  index(req: Request, res: Response): Promise<Response> {
    const user = req.user as IAdministrator;
    if (!user) {

    }
  }
  get(req: Request<AdminAccountReqParams>, res: Response<AdminAccountsControllerRes>): Promise<Response> {
    const { adminAccountId } = req.params;
    if (!adminAccountId) {
      return respondWithInputError(res, "Cant resolve an account to look for", 422);
    }
    return AdminAccount.findOne({ _id: adminAccountId })
      .populate("")
      .then((adminAccount) => {
        if (adminAccount) {
          return res.status(200).json({
            responseMsg: `Return account `
          })
        }
      })
  }
  create(req: Request, res: Response): Promise<Response> {
    const admin = req.user  as IAdministrator;
    const { _id: adminId } = admin;
    if (admin.adminAccountId) {
      return respondWithGeneralError(res, "You already have an account set up", 422);
    }
    return AdminAccount.create({ 
      adminAccounts: [ adminId ],
      linkedStores: [],
      linkedServices: [],
      accountLevel: AccountLevel.Standard
    })
    .then((adminAccount) => {
      return res.status(200).json({
        responseMsg: "Created a new admin account",
        newAdminAcccount: adminAccount
      });
    })
    .catch((err) => respondWithDBError(res, err));
  } 
  edit(req: Request, res: Response): Promise<Response> {
    return Promise.resolve(res);
  }
  delete(req: Request, res: Response): Promise<Response> {
    return Promise.resolve(res);
  }
};

export default AdminAccountsController;