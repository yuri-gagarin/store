import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import { Types } from "mongoose";
// node dependencies //
import fs from "fs";
import path from "path";
// server import //
import server from "../../../server";
// models and model interfaces //
import Product, { IProduct } from "../../../models/Product";
import ProductImage, { IProductImage } from "../../../models/ProductImage";
// setup helpers //
import { setupProductImgControllerTests,cleanUpProductImgControllerTests } from "./helpers/setupProdImgControllerTest";
import { loginAdmins } from "../../helpers/auth_helpers/authHelpers";
// helpers //
import { isEmptyObj } from "../../../controllers/helpers/queryHelpers";
import { clearDB } from "../../helpers/dbHelpers";
import { IAdministrator } from "../../../models/Administrator";
import { response } from "express";

chai.use(chaiHTTP);
/**
 * // Scenario when an Admin is registered and logged in AND has a correct BusinessAccount allowing them to edit Product in questin and CREATE/DELETE ProductImages. //
 * // In this scenario  'passport' middleware allows further access //
 * // {checkImgUploudCredentials} custom middleware should intercept this request and process access rights //
 * //
 * // If admin.businessAccountId === product.businessAccountId then {checkImgUpload} middleware should pass on to //
 * // 'ProductImgUplConroller' and allow CREATE_IMAGE and DELETE_IMAGE actions.
 * // Otherwise if admin.businessAccountId !== product.businessAccountId then {checlImgUpload} middleware should bock access and //
 * // return the appropiate response. //
 * // response options include: //
 * 
 * // SUCCESSFUL response should return:
 * // {
 * //   responseMsg: string;
 * //   newProductImage: IProductImage;
 * //   updatedProduct: IProduct;
 * // }
 * // UNSUCCCESSFUL response should return"
 * // {
 * //   responseMsg: string;
 * //   error: 'Object' | Error;
 * //   errorMessages: string[];
 * // }
 */

