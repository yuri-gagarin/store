import chaiHTTP from "chai-http";
import { setupDB, clearDB } from "../../../helpers/dbHelpers";
import { createAdmins } from "../../../helpers/data_generation/adminsDataGeneration";
import { createProducts } from "../../../helpers/data_generation/productsDataGeneration"
import { createBusinessAcccount } from "../../../helpers/data_generation/businessAccontsGeneration";
import Administrator, { IAdministrator } from "../../../../models/Administrator";
import Product, { IProduct } from "../../../../models/Product";

type SetupProdContTestRes = {
  admins: {
    firstAdmin: IAdministrator,
    secondAdmin: IAdministrator,
    thirdAdmin: IAdministrator
  },
  busAccountIds: {
    firstAdminBusAcctId: string;
    secondAdminBusAcctId: string;
    thirdAdminBusAcctId: string;
  }
  products: {
    firstAdminsProduct: IProduct;
    secondAdminsProduct: IProduct;
  }
};

export const setupProdControllerTests = (): Promise<SetupProdContTestRes> => {
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string, thirdAdminBusAcctId: string;
  let firstAdminsProduct: IProduct, secondAdminsProduct: IProduct;

  return setupDB()
    .then(() => {
      return createAdmins(3);
    }) 
    .then((adminsArr) => {
      [ firstAdmin, secondAdmin, thirdAdmin ] = adminsArr;
      return Promise.all([
        createBusinessAcccount({ admins: [ firstAdmin ] }),
        createBusinessAcccount({ admins: [ secondAdmin ] })
      ]);
    })
    .then((busAccountArr) => {
      [ firstAdminBusAcctId, secondAdminBusAcctId ] = busAccountArr.map((acc) => String(acc._id));
      return Promise.all([
        createProducts(5, firstAdminBusAcctId),
        createProducts(5, secondAdminBusAcctId)
      ]);
    })
    .then((products) => {
      firstAdminsProduct = products[0][0];
      secondAdminsProduct = products[1][0];
      return Promise.all([
        Administrator.findOneAndUpdate({ _id: firstAdmin._id }, { $set: { businessAccountId: firstAdminBusAcctId } }, { new: true }),
        Administrator.findOneAndUpdate({ _id: secondAdmin._id }, { $set: { businessAccountId: secondAdminBusAcctId } }, { new: true })
      ]);
    })
    .then((updatedAdminArr) => {
      [ firstAdmin, secondAdmin ] = (updatedAdminArr as IAdministrator[]);
      return {
        admins: {
          firstAdmin,
          secondAdmin,
          thirdAdmin
        },
        busAccountIds: {
          firstAdminBusAcctId,
          secondAdminBusAcctId,
          thirdAdminBusAcctId
        },
        products: {
          firstAdminsProduct,
          secondAdminsProduct
        }
      };
    })
    .catch((err) => {
      throw err;
    });
};

export const loginAdmins = async (chai: Chai.ChaiStatic, server: Express.Application, admins: IAdministrator[]): Promise<string[]> => {
  const tokensArr: string[] = [];
  chai.use(chaiHTTP)
  for (let i = 0; i < admins.length; i++) {
    await new Promise<boolean>((resolve, reject) => {
      chai.request(server)
        .post("/api/admins/login")
        .send({
          email: admins[i].email,
          password: "password"
        })
        .then((res) => {
          const token = res.body.jwtToken.token as string;
          tokensArr.push(token);
          resolve(true);
        })
        .catch((err) =>{
          reject(err);
        });
    });
    
  };
  return Promise.resolve(tokensArr);
}