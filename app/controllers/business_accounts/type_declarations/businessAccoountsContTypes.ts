import { Types } from "mongoose";
import { IBusinessAccount } from "../../../models/BusinessAccount";

// controller generic response type //
export type BusinessAccountsContRes = {
  responseMsg: string;
  businessAccounts?: IBusinessAccount[];
  newBusinessAccount?: IBusinessAccount;
  businessAccount?: IBusinessAccount;
  editedBusinessAccount?: IBusinessAccount;
  deletedBusinessAccount?: IBusinessAccount;
  deletedBusinessAccountInfo?: {
    deletedStores: number;
    deletedStoreImages: number;
    deletedStoreItems: number;
    deletedStoreItemImages: number;
    deletedServices: number;
    deletedServiceImages: number;
    deletedProducts: number;
    deletedProductImages: number;
  }
  errorMessages?: string[];
  error?: Error;
}
// create Business account req body type //
export type CreateBusAccountBodyReq = {

}
// edit Business account req body type //
export type EditAccountBodyReq = {
  newAdmins: string[];
  linkedBusinesss: Types.ObjectId[];
  linkedStores: Types.ObjectId[];
  linkedServices: Types.ObjectId[];
  linkedProducts: Types.ObjectId[];
  accountLevel?: string; 
}
// general business account request params //
export type BusinessAccountsContReqParams = {
  businessAcctId: string;
}
// sort query type //
export type BusinessAccountsIndexSortQuery = {
  createdAt?: "desc" | "asc";
  editedAt?: "desc" | "asc"
  lastLogin?: string;
  accountLevel?: "desc" | "asc";
  limit?: string;
}