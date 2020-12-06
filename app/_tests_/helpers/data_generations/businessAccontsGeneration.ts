import BusinessAccount, { EAccountLevel, IBusinessAccount } from "../../../models/BusinessAccount";
import { IAdministrator } from "../../../models/Administrator";
import { IProduct } from "../../../models/Product";
import { IService } from "../../../models/Service";
import { IStore } from "../../../models/Store";

type GenerateAccountArguments = {
  admins: IAdministrator[];
  stores?: IStore[];
  products?: IProduct[];
  services?: IService[];
  
}
export const generateBusinessAcccount = ({ admins, stores = [], products = [], services = [] }: GenerateAccountArguments): Promise<IBusinessAccount> => {
  const adminIDs: string[] = admins.map((admin) => (admin._id as string));
  const storeIDs: string[] = stores.map((store) => (store._id as string));
  const productsIDs: string[] = products.map((product) => (product._id as string));
  const serviceIDs: string[] =  services.map((service) => (service._id as string));

  return BusinessAccount.create({
    linkedAdmins: [ ...adminIDs ],
    linkedStores: [ ...storeIDs ],
    linkedProducts: [ ...productsIDs ],
    linkedServices: [ ...serviceIDs ],
    accountLevel: EAccountLevel.Standard,
    createdAt: new Date(Date.now()),
    editedAt: new Date(Date.now())
  });
 
};
