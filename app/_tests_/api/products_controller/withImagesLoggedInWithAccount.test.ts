// testing dependecies //
import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import { Types } from "mongoose";
import fs, { readdirSync } from "fs";
import path from "path";
// server import /
import server from "../../../server";
// models and model interfaces //
import BusinessAccount from "../../../models/BusinessAccount";
import { IAdministrator } from "../../../models/Administrator";
import ProductImage, { IProductImage } from "../../../models/ProductImage";
import Product, { IProduct } from "../../../models/Product";
// additional type definitions //
import { ProductData } from "../../../controllers/products_controller/type_declarations/productsControllerTypes";
// helpers //
import { clearDB } from "../../helpers/dbHelpers";
import { generateMockProductData } from "../../helpers/data_generation/productsDataGeneration"; 
import { setupProdControllerTests } from "./helpers/setupProdControllerTest";
import { cleanUpProductImgControllerTests } from "../product_images_controller/helpers/setupProdImgControllerTest";
import { createProductImages } from "../../helpers/data_generation/productImageDataGeneration";
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";

chai.use(chaiHTTP);

type ImageDirectoryDetails = {
  imageModel: string;
  imageDirectories: string[];
  imageSubDirectories: string[];
  imageFiles: string[];
  totalImageDirectories: number;
  totalImageSubdirectories: number;
  totalImageFiles: number;
}
const getImageUploadData = (...paths: string []): ImageDirectoryDetails => {
  const firstString = paths[0].split("_")[0]; 
  const modelName = firstString[0].toUpperCase() + firstString.substr(1) + "Image";
  //
  const imageUplPath = path.join(path.resolve(), "public", "uploads", ...paths);
  const imageUplSubdirectories: string[] = [];
  const imageFiles: string[] = [];

  try {
    const imageUplDirectories = fs.readdirSync(imageUplPath).map((dir) => {
      return path.join(imageUplPath, dir);
    });

    for (const imgUplDirectory of imageUplDirectories) {
      const subdirectories = fs.readdirSync(imgUplDirectory).map((subdir) => {
        return path.join(imgUplDirectory, subdir);
      })
      imageUplSubdirectories.push(...subdirectories);
    }

    for (const imgUplSubdirectory of imageUplSubdirectories) {
      const files = readdirSync(imgUplSubdirectory);
      imageFiles.push(...files);
    }

    return {
      imageModel: modelName,
      imageDirectories: imageUplDirectories,
      imageSubDirectories: imageUplSubdirectories,
      imageFiles: imageFiles,
      totalImageDirectories: imageUplDirectories.length,
      totalImageSubdirectories: imageUplSubdirectories.length,
      totalImageFiles: imageFiles.length
    };
  } catch (error) {
    throw error;
  }
  
};
/**
 * This test suite tests mostly the effect of 'ProductController' methods on linked 'ProductImage' models,
 * making sure actions are correctly populating and removing images when appropriate
 * For detailed 'ProductController' action tests, another test suite handles other detailed test cases regarding the 'Product' model.
 */

