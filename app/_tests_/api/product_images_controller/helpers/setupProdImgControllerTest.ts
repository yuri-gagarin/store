import fs from "fs";
import path from "path";
// models and model interfaces //
import Administrator, { IAdministrator } from "../../../../models/Administrator";
import Product, { IProduct } from "../../../../models/Product";
import { IProductImage } from "../../../../models/ProductImage";
// helpers and data generation //
import { setupDB } from "../../../helpers/dbHelpers";
import { createProducts } from "../../../helpers/data_generation/productsDataGeneration";
import { createAdmins } from "../../../helpers/data_generation/adminsDataGeneration";
import { createProductImages } from "../../../helpers/data_generation/productImageDataGeneration";
import { createBusinessAcccount } from "../../../helpers/data_generation/businessAccontsGeneration";

type SetupProductImgContTestRes = {
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
  },
  productImages: {
    firstAdminsProductImgs: IProductImage[];
    secondAdminsProductImgs: IProductImage[];
  }
};

export const setupProductImgControllerTests = (): Promise<SetupProductImgContTestRes> => {
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string, thirdAdminBusAcctId: string;
  let firstAdminsProduct: IProduct, secondAdminsProduct: IProduct;
  let firstAdminsProductImgs: IProductImage[], secondAdminsProductImgs: IProductImage[];

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
        createProducts(5, busAccountArr[0]),
        createProducts(5, busAccountArr[1])
      ]);
    })
    .then((productsArr) => {
      firstAdminsProduct = productsArr[0][0];
      secondAdminsProduct = productsArr[1][0];
      return Promise.all([
        Administrator.findOneAndUpdate({ _id: firstAdmin._id }, { $set: { businessAccountId: firstAdminBusAcctId } }, { new: true }),
        Administrator.findOneAndUpdate({ _id: secondAdmin._id }, { $set: { businessAccountId: secondAdminBusAcctId } }, { new: true })
      ]);
    })
    .then((updatedAdminArr) => {
      [ firstAdmin, secondAdmin ] = (updatedAdminArr as IAdministrator[]);
      return Promise.all([
        createProductImages(1, firstAdminsProduct),
        createProductImages(1, secondAdminsProduct)
      ]);
    })
    .then((productImgs) => {
      [ firstAdminsProductImgs, secondAdminsProductImgs ] = productImgs;
      // have to return updated Products with image count //
      return Product.find({ _id: { $in: [ firstAdminsProduct._id, secondAdminsProduct._id ] } });
    }) 
    .then((products) => {
      [ firstAdminsProduct, secondAdminsProduct ] = products;
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
        },
        productImages: {
          firstAdminsProductImgs,
          secondAdminsProductImgs
        }
      };
    })
    .catch((err) => {
      throw err;
    });
};

export const cleanUpProductImgControllerTests = (...args: string[]) => {
  const pathToImages = path.join(path.resolve(), "public", "uploads", "product_images");
  return fs.promises.access(pathToImages)
    .then((_) => {
      return fs.promises.readdir(pathToImages)
    })
    .then((directories) => {
      if (directories.length > 0) {
        for (let i = 0; i < args.length; i++) {
          const stats = fs.statSync(path.join(pathToImages, args[i]));
          if (stats.isDirectory()) {
            fs.rmdirSync(path.join(pathToImages, args[i]), { recursive: true });
          }
        }
      }
      return true;
    })
    .catch((err) => {
      if (err.code === "ENOENT") {
        console.log("No image to delete");
        return true;
      } else {
        throw err;
      }
    });
};