describe("ProductImagesUplController - LOGGED IN - BUSINESS ACCOUNT SET UP - POST/DELETE API tests", () => {
  // admins, admin login tokens and admin business account ids //
  let firstAdmin: IAdministrator, secondAdmin: IAdministrator;
  let firstAdminToken: string, secondAdminToken: string;
  let firstAdminBusAcctId: string, secondAdminBusAcctId: string;
  // admin Product models //
  let firstAdminsProduct: IProduct;
  let secondAdminsProduct: IProduct;
  // admin ProductImage models //
  let firstAdminsProductImage: IProductImage;
  let secondAdminsProductImage: IProductImage;
  // created and deleted images //
  let createdImage: IProductImage;
  let deletedImage: IProductImage;
  // aditonal variables //
  let productImageModelCount: number;

  before((done) => {
    setupProductImgControllerTests()
      .then(({ admins, busAccountIds, products, productImages }) => {
        ({ firstAdmin, secondAdmin } = admins);
        ({ firstAdminsProduct, secondAdminsProduct } = products);
        ({ firstAdminBusAcctId, secondAdminBusAcctId } = busAccountIds);
        [ firstAdminsProductImage, secondAdminsProductImage ] = productImages.firstAdminsProductImgs;
        return ProductImage.countDocuments().exec();
      })
      .then((number) => {
        productImageModelCount = number;
        return loginAdmins(chai, server, [ firstAdmin, secondAdmin ]);
      })
      .then((adminTokensArr) => {
        [ firstAdminToken, secondAdminToken ] = adminTokensArr;
        done();
      })
      .catch((err) => {
        done(err);
      })
  })
  after((done) => {
    cleanUpProductImgControllerTests(firstAdminBusAcctId, secondAdminBusAcctId)
      .then(() => {
        return clearDB();
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });      
  });

  // CONTEXT POST/DELETE API tests with LOGIN and CORRECT business account //
  context("POST/DELETE  'ProductImgUplController' API tests - LOGGED IN - CORRECT BUSINESS ACCOUNT - CREATE_IMAGE, DELETE_IMAGE actions", () => {

    // TEST POST 'ProductImagesController' login and correct bus account CREATE_IMAGE  action //
    describe("POST '/api/uploads/product_images/:productId' - LOGGED IN and CORRECT BUSINESS ACCOUNT - Multer Upload and CREATE_IMAGE action", () => {

      it("Should upload and create 'ProductImage model' send back apropriate response", (done) => {
        const testImgPath = path.join(path.resolve(), "app", "_tests_", "api", "test_images", "test.jpg");
        
        chai.request(server)
          .post("/api/uploads/product_images/" + firstAdminsProduct._id)
          .set({ "Authorization": firstAdminToken })
          .attach("productImage", fs.readFileSync(testImgPath), "test.jpg")
          .end((err, response) => {
            if (err) done(err);
            createdImage = response.body.newProductImage;
            // assert correct response //
            expect(response.status).to.equal(200);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.newProductImage).to.be.an("object");
            expect(response.body.updatedProduct).to.be.an("object");
            // 
            expect(response.body.error).to.be.undefined;
            expect(response.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly set all fields in new 'ProductImage' model", () => {
        expect(createdImage.businessAccountId).to.be.a("string");
        expect(createdImage.fileName).to.be.a("string");
        expect(createdImage.url).to.be.a("string");
        expect(createdImage.absolutePath).to.be.a("string");
        expect(createdImage.imagePath).to.be.a("string");
        expect(createdImage.createdAt).to.be.a("string");
      });
      it("Should correctly set the 'url' property on the 'ProductImage' model", (done) => {
        chai.request(server)
          .get(createdImage.url)
          .end((err, response) => {
            if (err) done(err);
            expect(response.status).to.equal(200);
            expect(response.type).to.equal("image/jpeg");
            expect(response.header["content-type"]).to.equal("image/jpeg");
            done();
          });
      });
      it("Should correctly set the 'absolutePath' property on the 'ProductImage' model", (done) => {
        fs.access(createdImage.absolutePath, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (err) => {
          if (err) done (err);
          expect(err).to.be.null;
          done();
        }) 
      });
      it("Should place the image into the upload directory", (done) => {
        let imageDirectory = path.join(path.resolve(), "public", "uploads", "product_images", firstAdminBusAcctId, firstAdminsProduct._id.toString())
        fs.readdir(imageDirectory, (err, files) => {
          if(err) done(err);
          expect(err).to.equal(null);
          expect(files.length).to.equal(2);
          done();
        });
      });
      it("Should create a new 'ProductImage' model in the database", (done) => {
        ProductImage.exists({ _id: createdImage._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should INCREASE the number of 'ProductImage' models by 1", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(productImageModelCount + 1);
            productImageModelCount = number;
            done();
          })
          .catch((err) => {
            done(err); 
          });
      });
      it("Should add the 'ProductImage' to the 'Product' model 'images' subarray ", (done) => {
        Product.findOne({ _id: firstAdminsProduct._id }).exec()
          .then((foundProduct) => {
            const imgId = foundProduct!.images.filter((imgId) => String(imgId) === String(createdImage._id));
            expect(imgId.length).to.equal(1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should INCREASE the number of images in the queried Product model by 1", (done) => {
        Product.findOne({ _id: firstAdminsProduct._id }).exec()
          .then((foundProduct) => {
            expect(foundProduct!.images.length).to.equal(firstAdminsProduct.images.length + 1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      
    });
    // END TEST POST 'ProductImagesController' no login CREATE_IMAGE  action //

    // TEST DELETE 'ProductImagesController' DELETE_IMAGE action wih login  and correct bus account //
    describe("DELETE '/api/uploads/product_images/:productImgId/:productId' - WITH LOGIN and BUSINESS_ACCOUNT -  DELETE_IMAGE action", () => {

      it("Should successfully remove the 'ProductImage' and respond with correct response", (done) => {
        chai.request(server)
          .delete("/api/uploads/product_images/" + (createdImage._id as string) + "/" + (firstAdminsProduct._id as string))
          .set({ "Authorization": firstAdminToken })
          .end((err, response) => {
            if (err) done(err);
            deletedImage = response.body.deletedProductImage;
            // assert correct reponse //
            expect(response.status).to.equal(200);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.deletedProductImage).to.be.an("object");
            expect(response.body.updatedProduct).to.be.an("object");
            // 
            expect(response.body.error).to.be.undefined;
            expect(response.body.errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should delete the image file from its directory", (done) => {
        const imagePath = deletedImage.absolutePath
        fs.access(imagePath, fs.constants.F_OK, (err) => {
          expect(err!.code === "ENOENT");
          done();
        });
      });
      it("Should remove the 'ProductImage' model from the database", (done) => {
        ProductImage.exists({ _id: deletedImage._id })
          .then((exists) => {
            expect(exists).to.equal(false);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should DECREASE the number of 'ProductImage' model by 1", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(productImageModelCount - 1);
            productImageModelCount = number;
            done();
          })
          .catch((err) => { 
            done(err); 
          });
      });
      it("Should remove the ProductImage id from the queried 'Product' model", (done) => {
        Product.findOne({ _id: firstAdminsProduct._id }).exec()
          .then((product) => {
            const imgId = product!.images.filter((imgId) => String(imgId) === String(deletedImage._id));
            expect(imgId.length).to.equal(0);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    
    });
    // END TEST DELETE 'ProductImagesController' DELETE_IMAGE action wihout login //
    
  });
  // END CONTEXT POST/DELETE API tests with LOGIN and CORRECT business account //
  
  // CONTEXT POST/DELETE API tests with LOGIN but INCORRECT business account //
  context("POST/DELETE  'ProductImgUplController' API tests - LOGGED IN  - INCORRECT BUSINESS ACCOUNT - CREATE_IMAGE, DELETE_IMAGE actions", () => {

    // TEST POST 'ProductImagesController' login and incorrect bus account CREATE_IMAGE  action //
    describe("POST '/api/uploads/product_images/:productId' - LOGGED IN but INCORRECT BUSINESS ACCOUNT - Multer Upload and CREATE_IMAGE action", () => {

      it("Should NOT upload and create 'ProductImage' model send back apropriate response", (done) => {
        const testImgPath = path.join(path.resolve(), "app", "_tests_", "api", "test_images", "test.jpg");
        
        chai.request(server)
          .post("/api/uploads/product_images/" + firstAdminsProduct._id)
          .set({ "Authorization": secondAdminToken })
          .attach("productImage", fs.readFileSync(testImgPath), "test.jpg")
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            //
            expect(response.body.newProductImage).to.be.undefined;
            expect(response.body.updatedProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT place the image into the upload directory", (done) => {
        let imageDirectory = path.join(path.resolve(), "public", "uploads", "product_images", firstAdminBusAcctId, firstAdminsProduct._id.toString())
        fs.readdir(imageDirectory, (err, files) => {
          if(err) done(err);
          expect(err).to.equal(null);
          expect(files.length).to.equal(1);
          done();
        });
      });
      it("Should NOT alter the number of 'ProductImage' models in the database", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(productImageModelCount);
            done();
          })
          .catch((err) => {
            done(err); 
          });
      });
      it("Should NOT alter the number of images in the queried 'Product' model", (done) => {
        Product.findOne({ _id: firstAdminsProduct._id }).exec()
          .then((foundProduct) => {
            expect(foundProduct!.images.length).to.equal(firstAdminsProduct.images.length);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    });
    // END TEST POST 'ProductImagesController' login and incorrect bus account CREATE_IMAGE  action //

    // TEST DELETE 'ProductImagesController' logged in and inccorrect bus account DELETE_IMAGE action //
    describe("DELETE '/api/uploads/product_images/:createdImgId/:productId/' - WITH LOGIN and BUSINESS_ACCOUNT -  DELETE_IMAGE action", () => {

      it("Should NOT remove the 'ProductImage' and respond with correct error response", (done) => {
        chai.request(server)
          .delete("/api/uploads/product_images/" + (firstAdminsProductImage._id as string) + "/" + (firstAdminsProduct._id as string))
          .set({ "Authorization": secondAdminToken })
          .end((err, response) => {
            if (err) done(err);
            // assert correct response //
            expect(response.status).to.equal(401);
            expect(response.body.responseMsg).to.be.a("string");
            expect(response.body.error).to.be.an("object");
            expect(response.body.errorMessages).to.be.an("array");
            expect(response.body.errorMessages.length).to.equal(1);
            expect(response.body.errorMessages[0]).to.be.a("string");
            //
            expect(response.body.newProductImage).to.be.undefined;
            expect(response.body.updatedProduct).to.be.undefined;
            done();
          });
      });
      it("Should NOT delete the image from its directory", (done) => {
        const imagePath = firstAdminsProductImage.absolutePath
        fs.access(imagePath, fs.constants.F_OK, (error) => {
          expect(error).to.be.null;
          done();
        });
      });
      it("Should NOT remove the 'ProductImage' model from the database", (done) => {
        ProductImage.exists({ _id: firstAdminsProductImage._id })
          .then((exists) => {
            expect(exists).to.equal(true);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it("Should NOT DECREASE the number of 'ProductImage' model by 1", (done) => {
        ProductImage.countDocuments().exec()
          .then((number) => {
            expect(number).to.equal(productImageModelCount);
            done();
          })
          .catch((err) => { 
            done(err); 
          });
      });
      it("Should NOT remove the ProductImage id from the queried 'Product' model", (done) => {
        Product.findOne({ _id: firstAdminsProduct._id }).exec()
          .then((product) => {
            const imgId = product!.images.filter((imgId) => String(imgId) === String(firstAdminsProductImage._id));
            expect(imgId.length).to.equal(1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    
    });
    // END TEST DELETE 'ProductImagesController' logged in and incorrect bus account DELETE_IMAGE action //

  });
  // END CONTEXT POST/DELETE API tests with LOGIN but INCORRECT business account //
  
});