describe("ProductsController - Logged In WITH CORRECT BusinessAccount ID - tests with 'ProductImage' models present - GET/POST/PATCH/DELETE  - API tests", () => {
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator, thirdAdmin: IAdministrator;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;
  // product models //
  let product: IProduct;
  let fetchedProducts: IProduct[];
  let createdProduct: IProduct;
  let updatedProduct: IProduct;
  let deletedProduct: IProduct;
  let firstAdminsProduct: IProduct, secondAdminsProduct: IProduct;
  let firstAdminsProductsArr: IProduct[], secondAdminsProductsArr: IProduct[];
  let firstAdminsProductImages: IProductImage[];
  //
  let firstToken: string, secondToken: string;
  let totalProducts: number;
  let firstAdminsProductImgTotal: number;
  let totalProductImages: number;
  // mockData //
  let newProductData: ProductData;
  let updateProductData: ProductData;
  // 
  let numberOfProductImageDirectories: number = 0;    // <path>/public/uploads/product_images/<businessAccountId> //
  let numberOfProductImageSubDirectories: number = 0; // <path>/public/uploads/product_images/<businessAccountId>/<productId> //
  let numberOfProductImageFiles: number = 0;

  // database and model data setup //
  // logins and jwtTokens //
  before((done) => {
    setupProdControllerTests()
      .then((response) => {
        ({ firstAdmin, secondAdmin } = response.admins);
        ({ firstAdminsProduct, secondAdminsProduct, firstAdminsProductsArr, secondAdminsProductsArr } = response.products);
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = response.busAccountIds);
        return loginAdmins(chai, server, [ firstAdmin, secondAdmin ]);
      })
      .then((tokensArr) => {
        ([ firstToken, secondToken ] = tokensArr);
        const productImgPromises: Promise<IProductImage[]>[] = [];
        for (const product of firstAdminsProductsArr) {
          const createPromises = createProductImages(5, product);
          productImgPromises.push(createPromises)
        }
        for (const product of secondAdminsProductsArr) {
          const createPromises = createProductImages(5, product);
          productImgPromises.push(createPromises)
        }
        return Promise.all(productImgPromises);
      })
      .then((_) => {
        return ProductImage.find({ businessAccountId: firstAdminBusAcctId }).exec()
      })
      .then((productImages) => {
        firstAdminsProductImages = productImages;
        return Promise.all([
          Product.countDocuments().exec(),
          ProductImage.countDocuments().exec(),
          ProductImage.countDocuments({ productId: firstAdminsProduct._id }).exec()
        ]);
      })
      .then((countsArray) => {
        [ totalProducts, totalProductImages, firstAdminsProductImgTotal ] = countsArray;
        try {
          const data = getImageUploadData("product_images");
          numberOfProductImageDirectories = data.totalImageDirectories;
          numberOfProductImageSubDirectories = data.totalImageSubdirectories;
          numberOfProductImageFiles = data.totalImageFiles;
          done();
        } catch (error) {
          done(error);
        }
      })
      .catch((err) => {
        done(err);
      });
  });
  before(() => {
    [ newProductData, updateProductData ] = generateMockProductData(2);
  });
  after((done) => {
    Promise.all([
      clearDB(),
      cleanUpProductImgControllerTests(firstAdminBusAcctId, secondAdminBusAcctId)
    ])
    .then(() => {
      done();
    })
    .catch((error) => {
      done(error);
    });
  });

  context("Admin WITH a 'BusinessAccount' set up, GET_MANY, GET_ONE, CREATE, EDIT, DELETE actions", () => {

    // TEST GET GET_MANY action correct BusinessAccount //
    describe("GET '/api/products' - CORRECT 'BusinessAccount' tests with 'ProductImages' - GET_MANY action", () => {
      it("Should fetch 'Product' models and return a correct response", (done) => {
        chai.request(server)
          .get("/api/products")
          .set({ "Authorization": firstToken })
          .end((err, res) => {
            if (err) done(err);
            fetchedProducts = res.body.products;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.products).to.be.an("array");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly populate the 'Product' models if linked 'ProductImage' models are present", () =>{
        for (const product of fetchedProducts) {
          if (product.images.length > 0) {
            for (const productImage of product.images) {
              const linkedImage = productImage as IProductImage;
              expect(linkedImage.businessAccountId).to.be.an("string");
              expect(linkedImage.productId).to.be.an("string");
              expect(linkedImage.imagePath).to.be.a("string");
              expect(linkedImage.absolutePath).to.be.a("string");
              expect(linkedImage.url).to.be.a("string");
              expect(linkedImage.fileName).to.be.a("string");
              expect(linkedImage.createdAt).to.be.an("string");
              expect(linkedImage.editedAt).to.be.an("string");

            }
          }
        }
      });
      it("Should NOT alter anything within 'ProductImage' models in the database", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProductImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ProductImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("product_images");
          expect(totalImageDirectories).to.equal(numberOfProductImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfProductImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfProductImageFiles);
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST GET GET_MANY action correct BusinessAccount //

    // TEST GET_ONE action with correct BusinessAccount //
    describe("GET '/api/products/:productId' - CORRECT 'BusinessAccount' tests with 'ProductImages' - GET_MANY action", () => {
    
      it("Should fetch 'Product' models and return a correct response", (done) => {
        chai.request(server)
          .get("/api/products/" + (firstAdminsProduct._id as Types.ObjectId))
          .set({ "Authorization": firstToken })
          .end((err, res) => {
            if (err) done(err);
            product = res.body.product;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.product).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly populate the 'Product' model's <images> subarray with the 'ProductImage' models", () =>{
        for (const productImage of product.images as IProductImage[]) {
          expect(productImage.businessAccountId).to.be.an("string");
          expect(productImage.productId).to.be.an("string");
          expect(productImage.imagePath).to.be.a("string");
          expect(productImage.absolutePath).to.be.a("string");
          expect(productImage.url).to.be.a("string");
          expect(productImage.fileName).to.be.a("string");
          expect(productImage.createdAt).to.be.an("string");
          expect(productImage.editedAt).to.be.an("string");
        }
      });
      it("Should NOT alter anything within 'ProductImage' models in the database", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProductImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ProductImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("product_images");
          expect(totalImageDirectories).to.equal(numberOfProductImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfProductImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfProductImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST GET_ONE action with a correct BusinessAccount //

    // TEST POST CREATE action with a correct BusinessAccount //
    describe("POST '/api/products/create' - CORRECT 'BusinessAccount' tests with 'ProductImages' - CREATE action", () => {

      it("Should create a 'Product' model and return a correct response", (done) => {
        const mockProduct = generateMockProductData(1);
        chai.request(server)
          .post("/api/products/create")
          .set({ "Authorization": firstToken })
          .send( ...mockProduct )
          .end((err, res) => {
            if (err) done(err);
            createdProduct = res.body.newProduct;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.newProduct).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything within 'ProductImage' models in the database", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProductImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ProductImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("product_images");
          expect(totalImageDirectories).to.equal(numberOfProductImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfProductImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfProductImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST POST CREATE action with a corect BusinessAccount //

    // TEST PATCH EDIT  action with a correct BusinessAccount //
    describe("POST '/api/products/update/:productId' - CORRECT 'BusinessAccount' tests with 'ProductImages' - CREATE action", () => {

      it("Should update 'Product' model and return a correct response", (done) => {
        const mockProduct = generateMockProductData(1);
        chai.request(server)
          .patch("/api/products/update/" + (firstAdminsProduct._id as Types.ObjectId))
          .set({ "Authorization": firstToken })
          .send(...mockProduct)
          .end((err, res) => {
            if (err) done(err);
            updatedProduct = res.body.editedProduct;
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.editedProduct).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should NOT alter anything within 'ProductImage' models in the database", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(totalProductImages);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should NOT alter any 'ProductImage' upload files nor its upload directories", () => {
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("product_images");
          expect(totalImageDirectories).to.equal(numberOfProductImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfProductImageSubDirectories);
          expect(totalImageFiles).to.equal(numberOfProductImageFiles);
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST PATCH EDIT action with a corect BusinessAccount //

    // TEST DELETE DELETE action correct BusinessAccount //
    describe("DELETE '/api/products/delete/:productId' - CORRECT 'BusinessAccount' tests with 'ProductImages' - DELETE action", () => {
    
      it("Should deleted the 'Product' model and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/products/delete/" + String(firstAdminsProduct._id))
          .set({ "Authorization": firstToken })
          .end((err, res) => {
            if (err) done(err);
            // assert correct response //
            expect(res.status).of.equal(200);
            expect(res.body.responseMsg).be.a("string");
            expect(res.body.deletedProduct).to.be.an("object");
            expect(res.body.error).to.be.undefined;
            expect(res.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should remove correct 'ProductImage' models in the database", (done) => {
        ProductImage.find({ productId: firstAdminsProduct._id }).exec()
          .then((products) => {
            expect(products.length).to.equal(0);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should decrement the 'ProductImage' models in the database by a correct number", (done) => {
        ProductImage.countDocuments().exec() 
          .then((count) => {
            expect(count).to.equal(totalProductImages - firstAdminsProductImgTotal);
            totalProductImages -= firstAdminsProductImgTotal;
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
      it("Should remove the 'ProductImage' directories for the queried 'ProductItem'", () => {
        const productImgDirectory = firstAdminsProductImages[0].imagePath;
        try {
          fs.accessSync(productImgDirectory);
        } catch(error) {
          expect(error.code).to.equal("ENOENT");
        }
      });
      it("Should correctly handle image file removal, remove appropriate files and directories only", () => {
        // product images are uploaded to <path>/public/uploads/product_images/<businessAccounId>/<productId> //
        // a removed product should remove its linked uploaded images in <path>/public/uploads/product_images/<businessAccounId>/<productId> directory //
        // it should also remove the <productId> directory but leave all other directories untouched //
        try {
          const { totalImageDirectories, totalImageSubdirectories, totalImageFiles } = getImageUploadData("product_images");
          expect(totalImageDirectories).to.equal(numberOfProductImageDirectories);
          expect(totalImageSubdirectories).to.equal(numberOfProductImageSubDirectories - 1);
          expect(totalImageFiles).to.equal(numberOfProductImageFiles - firstAdminsProductImgTotal);
          numberOfProductImageDirectories = totalImageDirectories;
          numberOfProductImageSubDirectories = totalImageSubdirectories;
          numberOfProductImageFiles = totalImageFiles;
        } catch (error) {
          throw error;
        }
      });

    });
    // END TEST DELETE DELETE action correct BusinessAccount //
    
  });
  // END CONTEXT tests with a correct business accound id //
});